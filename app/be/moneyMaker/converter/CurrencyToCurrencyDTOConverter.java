package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.CurrencyDTO;
import be.moneyMaker.models.market.Currency;

/**
 * Created by florian on 31/08/14.
 */
public class CurrencyToCurrencyDTOConverter {

	public CurrencyDTO convert(Currency currency){
		CurrencyDTO currencyDTO = new CurrencyDTO();

		currencyDTO.setName(currency.getName());
		currencyDTO.setSymbol(currency.getSymbol());

		return currencyDTO;


	}
}
