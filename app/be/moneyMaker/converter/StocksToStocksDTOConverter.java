package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.StockDTO;
import be.moneyMaker.dto.internal.StocksDTO;
import be.moneyMaker.models.market.Stock;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 1/09/14.
 */
public class StocksToStocksDTOConverter {

	public StocksDTO convert(List<Stock> stockList, int total) {

		StocksDTO dto = new StocksDTO();

		dto.setTotal(total);

		List<StockDTO> stockDTOList = new ArrayList<>();

		StockToStockDTOConverter stockToStockDTOConverter = new StockToStockDTOConverter();

		for (Stock stock : stockList) {
			stockDTOList.add(stockToStockDTOConverter.convert(stock));
		}

		dto.setStockList(stockDTOList);

		return dto;

	}
}
