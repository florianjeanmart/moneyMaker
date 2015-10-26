package be.moneyMaker.converter;

import be.moneyMaker.dto.DTO;
import be.moneyMaker.dto.internal.ListDTO;
import be.moneyMaker.dto.internal.StockHistoricalDTO;
import be.moneyMaker.models.account.StockHistoricalView;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 26/09/14.
 */
public class StockHistoricToStockHistoricsDTOConverter {

    public ListDTO convert(List<StockHistoricalView> stockHistoricalViewList) {

        List<DTO> stockHistoricalDTOs = new ArrayList<>();

        StockToStockDTOConverter converter = new StockToStockDTOConverter();

        for(StockHistoricalView stockHistoricalView : stockHistoricalViewList){
            stockHistoricalDTOs.add(new StockHistoricalDTO(converter.convert(stockHistoricalView.getStock()),stockHistoricalView.getTechnicalSegment().getLastUpdate()));
        }
        return new ListDTO(stockHistoricalDTOs);

    }
}
