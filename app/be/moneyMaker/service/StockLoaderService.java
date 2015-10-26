package be.moneyMaker.service;

import be.moneyMaker.dto.external.Serializer.JsonParserUtil;
import be.moneyMaker.dto.external.yahoo.CompanyDTO;
import be.moneyMaker.dto.external.yahoo.QuotesDTO;
import be.moneyMaker.dto.external.yahoo.ResultYahooIndustryDTO;
import be.moneyMaker.dto.external.yahoo.ResultYahooQuotesDTO;
import be.moneyMaker.models.market.*;
import be.moneyMaker.util.exception.MyException;
import be.moneyMaker.util.externalComm.HttpRequest;
import be.moneyMaker.util.externalComm.YahooApiRequest;
import be.moneyMaker.util.log.Log;
import com.avaje.ebean.Ebean;
import play.Logger;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by florian on 7/09/14.
 */
public class StockLoaderService implements Runnable {

    public boolean loadSpecificStock(Company company) {
        String request = "";
        return loadStocks(request, new Log(),1);
    }


    @Override
    public void run() {
        Logger.info("START....  kk");
        loadAllStocks();
    }

    private final static String URL = "http://www.quandl.com/api/v2/datasets.json";//?query=*&source_code=GOOG";//per_page=300&page=1

    public void loadAllStocks() {

        Logger.info("START....");

        Log log = new Log();

        StockService stockService = new StockService();

        IndustryService industryService = new IndustryService();

        CompanyService companyService = new CompanyService();

        Pattern pattern = Pattern.compile("^[a-zA-Z]+.+$");

        List<Company> allCompaniesName = new ArrayList<>();

        //load all companies
        if (companyService.getTotalCompany() == 0) {

            for (Sector sector : industryService.getAllSector()) {

                List<Industry> industries = industryService.getIndustriesBySector(sector);

                for (Industry industry : industries) {
                    allCompaniesName.addAll(loadCompaniesName(industry));
                }
            }

            Logger.info(allCompaniesName.toString());
        } else {
            allCompaniesName = companyService.getAll();
        }

        //load stocks
        String currentRequest = "";
        boolean first = true;
        int count = 0;
        List<String> requests = new ArrayList<>();
        for (Company company : allCompaniesName) {

            Matcher matcher = pattern.matcher(company.getSymbol());

            if (matcher.find() && stockService.findBySymbol(company.getSymbol()) == null) {

                if (first) {
                    first = false;
                } else {
                    currentRequest += ",";
                }
                currentRequest += "%22" + company.getSymbol() + "%22";

                if (count >= 50) {
                    requests.add(currentRequest);
                    currentRequest = "";
                    first = true;
                    count = 0;
                } else {
                    count++;
                }
            } else {
                //log.addEntry("Symbol ejected : "+company.getSymbol());
            }
        }
        requests.add(currentRequest);

        int requestCounter = 0;
        for (String request : requests) {

            Logger.info("REQUEST " + ++requestCounter + "/" + (requests.size()));
            loadStocks(request, log,50);
        }

        log.print("stockLoader.log");

        Logger.info("... STOP !");

    }

    private List<Company> loadCompaniesName(Industry industry) {

        Logger.info("Loading company name for industry : " + industry);

        JsonParserUtil jsonParserUtil = new JsonParserUtil();

        List<Company> companyList = new ArrayList<>();

        YahooApiRequest yahooApiRequest = new YahooApiRequest();

        Map<String, String> params = new HashMap<>();
        params.put("q", "select%20*%20from%20yahoo.finance.industry%20where%20id%3D%22" + industry.getReference() + "%22");
        params.put("format", "json");
        params.put("diagnostics", "false");
        params.put("env", "http%3A%2F%2Fdatatables.org%2Falltables.env");

        ResultYahooIndustryDTO result = null;
        try {
            result = yahooApiRequest.sendRequest(HttpRequest.RequestMethod.GET, YahooApiRequest.URL_YAHOO, params, ResultYahooIndustryDTO.class);
        } catch (MyException e) {
            e.printStackTrace();
        }

        CompanyService companyService = new CompanyService();

        if (result.getIndustry().getCompany() == null) {
            Logger.error("cannot found any company for the industry : " + industry);
            return companyList;
        }

        for (CompanyDTO companyDTO : jsonParserUtil.convertToListCompanyDTO(result.getIndustry().getCompany())) {

            //control unique symbol
            if (companyService.findBySymbol(companyDTO.getSymbol()) == null) {

                //...and control into list
                boolean founded = false;
                for (Company company : companyList) {
                    if (company.getSymbol().equals(companyDTO.getSymbol())) {
                        founded = true;
                        break;
                    }
                }

                if (!founded) {

                    Company company = new Company();
                    company.setIndustry(industry);
                    company.setName(companyDTO.getName());
                    company.setSymbol(companyDTO.getSymbol());

                    Logger.info(company.toString());

                    companyList.add(company);
                }
            }
        }

        Ebean.save(companyList);

        return companyList;
    }

    private boolean loadStocks(String request, Log log, int expectedResults) {

        boolean result=true;

        YahooApiRequest yahooApiRequest = new YahooApiRequest();

        CurrencyService currencyService = new CurrencyService();

        MarketService marketService = new MarketService();

        CompanyService companyService = new CompanyService();

        //
        //load company
        //
        Map<String, String> params = new HashMap<>();

        String qParam = "select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" + request + ")%0A%09%09";

        params.put("q", qParam);
        params.put("format", "json");
        params.put("diagnostics", "false");
        params.put("env", "http%3A%2F%2Fdatatables.org%2Falltables.env");

        log.addEntry("REQUEST : " + qParam);

        ResultYahooQuotesDTO result2 = null;
        try {
            result2 = yahooApiRequest.sendRequest(HttpRequest.RequestMethod.GET, YahooApiRequest.URL_YAHOO, params, ResultYahooQuotesDTO.class);
        } catch (MyException e) {
            e.printStackTrace();
        }


        if (result2 != null) {
            StockService stockService = new StockService();

            List<QuotesDTO> quotesDTOList = JsonParserUtil.convertToListQuotesDTO(result2.getQuote());

            if (quotesDTOList.size() != expectedResults) {
                log.addEntry("ERROR : nb result : " + quotesDTOList.size());
                result = false;
            }


            for (QuotesDTO quotesDTO : quotesDTOList) {

                if (quotesDTO.getCurrency() != null && quotesDTO.getSymbol() != null && quotesDTO.getStockExchange() != null) {

                    //test if the stock already exist
                    if (stockService.findBySymbol(quotesDTO.getSymbol()) != null) {
                        log.addEntry("THIS SYMBOL ALREADY EXISTS : " + quotesDTO.getSymbol());
                        continue;
                    }
                    //test currency
                    Currency currency = currencyService.getByName(quotesDTO.getCurrency().toUpperCase());
                    if (currency == null) {
                        currency = new Currency(quotesDTO.getCurrency());
                        currency.save();
                    }

                    //test market
                    Market market = marketService.findBySymbol(quotesDTO.getStockExchange());

                    if (market == null) {
                        market = new Market(quotesDTO.getStockExchange());
                        market.save();
                    }


                    Stock stock = new Stock();
                    stock.setName(quotesDTO.getName());
                    stock.setSymbol(quotesDTO.getSymbol());
                    stock.setMarket(market);
                    stock.setCurrency(currency);
                    stock.setCompany(companyService.findBySymbol(quotesDTO.getSymbol()));
                    stock.save();

                    log.addEntry("SUCCESS : " + stock.toString());

                } else {
                    log.addEntry("ERROR : DATA EMPTY : " + quotesDTO.toString());
                }
            }
        } else {
            log.addEntry("ERROR : not request result");
        }

        return result;
    }
}
