package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.MarketDTO;
import be.moneyMaker.models.market.Market;

/**
 * Created by florian on 1/09/14.
 */
public class MarketToMarketDTOConverter {

	public MarketDTO convert(Market market){

		MarketDTO marketDTO = new MarketDTO();

		CurrencyToCurrencyDTOConverter currencyToCurrencyDTOConverter = new CurrencyToCurrencyDTOConverter();
		marketDTO.setSymbol(market.getSymbol());

		marketDTO.setName(market.getName());

		return marketDTO;
	}
}
