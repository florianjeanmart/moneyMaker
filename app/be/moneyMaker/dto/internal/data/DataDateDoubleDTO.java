package be.moneyMaker.dto.internal.data;

import be.moneyMaker.dto.DTO;

import java.util.Date;

/**
 * Created by florian on 31/08/14.
 */
public class DataDateDoubleDTO extends DTO{

	private Date date;

	private Double value;

	public DataDateDoubleDTO() {
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Double getValue() {
		return value;
	}

	public void setValue(Double value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "DataDateDoubleDTO{" +
				"date=" + date +
				", value=" + value +
				'}';
	}
}
