package be.moneyMaker.dto.external.yahoo;

import be.moneyMaker.dto.DTO;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

/**
 * Created by florian on 13/09/14.
 */
public class ResultYahooIndustryDTO extends DTO {

    private A industry;

    public ResultYahooIndustryDTO() {
    }

    public A getIndustry() {
        return industry;
    }

    public void setIndustry(A industry) {
        this.industry = industry;
    }

    public class A extends DTO {

        private JsonNode company;

        public JsonNode getCompany() {
            return company;
        }

        public void setCompany(JsonNode company) {
            this.company = company;
        }
    }
}
