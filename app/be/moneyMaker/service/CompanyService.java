package be.moneyMaker.service;

import be.moneyMaker.dto.external.yahoo.CompanyDTO;
import be.moneyMaker.dto.external.yahoo.IndustryDTO;
import be.moneyMaker.dto.external.yahoo.ResultYahooIndustryDTO;
import be.moneyMaker.models.market.*;
import be.moneyMaker.util.externalComm.HttpRequest;
import be.moneyMaker.util.externalComm.YahooApiRequest;
import com.avaje.ebean.Ebean;

import java.util.*;

/**
 * Created by florian on 13/09/14.
 */
public class CompanyService {

	//https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.industry%20where%20id%3D%22112%22&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=

	private static final String URL_SECTOR = "https://query.yahooapis.com/v1/public/yql";


    public Integer getTotalCompany() {

        return Ebean.find(Company.class).findRowCount();
    }

    public List<Company> getAll() {
        return Ebean.find(Company.class).findList();
    }

    public Company findBySymbol(String symbol) {
        return Ebean.createNamedQuery(Company.class, Company.FIND_BY_SYMBOL).setParameter("symbol", symbol).findUnique();
    }

    public List<Company> searchCompany(String element, int maxResult) {

        if(maxResult>100){
            maxResult=100;
        }

        final List<Company> result;

        if (element!= null && element.length()>0) {
            result = Ebean.createNamedQuery(Company.class, Company.SERACH_BY_SYMBOL_OR_NAME)
                    .setParameter("content", element)
                    .setMaxRows(maxResult).findList();
        }
        else {
            result = new ArrayList<>();
        }
        return result;
    }
}
