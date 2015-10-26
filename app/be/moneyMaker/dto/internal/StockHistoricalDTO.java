package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import java.util.Date;

/**
 * Created by florian on 26/09/14.
 */
public class StockHistoricalDTO extends DTO{

    private StockDTO stockDTO;

    private Date lastVisit;

    public StockHistoricalDTO(StockDTO stockDTO, Date lastVisit) {
        this.stockDTO = stockDTO;
        this.lastVisit = lastVisit;
    }

    public StockHistoricalDTO() {
    }

    public StockDTO getStockDTO() {
        return stockDTO;
    }

    public void setStockDTO(StockDTO stockDTO) {
        this.stockDTO = stockDTO;
    }

    public Date getLastVisit() {
        return lastVisit;
    }

    public void setLastVisit(Date lastVisit) {
        this.lastVisit = lastVisit;
    }

    @Override
    public String toString() {
        return "StockHistoricalDTO{" +
                "stockDTO=" + stockDTO +
                ", lastVisit=" + lastVisit +
                '}';
    }
}
