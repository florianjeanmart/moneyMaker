package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;
import be.moneyMaker.dto.internal.data.DataDateDoubleDTO;
import be.moneyMaker.util.enums.Frequency;

import java.util.List;

/**
 * Created by florian on 31/08/14.
 */
public class CurrencyValueDTO extends DTO{

	private CurrencyDTO reference;

	private CurrencyDTO currency;

	private Frequency frequency;

	private List<DataDateDoubleDTO> values;

	public CurrencyValueDTO() {
	}

	public CurrencyDTO getReference() {
		return reference;
	}

	public void setReference(CurrencyDTO reference) {
		this.reference = reference;
	}

	public CurrencyDTO getCurrency() {
		return currency;
	}

	public void setCurrency(CurrencyDTO currency) {
		this.currency = currency;
	}

	public Frequency getFrequency() {
		return frequency;
	}

	public void setFrequency(Frequency frequency) {
		this.frequency = frequency;
	}

	public List<DataDateDoubleDTO> getValues() {
		return values;
	}

	public void setValues(List<DataDateDoubleDTO> values) {
		this.values = values;
	}

	@Override
	public String toString() {
		return "CurrencyValueDTO{" +
				"reference=" + reference +
				", currency=" + currency +
				", frequency=" + frequency +
				", values=" + values +
				'}';
	}
}
