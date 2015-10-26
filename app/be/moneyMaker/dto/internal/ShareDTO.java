package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

/**
 * Created by florian on 7/09/14.
 */
public class ShareDTO extends DTO{

    private Long shareId;

	@NotNull
	private StockDTO stock;

	@NotNull
	private Integer nbShare;

	@NotNull
	private Date buyDate;

	@NotNull
	private Double buyPrice;

	private Double buyEuroConversion;

	private Date sellDate;

	private Double sellPrice;

	private Double sellEuroConversion;

    private List<StockValuesDTO> stockValues;

	public ShareDTO() {
	}

    public Long getShareId() {
        return shareId;
    }

    public void setShareId(Long shareId) {
        this.shareId = shareId;
    }

    public List<StockValuesDTO> getStockValues() {
        return stockValues;
    }

    public void setStockValues(List<StockValuesDTO> stockValues) {
        this.stockValues = stockValues;
    }

    public Double getBuyEuroConversion() {
		return buyEuroConversion;
	}

	public void setBuyEuroConversion(Double buyEuroConversion) {
		this.buyEuroConversion = buyEuroConversion;
	}

	public Double getSellEuroConversion() {
		return sellEuroConversion;
	}

	public void setSellEuroConversion(Double sellEuroConversion) {
		this.sellEuroConversion = sellEuroConversion;
	}

	public StockDTO getStock() {
		return stock;
	}

	public void setStock(StockDTO stock) {
		this.stock = stock;
	}

	public Date getSellDate() {
		return sellDate;
	}

	public void setSellDate(Date sellDate) {
		this.sellDate = sellDate;
	}

	public Double getSellPrice() {
		return sellPrice;
	}

	public void setSellPrice(Double sellPrice) {
		this.sellPrice = sellPrice;
	}

	public Integer getNbShare() {
		return nbShare;
	}

	public void setNbShare(Integer nbShare) {
		this.nbShare = nbShare;
	}

	public Date getBuyDate() {
		return buyDate;
	}

	public void setBuyDate(Date buyDate) {
		this.buyDate = buyDate;
	}

	public Double getBuyPrice() {
		return buyPrice;
	}

	public void setBuyPrice(Double buyPrice) {
		this.buyPrice = buyPrice;
	}

    @Override
    public String toString() {
        return "ShareDTO{" +
                "stock=" + stock +
                ", nbShare=" + nbShare +
                ", buyDate=" + buyDate +
                ", buyPrice=" + buyPrice +
                ", buyEuroConversion=" + buyEuroConversion +
                ", sellDate=" + sellDate +
                ", sellPrice=" + sellPrice +
                ", sellEuroConversion=" + sellEuroConversion +
                ", stockValues=" + stockValues +
                '}';
    }
}
