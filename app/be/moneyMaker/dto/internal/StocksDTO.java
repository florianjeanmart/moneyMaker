package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import java.util.List;

/**
 * Created by florian on 1/09/14.
 */
public class StocksDTO extends DTO{

	private List<StockDTO> stockList;

	private int total;

	public StocksDTO() {
	}

	public List<StockDTO> getStockList() {
		return stockList;
	}

	public void setStockList(List<StockDTO> stockList) {
		this.stockList = stockList;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	@Override
	public String toString() {
		return "StocksDTO{" +
				"stockList=" + stockList +
				", total=" + total +
				'}';
	}
}
