package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import java.util.Date;

/**
 * Created by florian on 1/09/14.
 */
public class StockDTO  extends DTO {

	private String name;

	private String description;

	private String symbol;

	private Double lastValue;

	private Date lastValueDate;

	private Double lastVolume;

    private CurrencyDTO currency;

	private MarketDTO market;

	public StockDTO() {
	}

    public CurrencyDTO getCurrency() {
        return currency;
    }

    public void setCurrency(CurrencyDTO currency) {
        this.currency = currency;
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

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Double getLastValue() {
		return lastValue;
	}

	public void setLastValue(Double lastValue) {
		this.lastValue = lastValue;
	}

	public Date getLastValueDate() {
		return lastValueDate;
	}

	public void setLastValueDate(Date lastValueDate) {
		this.lastValueDate = lastValueDate;
	}

	public Double getLastVolume() {
		return lastVolume;
	}

	public void setLastVolume(Double lastVolume) {
		this.lastVolume = lastVolume;
	}

	public MarketDTO getMarket() {
		return market;
	}

	public void setMarket(MarketDTO market) {
		this.market = market;
	}

    @Override
    public String toString() {
        return "StockDTO{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", symbol='" + symbol + '\'' +
                ", lastValue=" + lastValue +
                ", lastValueDate=" + lastValueDate +
                ", lastVolume=" + lastVolume +
                ", currency=" + currency +
                ", market=" + market +
                '}';
    }
}
