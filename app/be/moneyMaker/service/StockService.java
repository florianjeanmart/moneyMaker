package be.moneyMaker.service;

import com.avaje.ebean.Ebean;
import be.moneyMaker.models.market.Stock;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 31/08/14.
 */
public class StockService {


	private final static String URL = "http://www.quandl.com/api/v2/datasets.json";//?query=*&source_code=GOOG";//per_page=300&page=1

	public List<Stock> getAllStocks() {
		return Ebean.find(Stock.class).findList();
	}

	public Integer getTotalStock() {

		return Ebean.find(Stock.class).findRowCount();
	}

	public List<Stock> getStocks(String symbol, Integer firstResult, Integer maxResult) {

		if (maxResult == null || maxResult > 1000) {
			maxResult = 1000;
		}

		if (firstResult == null) {
			firstResult = 0;
		}

		final List<Stock> result;

		if (symbol == null) {
			result = Ebean.find(Stock.class).setMaxRows(maxResult).setFirstRow(firstResult).findList();
		} else {
			result = Ebean.createNamedQuery(Stock.class, Stock.FIND_LIKE_SYMBOL).setParameter("symbol", symbol).setMaxRows(maxResult).setFirstRow(firstResult).findList();
		}
		return result;
	}

	public List<Stock> searchStocks(String element, int maxResult) {

		if(maxResult>100){
			maxResult=100;
		}

		final List<Stock> result;

		if (element!= null && element.length()>0) {
			result = Ebean.createNamedQuery(Stock.class, Stock.SERACH_BY_SYMBOL_OR_NAME)
					.setParameter("content", element)
					.setMaxRows(maxResult).findList();
		}
		else {
			result = new ArrayList<>();
		}
		return result;
	}

    public Stock findBySymbol(String symbol) {
        return Ebean.createNamedQuery(Stock.class, Stock.FIND_BY_SYMBOL).setParameter("symbol", symbol).findUnique();
    }
}
