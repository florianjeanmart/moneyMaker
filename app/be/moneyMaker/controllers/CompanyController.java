package be.moneyMaker.controllers;

import be.moneyMaker.converter.CompaniesToAutoCompletionDTOConverter;
import be.moneyMaker.converter.StocksToAutoCompletionDTOConverter;
import be.moneyMaker.models.market.Company;
import be.moneyMaker.models.market.Stock;
import be.moneyMaker.service.CompanyService;
import be.moneyMaker.service.StockService;
import play.mvc.Controller;
import play.mvc.Result;

import java.util.List;

/**
 * Created by florian on 1/10/14.
 */
public class CompanyController extends Controller{


    private CompanyService companyService = new CompanyService();

    public Result getCompaniesByAutoCompletion(String element) {

        //load stock
        List<Company> companyList = companyService.searchCompany(element, 10);

        //convert to DTO
        CompaniesToAutoCompletionDTOConverter converter = new CompaniesToAutoCompletionDTOConverter();

        return ok(converter.convert(companyList));
    }
}
