package be.moneyMaker.service;

import be.moneyMaker.dto.external.Quandl.StockValueContainerExternalDTO;
import be.moneyMaker.models.market.Stock;
import be.moneyMaker.models.market.value.StockValue;
import be.moneyMaker.util.DateUtil;
import be.moneyMaker.util.exception.MyException;
import be.moneyMaker.util.externalComm.HttpRequest;
import be.moneyMaker.util.externalComm.QuandlApiRequest;
import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by florian on 1/09/14.
 * StockValueService
 */
public class StockValueService {

    private static final String URL_GOOGLE = "http://www.quandl.com/api/v1/datasets/GOOG/$stock-symbole.json";

    private static final String URL_YAHOO = "http://www.quandl.com/api/v1/datasets/YAHOO/$stock-symbole.json";

    private final static String START_DATE = "trim_start";

    public StockValue getLastValue(Stock stock) {

        return Ebean.createNamedQuery(StockValue.class, StockValue.FIND_BY_STOCK_LAST_ENTRANCE).setParameter("stockId", stock.getId()).findUnique();
    }


    public List<StockValue> getStockValues(Stock stock){
        refreshDataTrying(stock);

        Query<StockValue> query = Ebean.createNamedQuery(StockValue.class, StockValue.FIND_BY_STOCK)
                .setParameter("stockId", stock.getId());

        List<StockValue> result = query.findList();

        Collections.sort(result);

        return result;
    }

    public StockValue getStockValue(Stock stock, Date date) {
        refreshDataTrying(stock);
        Query<StockValue> query;


        query = Ebean.createNamedQuery(StockValue.class, StockValue.FIND_BY_STOCK_AND_DATE)
                .setParameter("stockId", stock.getId()).setParameter("date", date);

        StockValue result = query.findUnique();
        return result;
    }

    public List<StockValue> getStockValues(Stock stock, Date startDate, Date endDate) {
        refreshDataTrying(stock);

        Query<StockValue> query;

        if (endDate == null) {
            endDate = new Date();
        }

        query = Ebean.createNamedQuery(StockValue.class, StockValue.FIND_BY_STOCK_AND_START_DATE_AND_END_DATE)
                .setParameter("stockId", stock.getId()).setParameter("start_date", startDate).setParameter("end_date", endDate);

        List<StockValue> result = query.findList();

        return result;
    }

	/* ***************************************
     *************************** PRIVATE
	 ****************************************** */

    /**
     * try to refresh data. If data was refresh, the currencyExchange is also refresh.
     *
     * @throws be.moneyMaker.util.exception.MyException throwed when the request was failed for one or other reason (disconnection, ...)s
     */
    public void refreshData(Stock stock) throws MyException {

        //build request
        QuandlApiRequest httpRequest = new QuandlApiRequest();

        String url = getGoogleUrl(stock);

        //params
        HashMap<String, String> params = new HashMap<>();
        params.put(START_DATE, new SimpleDateFormat("yyyy-MM-dd").format(stock.getLastLoading()));

        //send request
        StockValueContainerExternalDTO result = null;
        try {
            result = httpRequest.sendRequest(HttpRequest.RequestMethod.GET, url, params, StockValueContainerExternalDTO.class);
        } catch (MyException e) {
            url = getYahooUrl(stock);
            //try with yahoo
            result = httpRequest.sendRequest(HttpRequest.RequestMethod.GET, url, params, StockValueContainerExternalDTO.class);
        }

        //recovers old data to  comparative analyse
        List<StockValue> listCurrencyExchangeValue = new ArrayList<>();

        //load value after request date
        List<StockValue> oldValues = getCurrencyValueOlderThan(stock, stock.getLastLoading());

        for (List<String> data : result.getData()) {

            //"Date","Open","High","Low","Close","Volume"

            if (data.get(4) != null) {

                //control date by comparaison wirth old value
                boolean founded = false;
                for (StockValue oldValue : oldValues) {
                    if (oldValue.getDate().equals(DateUtil.fromString(data.get(0)))) {
                        founded = true;
                        break;
                    }
                }
                if (founded) {
                    continue;
                }

                //build
                StockValue stockValue = new StockValue();
                stockValue.setStock(stock);

                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

                try {
                    stockValue.setDate(dateFormat.parse(data.get(0)));
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                if(data.get(1)!=null)
                    stockValue.setOpenValue(Double.parseDouble(data.get(1)));
                if(data.get(2)!=null)
                    stockValue.setValueMax(Double.parseDouble(data.get(2)));
                if(data.get(3)!=null)
                    stockValue.setValueMin(Double.parseDouble(data.get(3)));
                stockValue.setCloseValue(Double.parseDouble(data.get(4)));
                if(data.get(5)!=null)
                    stockValue.setVolume(Double.parseDouble(data.get(5)));

                listCurrencyExchangeValue.add(stockValue);
            }
        }

        //update
        stock.setLastLoading(new Date());
        if (stock.getId() == null) {
            stock.save();
        } else {
            stock.update();
        }

        Ebean.save(listCurrencyExchangeValue);
    }

    /**
     * test if the last refresh is older than last 24h and try to refresh
     */
    private void refreshDataTrying(Stock stock) {

        //test refresh
        if (new Date().getTime() > stock.getLastLoading().getTime() + (24L * 3600L * 1000L)) {
            try {
                refreshData(stock);
            } catch (MyException e) {
                e.printStackTrace();
            }
        }
    }


    /*
        private boolean loadAndSaveValue(Stock stock, Date startDate, Date endDate) {

            YahooApiRequest yahooApiRequest = new YahooApiRequest();

            CurrencyService currencyService = new CurrencyService();

            MarketService marketService = new MarketService();

            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

            String endDateString = dateFormat.format(endDate);

            String startDateString = dateFormat.format(startDate);

            //
            //load company
            //
            Map<String, String> params = new HashMap<>();

            params.put("q", "select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22" + stock.getSymbol() + "%22%20and%20startDate%20%3D%20%22" + startDateString + "%22%20and%20endDate%20%3D%20%22" + endDateString + "%22");
            params.put("format", "json");
            params.put("diagnostics", "false");
            params.put("env", "http%3A%2F%2Fdatatables.org%2Falltables.env");

            ResultYahooQuotesDTO result = yahooApiRequest.sendRequest(HttpRequest.RequestMethod.GET, YahooApiRequest.URL_YAHOO, params, ResultYahooQuotesDTO.class);

            List<StockValue> listCurrencyExchangeValue = new ArrayList<>();

            //load value after request date
            List<StockValue> oldValues = getCurrencyValueOlderThan(stock, startDate);

            for (HistoricalDataDTO data : JsonParserUtil.convertToListHistoricalDataDTO(result.getQuote())) {

                StockValue stockValue = new StockValue();
                stockValue.setStock(stock);

                Date date = data.getDate();

                //control date
                boolean founded = false;
                for (StockValue oldValue : oldValues) {
                    if (oldValue.getDate().equals(date)) {
                        founded = true;
                        break;
                    }
                }
                if (founded) {
                    continue;
                }

                stockValue.setDate(date);
                stockValue.setOpenValue(data.getOpen());
                stockValue.setValueMax(data.getHigh());
                stockValue.setValueMin(data.getLow());
                stockValue.setCloseValue(data.getClose());
                stockValue.setVolume(data.getVolume());

                listCurrencyExchangeValue.add(stockValue);
            }

            //update
            stock.setLastLoading(new Date());
            stock.update();


            Ebean.save(listCurrencyExchangeValue);
            return true;

        }
    */
    private List<StockValue> getCurrencyValueOlderThan(Stock stock, Date olderThan) {

        Query<StockValue> query = Ebean.createNamedQuery(StockValue.class, StockValue.FIND_BY_STOCK_OLDER_THAN)
                .setParameter("stockId", stock.getId())
                .setParameter("date", olderThan);

        return query.findList();
    }

    private String getGoogleUrl(Stock stock) {

        String stockSymbol = stock.getSymbol().split("\\.")[0];

        return URL_GOOGLE.replace("$stock-symbole", stock.getMarket().getGoogleSymbol()+"_"+stockSymbol);
    }

    private String getYahooUrl(Stock stock) {

        return URL_YAHOO.replace("$stock-symbole", stock.getSymbol());
    }

    private Date oneYearBefore(Date startDate) {
        return new Date(startDate.getTime() - (365L * 24L * 3600L * 1000L));
    }

}
