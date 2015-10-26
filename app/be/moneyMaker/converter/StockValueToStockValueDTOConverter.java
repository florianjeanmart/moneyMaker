package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.StockValuesDTO;
import be.moneyMaker.models.market.value.StockValue;

/**
 * Created by florian on 21/09/14.
 */
public class StockValueToStockValueDTOConverter {

    public StockValuesDTO convert(StockValue stockValue ){
        StockValuesDTO stockValuesDTO = new StockValuesDTO();

        stockValuesDTO.setDate(stockValue.getDate());
        stockValuesDTO.setValueClose(stockValue.getCloseValue());
        stockValuesDTO.setValueOpen(stockValue.getOpenValue());
        stockValuesDTO.setValueMax(stockValue.getValueMax());
        stockValuesDTO.setValueMin(stockValue.getValueMin());
        stockValuesDTO.setVolume(stockValue.getVolume());

        return stockValuesDTO;
    }
}
