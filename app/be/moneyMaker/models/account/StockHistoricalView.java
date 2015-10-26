package be.moneyMaker.models.account;

import be.moneyMaker.models.AuditedAbstractEntity;
import be.moneyMaker.models.market.Stock;
import play.db.ebean.Model;

import javax.persistence.*;

/**
 * Created by florian on 22/09/14.
 */
@Entity
@NamedQueries({
        @NamedQuery(name = StockHistoricalView.FIND_BY_ID, query = "where stock.id = :stockId"),
        @NamedQuery(name = StockHistoricalView.FIND_WITH_LIMIT, query = "limit :limit order by lastUpdate desc"),
})
public class StockHistoricalView extends AuditedAbstractEntity{

    public static final String FIND_BY_ID = "StockHistoricalView_FIND_BY_ID";
    public static final String FIND_WITH_LIMIT = "StockHistoricalView_FIND_WITH_LIMIT";


    @Id
    private Long id;

    @ManyToOne(cascade = {CascadeType.MERGE})
    private Account account;

    @ManyToOne(cascade = {CascadeType.MERGE})
    @Column(nullable = false, unique = true)
    private Stock stock;

    public StockHistoricalView() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    @Override
    public String toString() {
        return "StockHistoricalView{" +
                "id=" + id +
                ", account=" + account +
                ", stock=" + stock +
                '}';
    }
}
