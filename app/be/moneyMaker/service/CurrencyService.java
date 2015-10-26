package be.moneyMaker.service;

import be.moneyMaker.models.market.Currency;
import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import java.util.List;

/**
 * Created by florian on 31/08/14.
 */
public class CurrencyService {

    public CurrencyService() {
    }

    public List<Currency> getAllCurrencies() {
        return new Currency.Finder(String.class, Currency.class).all();
    }

    public Currency getByName(String name) {
        Query<Currency> query = Ebean.createNamedQuery(Currency.class, Currency.FIND_BY_NAME).setParameter("name", name);

        return query.findUnique();
    }
}
