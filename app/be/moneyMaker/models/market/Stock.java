package be.moneyMaker.models.market;

import be.moneyMaker.models.AuditedAbstractEntity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by florian on 29/08/14.
 */
@Entity
@NamedQueries({
        @NamedQuery(name = Stock.FIND_BY_SYMBOL, query = "where symbol = :symbol"),
        @NamedQuery(name = Stock.FIND_LIKE_SYMBOL, query = "where symbol like \"%\":symbol\"%\""),
        @NamedQuery(name = Stock.COUNT, query = "SELECT COUNT(c) FROM Stock c"),
        @NamedQuery(name = Stock.SERACH_BY_SYMBOL_OR_NAME, query = "WHERE symbol LIKE \"%\":content\"%\" OR name LIKE \"%\":content\"%\" "),
})
public class Stock extends AuditedAbstractEntity implements Comparable<Stock> {

    public static final String FIND_BY_SYMBOL = "STOCK_FIND_BY_SYMBOL";
    public static final String FIND_LIKE_SYMBOL = "STOCK_FIND_LIKE_SYMBOL";
    public static final String COUNT = "STOCK_COUNT";
    public static final String SERACH_BY_SYMBOL_OR_NAME = "STOCK_SERACH_BY_SYMBOL_OR_NAME";

    @Id
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(unique = true)
    private String symbol;

    private Date fromDate;

    @Column(columnDefinition = "DATETIME default \"1970-01-01 00:00:01\"", nullable = false)
    private Date lastLoading = new Date(0L);

    @ManyToOne(cascade = {CascadeType.MERGE})
    @Column(nullable = false)
    private Market market;

    @ManyToOne(cascade = {CascadeType.MERGE})
    @Column(nullable = false)
    private Currency currency;

    @ManyToOne(cascade = {CascadeType.MERGE})
    private Company company;

    public Stock() {
    }

    public Date getLastLoading() {
        return lastLoading;
    }

    public void setLastLoading(Date lastLoading) {
        this.lastLoading = lastLoading;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public static String getFindBySymbol() {
        return FIND_BY_SYMBOL;
    }

    public Date getFromDate() {
        return fromDate;
    }

    public void setFromDate(Date fromDate) {
        this.fromDate = fromDate;
    }

    public Market getMarket() {
        return market;
    }

    public void setMarket(Market market) {
        this.market = market;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    @Override
    public String toString() {
        return "Stock{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", symbol='" + symbol + '\'' +
                ", fromDate=" + fromDate +
                ", lastLoading=" + lastLoading +
                ", market=" + market +
                ", currency=" + currency +
                ", company=" + company +
                '}';
    }

    @Override
    public int compareTo(Stock o) {
        return this.getSymbol().compareTo(o.getSymbol());
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public Currency getCurrency() {
        return currency;
    }

}
