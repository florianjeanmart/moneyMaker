package be.moneyMaker.service;

import be.moneyMaker.models.market.Market;
import com.avaje.ebean.Ebean;

/**
 * Created by florian on 14/09/14.
 */
public class MarketService {

	public Market findBySymbol(String symbol) {

		return Ebean.createNamedQuery(Market.class, Market.FIND_BY_SYMBOL).setParameter("symbol", symbol).findUnique();

	}


}
