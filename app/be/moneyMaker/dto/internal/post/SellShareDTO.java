package be.moneyMaker.dto.internal.post;

import be.moneyMaker.dto.DTO;

import java.util.Date;

/**
 * Created by florian on 7/09/14.
 */
public class SellShareDTO extends DTO{

	private Long shareId;

	private Date date;

	private Integer number;

	private Double price;

	public SellShareDTO() {
	}

    public Long getShareId() {
        return shareId;
    }

    public void setShareId(Long shareId) {
        this.shareId = shareId;
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
        return "SellShareDTO{" +
                "shareId=" + shareId +
                ", date=" + date +
                ", number=" + number +
                ", price=" + price +
                '}';
    }
}
