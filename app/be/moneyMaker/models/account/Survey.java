package be.moneyMaker.models.account;

import be.moneyMaker.models.AuditedAbstractEntity;
import be.moneyMaker.models.market.Stock;

import java.util.Date;
import javax.persistence.*;

/**
 * Created by florian on 4/09/14.
 */
@Entity
public class Survey extends AuditedAbstractEntity{

	@Id
	private Long id;

	@ManyToOne(cascade = {CascadeType.MERGE})
	@Column(nullable = false)
	private Account account;

	@ManyToOne(cascade = {CascadeType.MERGE})
	@Column(nullable = false)
	private Stock stock;

	@Column(nullable = false)
	private Date startDate;

	private Date endDate;

	public Survey() {
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

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	@Override
	public String toString() {
		return "Survey{" +
				"id=" + id +
				", account=" + account +
				", stock=" + stock +
				", startDate=" + startDate +
				", endDate=" + endDate +
				'}';
	}
}
