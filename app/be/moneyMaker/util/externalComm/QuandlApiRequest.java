package be.moneyMaker.util.externalComm;

import be.moneyMaker.dto.DTO;
import be.moneyMaker.util.exception.MyException;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by florian on 29/09/14.
 */
public class QuandlApiRequest {

    private final static String AUTH = "LGNofuhnMh3ydfbvdhK9";

    private final static String AUTH_PARAM = "auth_token";

    HttpRequest httpRequest = new HttpRequest();

    public <T extends DTO> T sendRequest(HttpRequest.RequestMethod requestMethod, String site, Map<String, String> params, Class<T> returnExcepted) throws MyException {

        if(params == null)
            params = new HashMap<>();

        params.put(AUTH_PARAM,AUTH);

        return httpRequest.sendRequest(requestMethod, site, params, returnExcepted);
    }
}
