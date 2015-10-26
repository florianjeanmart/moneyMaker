package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.CurrenciesDTO;
import be.moneyMaker.dto.internal.CurrencyDTO;
import be.moneyMaker.models.market.Currency;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 31/08/14.
 */
public class CurrenciesToCurrenciesDTOConverter {

	public CurrenciesDTO convert(List<Currency> currencies){

		CurrencyToCurrencyDTOConverter currencyToCurrencyDTOConverter = new CurrencyToCurrencyDTOConverter();

		CurrenciesDTO currencyDTO = new CurrenciesDTO();

		List<CurrencyDTO> currencyDTOs = new ArrayList<>();

		for(Currency currency : currencies){
			currencyDTOs.add(currencyToCurrencyDTOConverter.convert(currency));
		}
		currencyDTO.setCurrenciesList( currencyDTOs);

		return currencyDTO;


	}
}
