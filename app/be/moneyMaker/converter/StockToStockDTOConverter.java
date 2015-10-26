package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.StockDTO;
import be.moneyMaker.models.market.Stock;
import be.moneyMaker.models.market.value.StockValue;
import be.moneyMaker.service.StockValueService;

/**
 * Created by florian on 1/09/14.
 */
public class StockToStockDTOConverter {

	public StockDTO convert(Stock stock) {

        CurrencyToCurrencyDTOConverter currencyToCurrencyDTOConverter = new CurrencyToCurrencyDTOConverter();

		StockDTO dto = new StockDTO();

		dto.setName(stock.getName());
		dto.setSymbol(stock.getSymbol());
		dto.setDescription(stock.getDescription());
        dto.setCurrency(currencyToCurrencyDTOConverter.convert(stock.getCurrency()));


		StockValueService stockValueService = new StockValueService();

		StockValue stockValue = stockValueService.getLastValue(stock);

		if(stockValue!=null) {
			dto.setLastValue(stockValue.getCloseValue());
			dto.setLastValueDate(stockValue.getDate());
			dto.setLastVolume(stockValue.getVolume());
		}
		if(stock.getMarket()!=null) {
			MarketToMarketDTOConverter marketToMarketDTOConverter = new MarketToMarketDTOConverter();
			dto.setMarket(marketToMarketDTOConverter.convert(stock.getMarket()));
		}

		return dto;

	}
}
