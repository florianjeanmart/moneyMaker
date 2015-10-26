package be.moneyMaker.dto.external.yahoo;

import be.moneyMaker.dto.DTO;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by florian on 14/09/14.
 */
public class QuotesDTO extends DTO {

    private String symbol;

    @JsonProperty("Name")
    private String name;

    @JsonProperty("Currency")
    private String currency;

    @JsonProperty("MarketCapitalization")
    private String marketCapitalization;

    @JsonProperty("StockExchange")
    private String stockExchange;

    public QuotesDTO() {
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getMarketCapitalization() {
        return marketCapitalization;
    }

    public void setMarketCapitalization(String marketCapitalization) {
        this.marketCapitalization = marketCapitalization;
    }

    public String getStockExchange() {
        return stockExchange;
    }

    public void setStockExchange(String stockExchange) {
        this.stockExchange = stockExchange;
    }

    @Override
    public String toString() {
        return "QuotesDTO{" +
                "symbol='" + symbol + '\'' +
                ", name='" + name + '\'' +
                ", currency='" + currency + '\'' +
                ", marketCapitalization=" + marketCapitalization +
                ", stockExchange='" + stockExchange + '\'' +
                '}';
    }
}
