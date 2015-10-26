package be.moneyMaker.util.externalComm;

import be.moneyMaker.dto.DTO;
import be.moneyMaker.util.exception.MyException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

/**
 * Created by florian on 13/09/14.
 */
public class YahooApiRequest {

    public static final String URL_YAHOO = "https://query.yahooapis.com/v1/public/yql";


    public <T extends DTO> T sendRequest(HttpRequest.RequestMethod requestMethod, String site, Map<String, String> params, Class<T> returnExcepted) throws MyException {

		HttpRequest httpRequest = new HttpRequest();

		JsonNode actualObj = httpRequest.sendRequest(requestMethod, site, params);

		JsonNode query = actualObj.get("query");
		JsonNode results = query.get("results");

		return DTO.getDTO(results, returnExcepted);
	}

}
