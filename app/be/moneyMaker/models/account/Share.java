package be.moneyMaker.models.account;

import be.moneyMaker.models.AuditedAbstractEntity;
import be.moneyMaker.models.market.Stock;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.util.Date;

/**
 * Created by florian on 2/09/14.
 */
@Entity
@NamedQueries({
        @NamedQuery(name = Share.FIND_BY_ID, query = "where id = :id"),
})
public class Share extends AuditedAbstractEntity{

    public static final String FIND_BY_ID = "SHARE_FIND_BY_ID";
    @Id
	private Long id;

	@ManyToOne(cascade = {CascadeType.MERGE})
	private Account account;

	@ManyToOne(cascade = {CascadeType.MERGE})
	@Column(nullable = false)
	private Stock stock;

	@Column(nullable = false)
	private Integer number;

	@Column(nullable = false)
	private Date buildDate;

	@Column(nullable = false)
	private Double buildPrice;

	private Date sellDate;

	private Double sellPrice;

	public Share() {
	}

	public Share(Account account, Stock stock, Integer number, Date buildDate) {
		this.account = account;
		this.stock = stock;
		this.number = number;
		this.buildDate = buildDate;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Double getBuildPrice() {
		return buildPrice;
	}

	public void setBuildPrice(Double buildPrice) {
		this.buildPrice = buildPrice;
	}

	public Double getSellPrice() {
		return sellPrice;
	}

	public void setSellPrice(Double sellPrice) {
		this.sellPrice = sellPrice;
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

	public Integer getNumber() {
		return number;
	}

	public void setNumber(Integer number) {
		this.number = number;
	}

	public Date getBuildDate() {
		return buildDate;
	}

	public void setBuildDate(Date buildDate) {
		this.buildDate = buildDate;
	}

	public Date getSellDate() {
		return sellDate;
	}

	public void setSellDate(Date sellDate) {
		this.sellDate = sellDate;
	}


	@Override
	public String toString() {
		return "Share{" +
				"id=" + id +
				", account=" + account +
				", stock=" + stock +
				", number=" + number +
				", buildDate=" + buildDate +
				", buildPrice=" + buildPrice +
				", sellDate=" + sellDate +
				", sellPrice=" + sellPrice +
				'}';
	}
}
