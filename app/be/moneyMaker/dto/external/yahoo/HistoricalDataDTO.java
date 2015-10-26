package be.moneyMaker.dto.external.yahoo;

import be.moneyMaker.dto.DTO;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

/**
 * Created by florian on 21/09/14.
 */
public class HistoricalDataDTO extends DTO{

    @JsonProperty("Date")
    private Date date;

    @JsonProperty("Open")
    private Double open;

    @JsonProperty("High")
    private Double high;

    @JsonProperty("Low")
    private Double low;

    @JsonProperty("Close")
    private Double close;

    @JsonProperty("Volume")
    private Double volume;

    @JsonProperty("Adj_Close")
    private Double adjClose;

    public HistoricalDataDTO() {
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Double getOpen() {
        return open;
    }

    public void setOpen(Double open) {
        this.open = open;
    }

    public Double getHigh() {
        return high;
    }

    public void setHigh(Double high) {
        this.high = high;
    }

    public Double getLow() {
        return low;
    }

    public void setLow(Double low) {
        this.low = low;
    }

    public Double getClose() {
        return close;
    }

    public void setClose(Double close) {
        this.close = close;
    }

    public Double getVolume() {
        return volume;
    }

    public void setVolume(Double volume) {
        this.volume = volume;
    }

    public Double getAdjClose() {
        return adjClose;
    }

    public void setAdjClose(Double adjClose) {
        this.adjClose = adjClose;
    }

    @Override
    public String toString() {
        return "HistoricalDataDTO{" +
                "date=" + date +
                ", open=" + open +
                ", high=" + high +
                ", low=" + low +
                ", close=" + close +
                ", volume=" + volume +
                ", adjClose=" + adjClose +
                '}';
    }
}
