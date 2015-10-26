package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.data.DataDateDoubleDTO;
import be.moneyMaker.dto.internal.CurrencyValueDTO;
import be.moneyMaker.models.market.Currency;
import be.moneyMaker.models.market.value.CurrencyExchangeValue;
import be.moneyMaker.util.enums.Frequency;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 31/08/14.
 */
public class CurrencyValueToCurrencyValueDTOConverter {

	public CurrencyValueDTO convert(Currency reference,Currency currency, List<CurrencyExchangeValue> valueList, Frequency frequency){

		CurrencyToCurrencyDTOConverter currencyToCurrencyDTOConverter = new CurrencyToCurrencyDTOConverter();

		CurrencyValueDTO currencyValueDTO = new CurrencyValueDTO();

		currencyValueDTO.setReference(currencyToCurrencyDTOConverter.convert(reference));

		currencyValueDTO.setCurrency(currencyToCurrencyDTOConverter.convert(currency));

		currencyValueDTO.setFrequency(frequency);

		List<DataDateDoubleDTO> values = new ArrayList<>();


		for(CurrencyExchangeValue currencyExchangeValue : valueList){
			DataDateDoubleDTO dd = new DataDateDoubleDTO();
			dd.setDate(currencyExchangeValue.getDate());
			dd.setValue(currencyExchangeValue.getValue());
			values.add(dd);
		}

		currencyValueDTO.setValues(values);

		return currencyValueDTO;



	}
}
