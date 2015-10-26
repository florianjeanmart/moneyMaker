package be.moneyMaker;

import be.moneyMaker.models.market.Currency;
import be.moneyMaker.service.CurrencyService;

/**
 * Created by florian on 6/09/14.
 */
public class InitialData {

	public InitialData(){
		addMoney();
	}

	public void addMoney(){

		CurrencyService cs = new CurrencyService();

		if(cs.getAllCurrencies().size()==0){

			new Currency("USD", "$").save();
			new Currency("EUR", "€").save();
			new Currency("GBP", "£").save();

		}

	}


}
