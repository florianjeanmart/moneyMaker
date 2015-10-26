package be.moneyMaker.service;

import be.moneyMaker.dto.external.Quandl.QuandlCurrenciesDTO;
import be.moneyMaker.models.market.Currency;
import be.moneyMaker.models.market.CurrencyExchange;
import be.moneyMaker.models.market.value.CurrencyExchangeValue;
import be.moneyMaker.util.DateUtil;
import be.moneyMaker.util.exception.MyException;
import be.moneyMaker.util.externalComm.HttpRequest;
import be.moneyMaker.util.externalComm.QuandlApiRequest;
import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by florian on 29/09/14.
 */
public class CurrencyExchangeValueService {

    private final static String URL_CURRENCY_EXCHANGE_VALUE = "http://www.quandl.com/api/v1/datasets/QUANDL/";

    private final static String START_DATE = "trim_start";


    public CurrencyExchange getCurrencyExchange(Currency reference, Currency currency) {

        Query<CurrencyExchange> query = Ebean.createNamedQuery(CurrencyExchange.class, CurrencyExchange.FIND_BY_REFERENCE_AND_CURRENCY)
                .setParameter("referenceId", reference.getId())
                .setParameter("currencyId", currency.getId());

        CurrencyExchange currencyExchange = query.findUnique();

        if (currencyExchange == null) {
            currencyExchange = new CurrencyExchange();
            currencyExchange.setCurrency(currency);
            currencyExchange.setReference(reference);
            currencyExchange.setLastLoading(new Date(0L));

            currencyExchange.update();
        }

        return currencyExchange;
    }

    public List<CurrencyExchangeValue> getCurrencyValue(Currency reference, Currency currency) {

        //try to  load the currencyExchange
        CurrencyExchange currencyExchange = getCurrencyExchange(reference, currency);

        refreshDataTrying(currencyExchange);

        Query<CurrencyExchangeValue> query = Ebean.createNamedQuery(CurrencyExchangeValue.class, CurrencyExchangeValue.FIND_BY_CURRENCY_EXCHANGE)
                .setParameter("currencyExchangeId", currencyExchange.getId());

        List<CurrencyExchangeValue> result = query.findList();

        Collections.sort(result);

        return result;
    }

    public CurrencyExchangeValue getCurrencyExchangeValue(Currency reference, Currency currency, Date date) {

        //try to  load the currencyExchange
        CurrencyExchange currencyExchange = getCurrencyExchange(reference, currency);

        refreshDataTrying(currencyExchange);

        Query<CurrencyExchangeValue> query = Ebean.createNamedQuery(CurrencyExchangeValue.class, CurrencyExchangeValue.FIND_BY_CURRENCY_EXCHANGE_AND_DATE)
                .setParameter("currencyExchangeId", currencyExchange.getId()).setParameter("date", date);

        CurrencyExchangeValue result = query.findUnique();

        return result;
    }

    /**
     * get all the older currencyExcahgenValue than a determinate date
     *
     * @param currencyExchange
     * @param olderThan
     * @return
     */
    public List<CurrencyExchangeValue> getCurrencyValueOlderThan(CurrencyExchange currencyExchange, Date olderThan) {

        Query<CurrencyExchangeValue> query = Ebean.createNamedQuery(CurrencyExchangeValue.class, CurrencyExchangeValue.FIND_BY_CURRENCY_EXCHANGE_OLDER_THAN)
                .setParameter("currencyExchangeId", currencyExchange.getId())
                .setParameter("date", olderThan);

        return query.findList();
    }

    /**
     * try to refresh data. If data was refresh, the currencyExchange is also refresh.
     *
     * @param currencyExchange
     * @throws MyException throwed when the request was failed for one or other reason (disconnection, ...)s
     */
    public void refreshData(CurrencyExchange currencyExchange) throws MyException {

        //build request
        QuandlApiRequest httpRequest = new QuandlApiRequest();
        String url = URL_CURRENCY_EXCHANGE_VALUE + currencyExchange.getReference().getName() + currencyExchange.getCurrency().getName();
        //params
        HashMap<String, String> params = new HashMap<>();
        params.put(START_DATE, new SimpleDateFormat("yyyy-MM-dd").format(currencyExchange.getLastLoading()));

        //send request
        QuandlCurrenciesDTO result = httpRequest.sendRequest(HttpRequest.RequestMethod.GET, url, params, QuandlCurrenciesDTO.class);

        //recovers old data to  comparative analyse
        List<CurrencyExchangeValue> listCurrencyExchangeValue = new ArrayList<>();

        //load value after request date
        List<CurrencyExchangeValue> oldValues = getCurrencyValueOlderThan(currencyExchange, currencyExchange.getLastLoading());

        for (List<String> data : result.getData()) {


            //control date by comparaison wirth old value
            boolean founded = false;
            for (CurrencyExchangeValue oldValue : oldValues) {
                if (oldValue.getDate().equals(DateUtil.fromString(data.get(0)))) {
                    founded = true;
                    break;
                }
            }
            if (founded) {
                continue;
            }

            //build
            CurrencyExchangeValue currencyExchangeValue = new CurrencyExchangeValue();
            currencyExchangeValue.setCurrencyExchange(currencyExchange);
            currencyExchangeValue.setDate(DateUtil.fromString(data.get(0)));
            currencyExchangeValue.setValue(Double.parseDouble(data.get(1)));

            //add to list
            listCurrencyExchangeValue.add(currencyExchangeValue);
        }

        //update
        currencyExchange.setLastLoading(new Date());
        if (currencyExchange.getId() == null) {
            currencyExchange.save();
        } else {
            currencyExchange.update();
        }

        Ebean.save(listCurrencyExchangeValue);
    }

    /**
     * test if the last refresh is older than last 24h and try to refresh
     */
    private void refreshDataTrying(CurrencyExchange currencyExchange) {

        //test refresh
        if (new Date().getTime() > currencyExchange.getLastLoading().getTime() + (24L * 3600L * 1000L)) {
            try {
                refreshData(currencyExchange);
            } catch (MyException e) {
                e.printStackTrace();
            }
        }
    }
}
