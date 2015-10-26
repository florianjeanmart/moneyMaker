package be.moneyMaker.models.market.value;

import be.moneyMaker.models.market.Stock;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by florian on 31/08/14.
 */
@Entity
@NamedQueries({
		@NamedQuery(name = StockValue.FIND_BY_STOCK, query = "where stock.id = :stockId"),
		@NamedQuery(name = StockValue.FIND_BY_STOCK_LAST_ENTRANCE, query = "where stock.id = :stockId order by date DESC limit 1"),
		@NamedQuery(name = StockValue.FIND_BY_STOCK_OLDER_THAN, query = "where stock.id = :stockId AND date >= :date  order by date"),
		@NamedQuery(name = StockValue.FIND_BY_STOCK_AND_DATE, query = "where stock.id = :stockId AND date >= :date  order by date limit 1"),
        @NamedQuery(name = StockValue.FIND_BY_STOCK_AND_START_DATE_AND_END_DATE, query = "where stock.id = :stockId AND date >= :start_date AND date <= :end_date  order by date"),
})
public class StockValue extends Model implements Comparable<StockValue> {

	public final static String FIND_BY_STOCK = "STOCK_FIND_BY_STOCK";
	public final static String FIND_BY_STOCK_LAST_ENTRANCE = "STOCK_FIND_BY_STOCK_LAST_ENTRANCE";
	public static final String FIND_BY_STOCK_OLDER_THAN = "STOCK_FIND_BY_STOCK_OLDER_THAN";
	public static final String FIND_BY_STOCK_AND_DATE = "STOCK_FIND_BY_STOCK_AND_DATE";
    public static final String FIND_BY_STOCK_AND_START_DATE_AND_END_DATE = "STOCK_FIND_BY_STOCK_AND_STAT_DATE_AND_END_DATE";


	@Id
	private Long id;

	private Date date;

	@ManyToOne(cascade = {CascadeType.MERGE})
	private Stock stock;

	private Double openValue;

	private Double closeValue;

	private Double valueMax;

	private Double valueMin;

	private Double volume;

	public StockValue() {
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

	public Stock getStock() {
		return stock;
	}

	public void setStock(Stock stock) {
		this.stock = stock;
	}

	public Double getOpenValue() {
		return openValue;
	}

	public void setOpenValue(Double openValue) {
		this.openValue = openValue;
	}

	public Double getCloseValue() {
		return closeValue;
	}

	public void setCloseValue(Double closeValue) {
		this.closeValue = closeValue;
	}

	public Double getValueMax() {
		return valueMax;
	}

	public void setValueMax(Double valueMax) {
		this.valueMax = valueMax;
	}

	public Double getValueMin() {
		return valueMin;
	}

	public void setValueMin(Double valueMin) {
		this.valueMin = valueMin;
	}

	public Double getVolume() {
		return volume;
	}

	public void setVolume(Double volume) {
		this.volume = volume;
	}

	@Override
	public String toString() {
		return "StockValue{" +
				"id=" + id +
				", date=" + date +
				", stock=" + stock +
				", openValue=" + openValue +
				", closeValue=" + closeValue +
				", valueMax=" + valueMax +
				", valueMin=" + valueMin +
				", volume=" + volume +
				'}';
	}

	@Override
	public int compareTo(StockValue o) {
		return this.getDate().compareTo(o.getDate());
	}
}
