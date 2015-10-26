package be.moneyMaker.controllers;

import be.moneyMaker.converter.*;
import be.moneyMaker.dto.ResultDTO;
import be.moneyMaker.models.account.StockHistoricalView;
import be.moneyMaker.models.market.Stock;
import be.moneyMaker.models.market.value.StockValue;
import be.moneyMaker.service.*;
import play.Logger;
import play.mvc.Result;

import java.util.List;

/**
 * Created by florian on 1/09/14.
 */
public class StockController extends AbstractController {

    public Result initialization() {

        IndustryService industryService = new IndustryService();

        StockLoaderService stockLoaderService = new StockLoaderService();

        StockService stockService = new StockService();

        if (industryService.getAllSector().size() == 0) {

            //1. load sector / industry

            industryService.loadAndSaveValue();
        }

        //2. load company
        stockLoaderService.run();

        return ok(new ResultDTO(""));
    }

    public Result getStocksByAutoCompletion(String element) {

        StockService stockService = new StockService();

        //load stock
        List<Stock> stockList = stockService.searchStocks(element, 10);

        //convert to DTO
        StocksToAutoCompletionDTOConverter converter = new StocksToAutoCompletionDTOConverter();

        return ok(converter.convert(stockList));
    }

    public Result getStocks(String name, Integer first, Integer maxNb) {

        StockService stockService = new StockService();

        //load stock
        List<Stock> stockList = stockService.getStocks(name, first, maxNb);

        //load total
        int total = stockService.getTotalStock();

        //convert to DTO
        StocksToStocksDTOConverter stocksToStocksDTOConverter = new StocksToStocksDTOConverter();

        return ok(stocksToStocksDTOConverter.convert(stockList, total));
    }

    public Result getStock(String code) {
        StockService stockService = new StockService();
        Stock stock = stockService.findBySymbol(code);
        if (stock == null)
            throw new RuntimeException("stock " + code + " not found");

        StockToStockDTOConverter converter = new StockToStockDTOConverter();

        return ok(converter.convert(stock));
    }

    public Result getHistoric() {

        StockHistoricalViewService stockHistoricalViewService = new StockHistoricalViewService();

        StockHistoricToStockHistoricsDTOConverter converter = new StockHistoricToStockHistoricsDTOConverter();

        return ok(converter.convert(stockHistoricalViewService.getLastHistoric(20)));
    }

    public Result getValues(String stockCode) {

        Logger.info("getValues");

        //load stock
        StockService stockService = new StockService();

        StockHistoricalViewService stockHistoricalViewService = new StockHistoricalViewService();


        Stock stock = stockService.findBySymbol(stockCode);

        //refresh the historical consult
        StockHistoricalView historicalView = stockHistoricalViewService.getByStock(stock);
        if (historicalView == null) {
            historicalView = new StockHistoricalView();
            historicalView.setStock(stock);

            historicalView.save();
        } else {
            historicalView.update();
        }


        StockValueService service = new StockValueService();

        List<StockValue> stockValue = service.getStockValues(stock);

        StockValuesToStockValueContainerDTOConverter converter = new StockValuesToStockValueContainerDTOConverter();


        return ok(converter.convert(stock, stockValue));
    }
}
