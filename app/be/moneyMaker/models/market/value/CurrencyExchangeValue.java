package be.moneyMaker.models.market.value;

import be.moneyMaker.models.market.CurrencyExchange;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by florian on 31/08/14.
 */
@Entity
@NamedQueries({
		@NamedQuery(name = CurrencyExchangeValue.FIND_BY_CURRENCY_EXCHANGE, query = "where currencyExchange.id = :currencyExchangeId"),
		@NamedQuery(name = CurrencyExchangeValue.FIND_BY_CURRENCY_EXCHANGE_OLDER_THAN, query = "where currencyExchange.id = :currencyExchangeId AND date >= :date"),
		@NamedQuery(name = CurrencyExchangeValue.FIND_BY_CURRENCY_EXCHANGE_AND_DATE, query = "where currencyExchange.id = :currencyExchangeId AND date >= :date LIMIT 1"),
})
@Table(
		uniqueConstraints=
		@UniqueConstraint(columnNames={"currency_exchange_id", "date"})
)
public class CurrencyExchangeValue extends Model implements  Comparable<CurrencyExchangeValue>{

	public final static String FIND_BY_CURRENCY_EXCHANGE = "CURRENCY_EXCHANGE_VALUE_FIND_BY_CURRENCY_EXCHANGE";
	public final static String FIND_BY_CURRENCY_EXCHANGE_OLDER_THAN = "CURRENCY_EXCHANGE_VALUE_FIND_BY_CURRENCY_EXCHANGE_OLDER_THAN";
	public final static String FIND_BY_CURRENCY_EXCHANGE_AND_DATE = "CURRENCY_EXCHANGE_VALUE_FIND_BY_CURRENCY_EXCHANGE_AND_DATE";



	@Id
	private Long id;

	@Column(nullable = false)
	@Temporal(TemporalType.DATE)
	private Date date;

	@ManyToOne(cascade = {CascadeType.MERGE})
	private CurrencyExchange currencyExchange;

	@Column(nullable = false)
	private Double value;

	public CurrencyExchangeValue() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public CurrencyExchange getCurrencyExchange() {
		return currencyExchange;
	}

	public void setCurrencyExchange(CurrencyExchange currencyExchange) {
		this.currencyExchange = currencyExchange;
	}

	public Double getValue() {
		return value;
	}

	public void setValue(Double value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "CurrencyExchangeValue{" +
				"id=" + id +
				", date=" + date +
				", currencyExchange=" + currencyExchange +
				", value=" + value +
				'}';
	}

	@Override
	public int compareTo(CurrencyExchangeValue o) {
		return this.getDate().compareTo(o.getDate());
	}
}
