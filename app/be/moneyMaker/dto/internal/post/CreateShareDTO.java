package be.moneyMaker.dto.internal.post;

import be.moneyMaker.dto.DTO;

import java.util.Date;

/**
 * Created by florian on 7/09/14.
 */
public class CreateShareDTO extends DTO{

	private String stockName;

	private Date date;

	private Integer number;

	private Double price;
    private Long shareId;
    private Double sellPrice;
    private Date sellDate;

    public CreateShareDTO() {
	}

	public String getStockName() {
		return stockName;
	}

	public void setStockName(String stockName) {
		this.stockName = stockName;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Integer getNumber() {
		return number;
	}

	public void setNumber(Integer number) {
		this.number = number;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	@Override
	public String toString() {
		return "CreateShareDTO{" +
				"stockName='" + stockName + '\'' +
				", date=" + date +
				", number=" + number +
				", price=" + price +
				'}';
	}

    public Long getShareId() {
        return shareId;
    }

    public void setShareId(Long shareId) {
        this.shareId = shareId;
    }

    public Double getSellPrice() {
        return sellPrice;
    }

    public void setSellPrice(Double sellPrice) {
        this.sellPrice = sellPrice;
    }

    public Date getSellDate() {
        return sellDate;
    }

    public void setSellDate(Date sellDate) {
        this.sellDate = sellDate;
    }
}
