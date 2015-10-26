package be.moneyMaker.models.market;

import be.moneyMaker.models.AuditedAbstractEntity;

import javax.persistence.*;

/**
 * Created by florian on 31/08/14.
 */
@Entity
@NamedQueries({
		@NamedQuery(name = Market.FIND_BY_SYMBOL, query = "where symbol = :symbol"),
})
public class Market extends AuditedAbstractEntity implements  Comparable<Market>{


	public static final String FIND_BY_SYMBOL = "MARKET_FIND_BY_CODE";
	@Id
	private Long id;

	private String name;

	@Column(unique = true, nullable = false)
	private String symbol;

    private String googleSymbol;

	public Market() {
	}

	public Market(String symbol) {
		this.symbol = symbol;
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

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

    public String getGoogleSymbol() {
        return googleSymbol;
    }

    public void setGoogleSymbol(String googleSymbol) {
        this.googleSymbol = googleSymbol;
    }

    @Override
    public String toString() {
        return "Market{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", symbol='" + symbol + '\'' +
                ", googleSymbol='" + googleSymbol + '\'' +
                '}';
    }

    @Override
	public int compareTo(Market o) {
		return this.getSymbol().compareTo(o.getSymbol());
	}
}
