package be.moneyMaker.service;

import be.moneyMaker.models.account.Share;
import be.moneyMaker.models.account.StockHistoricalView;
import be.moneyMaker.models.market.Stock;
import com.avaje.ebean.Ebean;

import java.util.List;

/**
 * Created by florian on 22/09/14.
 */
public class StockHistoricalViewService {

    public StockHistoricalView getByStock(Stock stock) {
        return Ebean.createNamedQuery(StockHistoricalView.class, StockHistoricalView.FIND_BY_ID).setParameter("stockId", stock.getId()).findUnique();
    }

    public List<StockHistoricalView> getLastHistoric(int limit){
       int count =  Ebean.find(StockHistoricalView.class).findRowCount();
        return Ebean.find(StockHistoricalView.class).setFirstRow(count - limit).orderBy("last_update desc").findList();
    }
}
