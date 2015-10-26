package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import java.util.List;

/**
 * Created by florian on 6/09/14.
 */
public class CurrenciesDTO extends DTO{

	private List<CurrencyDTO> currenciesList;

	public CurrenciesDTO() {
	}

	public List<CurrencyDTO> getCurrenciesList() {
		return currenciesList;
	}

	public void setCurrenciesList(List<CurrencyDTO> currenciesList) {
		this.currenciesList = currenciesList;
	}

	@Override
	public String toString() {
		return "CurrenciesDTO{" +
				"currenciesList=" + currenciesList +
				'}';
	}
}
