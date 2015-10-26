package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.StockValueContainerDTO;
import be.moneyMaker.dto.internal.StockValuesDTO;
import be.moneyMaker.models.market.Stock;
import be.moneyMaker.models.market.value.StockValue;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 1/09/14.
 */
public class StockValuesToStockValueContainerDTOConverter {

	public StockValueContainerDTO convert(Stock stock, List<StockValue> stockValues) {

        StockValueToStockValueDTOConverter stockValueToStockValueDTOConverter = new  StockValueToStockValueDTOConverter();

		StockValueContainerDTO dto = new StockValueContainerDTO();

        StockToStockDTOConverter stockToStockDTOConverter = new StockToStockDTOConverter();

		dto.setStock(stockToStockDTOConverter.convert(stock));

		List<StockValuesDTO> stockValuesDTOs = new ArrayList<>();

		for(StockValue stockValue : stockValues){

			stockValuesDTOs.add(stockValueToStockValueDTOConverter.convert(stockValue));
		}

		dto.setValues(stockValuesDTOs);

		return dto;

	}
}
