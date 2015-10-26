package be.moneyMaker.models.market;

import be.moneyMaker.models.AuditedAbstractEntity;

import javax.persistence.*;
import java.util.Date;
import java.util.HashMap;

/**
 * Created by florian on 31/08/14.
 */
@Entity
@NamedQueries({
		@NamedQuery(name = Currency.FIND_BY_NAME, query = "where name= :name"),
})
public class Currency extends AuditedAbstractEntity implements  Comparable<Currency>{

	public final static String FIND_BY_NAME = "CURRENCY_FIND_BY_NAME";

	@Id
	private Long id;

	@Column(unique=true)
	private String name;

	private String symbol;

	private HashMap<Currency, Date> conversion;

	public Currency(String name) {
		this.name = name;
	}

	public Currency(String name, String symbol) {
		this.name = name;
		this.symbol = symbol;
	}

	public HashMap<Currency, Date> getConversion() {
		return conversion;
	}

	public void setConversion(HashMap<Currency, Date> conversion) {
		this.conversion = conversion;
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

	@Override
	public String toString() {
		return "Currency{" +
				"id=" + id +
				", name='" + name + '\'' +
				", symbol='" + symbol + '\'' +
				'}';
	}


	@Override
	public int compareTo(Currency o) {
		return this.getName().compareTo(o.getName());
	}
}
