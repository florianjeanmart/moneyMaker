package be.moneyMaker.controllers;

import be.moneyMaker.converter.CurrenciesToCurrenciesDTOConverter;
import be.moneyMaker.converter.CurrencyToCurrencyDTOConverter;
import be.moneyMaker.converter.CurrencyValueToCurrencyValueDTOConverter;
import be.moneyMaker.dto.internal.CurrencyDTO;
import be.moneyMaker.dto.internal.post.DoubleToValueDTO;
import be.moneyMaker.models.market.Currency;
import be.moneyMaker.models.market.value.CurrencyExchangeValue;
import be.moneyMaker.service.CurrencyExchangeValueService;
import be.moneyMaker.service.CurrencyService;
import be.moneyMaker.util.enums.Frequency;
import play.Logger;
import play.mvc.Result;

import java.util.Date;

/**
 * Created by florian on 6/09/14.
 */
public class CurrencyController extends AbstractController {


    private CurrencyService currencyService = new CurrencyService();
    private CurrencyExchangeValueService currencyExchangeValueService = new CurrencyExchangeValueService();

	public Result getAll() {

		CurrenciesToCurrenciesDTOConverter converter = new CurrenciesToCurrenciesDTOConverter();

		return ok(converter.convert(currencyService.getAllCurrencies()));
	}

	public Result getValues(String referenceName, String currencyName) {


		Currency currency = currencyService.getByName(currencyName);

		Currency reference = currencyService.getByName(referenceName);

		CurrencyValueToCurrencyValueDTOConverter converter = new CurrencyValueToCurrencyValueDTOConverter();

		return ok(converter.convert(reference,currency, currencyExchangeValueService.getCurrencyValue(reference, currency), Frequency.DAILY));
	}

    public Result getValue(String referenceName, String currencyName, Long dateString) {

        Date date= new Date(dateString);

        Logger.info(date.toString());

        Currency currency = currencyService.getByName(currencyName);

        Currency reference = currencyService.getByName(referenceName);

        CurrencyExchangeValue exchangeValue = currencyExchangeValueService.getCurrencyExchangeValue(reference, currency, date);

        CurrencyExchangeValue lastExchangeValue = currencyExchangeValueService.getCurrencyExchangeValue(reference, currency, new Date(date.getTime() - 24 * 3600 * 1000));

        Double value = (exchangeValue.getValue() + lastExchangeValue.getValue()) / 2;

        DoubleToValueDTO doubleToValueDTO = new DoubleToValueDTO(value);

        return ok(doubleToValueDTO);
    }

	public Result createCurrency(){
		CurrencyDTO dto = extractDTOFromRequest(CurrencyDTO.class);

		Currency currency = currencyService.getByName(dto.getName());

		if(currency!=null){
			throw new RuntimeException("A currency with the same name already exists");
		}

		currency = new Currency(dto.getName(),dto.getSymbol());

		currency.save();


		CurrencyToCurrencyDTOConverter converter = new CurrencyToCurrencyDTOConverter();

		return ok(converter.convert(currency));
	}
}
