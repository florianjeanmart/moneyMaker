package be.moneyMaker.models.market;

import be.moneyMaker.models.AuditedAbstractEntity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by florian on 31/08/14.
 */
@Entity
@NamedQueries({
		@NamedQuery(name = CurrencyExchange.FIND_BY_REFERENCE_AND_CURRENCY, query = "where currency.id= :currencyId and reference.id= :referenceId"),
})
public class CurrencyExchange extends AuditedAbstractEntity{

	public static final String FIND_BY_REFERENCE_AND_CURRENCY = "CURRENCY_EXCHANGE_FIND_BY_REFERENCE_AND_CURRENCY";

	@Id
	private Long id;

	@Column(nullable = false)
	@ManyToOne(cascade = {CascadeType.MERGE}, optional = false)
	private Currency reference;

	@Column(nullable = false)
	@ManyToOne(cascade = {CascadeType.MERGE}, optional = false)
	private Currency currency;

	@Column(nullable = false)
	private Date lastLoading;

	public CurrencyExchange() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Currency getReference() {
		return reference;
	}

	public void setReference(Currency reference) {
		this.reference = reference;
	}

	public Currency getCurrency() {
		return currency;
	}

	public void setCurrency(Currency currency) {
		this.currency = currency;
	}

	public Date getLastLoading() {
		return lastLoading;
	}

	public void setLastLoading(Date lastLoading) {
		this.lastLoading = lastLoading;
	}

	@Override
	public String toString() {
		return "CurrencyExchange{" +
				super.toString()+
				"id=" + id +
				", reference=" + reference +
				", currency=" + currency +
				", lastLoading=" + lastLoading +
				'}';
	}
}
