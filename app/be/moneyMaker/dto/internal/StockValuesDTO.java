package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import java.util.Date;

/**
 * Created by florian on 1/09/14.
 */
public class StockValuesDTO extends DTO {

	private Date date;

	private Double valueOpen;

	private Double valueClose;

	private Double valueMax;

	private Double valueMin;

	private Double volume;

	public StockValuesDTO() {
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Double getValueOpen() {
		return valueOpen;
	}

	public void setValueOpen(Double valueOpen) {
		this.valueOpen = valueOpen;
	}

	public Double getValueClose() {
		return valueClose;
	}

	public void setValueClose(Double valueClose) {
		this.valueClose = valueClose;
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
		return "StockValuesDTO{" +
				"date=" + date +
				", valueOpen=" + valueOpen +
				", valueClose=" + valueClose +
				", valueMax=" + valueMax +
				", valueMin=" + valueMin +
				", volume=" + volume +
				'}';
	}
}
