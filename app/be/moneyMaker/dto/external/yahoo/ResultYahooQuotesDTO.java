package be.moneyMaker.dto.external.yahoo;

import be.moneyMaker.dto.DTO;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

/**
 * Created by florian on 14/09/14.
 */
public class ResultYahooQuotesDTO extends DTO {

    private JsonNode quote;

    public ResultYahooQuotesDTO() {
    }

    public JsonNode getQuote() {
        return quote;
    }

    public void setQuote(JsonNode quote) {
        this.quote = quote;
    }

    @Override
    public String toString() {
        return "ResultYahooQuotesDTO{" +
                "quote=" + quote +
                '}';
    }
}
