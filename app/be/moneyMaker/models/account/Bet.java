package be.moneyMaker.models.account;

import be.moneyMaker.models.AuditedAbstractEntity;
import be.moneyMaker.models.market.Stock;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by florian on 4/09/14.
 */
@Entity
public class Bet extends AuditedAbstractEntity{

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

	@Column(nullable = false)
	private Date targetDate;

	@Column(nullable = false)
	private Double target;

	public Bet() {
	}

	@Override
	public String toString() {
		return "Bet{" +
				"id=" + id +
				", account=" + account +
				", stock=" + stock +
				", startDate=" + startDate +
				", targetDate=" + targetDate +
				", target=" + target +
				'}';
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

	public Date getTargetDate() {
		return targetDate;
	}

	public void setTargetDate(Date targetDate) {
		this.targetDate = targetDate;
	}

	public Double getTarget() {
		return target;
	}

	public void setTarget(Double target) {
		this.target = target;
	}
}
