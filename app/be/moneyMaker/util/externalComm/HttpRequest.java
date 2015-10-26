package be.moneyMaker.util.externalComm;

import be.moneyMaker.util.exception.MyException;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import be.moneyMaker.dto.DTO;
import be.moneyMaker.util.exception.MyRuntimeException;
import play.Logger;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by florian on 30/08/14.
 */
public class HttpRequest {


	public enum RequestMethod {
		GET, POST;
	}

	public <T extends DTO> T sendRequest(RequestMethod requestMethod, String site, Map<String, String> params, Class<T> returnExcepted) throws MyException {

		JsonNode actualObj = sendRequest(requestMethod,site,params);

		return DTO.getDTO(actualObj, returnExcepted);
	}

	public JsonNode sendRequest(RequestMethod requestMethod, String site, Map<String, String> params) throws MyException {



        //test connection
        try{
            URL urlTest = new URL("http://www.google.be");
            HttpURLConnection connection = (HttpURLConnection) urlTest.openConnection();
            InputStream is = connection.getInputStream();
        }
        catch(java.net.UnknownHostException e){
            e.printStackTrace();
            throw new MyException("no connection");
        } catch (MalformedURLException e) {
            e.printStackTrace();
            throw new MyException("bad url");
        } catch (IOException e) {
            e.printStackTrace();
            throw new MyException("connection error");
        }


        if(params == null){
			params = new HashMap<>();
		}

		//todo auth for quandl params.put(AUTH_PARAM,AUTH);

		String paramString = buildOption(params);


		try {

			if(!site.contains("http")){
				site="http://"+site;
			}

			if (requestMethod.equals(RequestMethod.GET)) {
				site = site + "?" + buildOption(params);
			}

			URL url = new URL(site);

			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod(requestMethod.toString());
			connection.setRequestProperty("Content-Type",
					"application/x-www-form-urlencoded");

			if (requestMethod.equals(RequestMethod.POST)) {
				connection.setRequestProperty("Content-Length", "" +
						Integer.toString(paramString.getBytes().length));
			}
			connection.setRequestProperty("Content-Language", "en-US");

			connection.setUseCaches(false);
			connection.setDoInput(true);
			connection.setDoOutput(true);

			//Send request
			if (requestMethod.equals(RequestMethod.POST)) {
				DataOutputStream wr = new DataOutputStream(
						connection.getOutputStream());
				wr.writeBytes(paramString);
				wr.flush();
				wr.close();
			}

			Logger.info("Send request... ("+url+")");

			//Get Response
			InputStream is = connection.getInputStream();
			BufferedReader rd = new BufferedReader(new InputStreamReader(is));
			String line;
			StringBuffer response = new StringBuffer();
			while ((line = rd.readLine()) != null) {
				response.append(line);
				response.append('\r');
			}
			rd.close();

			Logger.info("Request finish ! ");

			ObjectMapper mapper = new ObjectMapper();
			JsonFactory factory = mapper.getJsonFactory(); // since 2.1 use mapper.getFactory() instead
			JsonParser jp = factory.createJsonParser(response.toString());
			return mapper.readTree(jp);

		} catch (MalformedURLException e) {
			throw new MyException(e, "URL malformed");
		} catch (IOException e) {
			throw new MyException(e, "URL error");
		}


	}

	private String buildOption(Map<String, String> params) {
		if(params==null){
			return "";
		}

		String content = "";
		boolean first = false;
		for (Map.Entry<String, String> entry : params.entrySet()) {
			if (first) {
				first = false;
			} else {
				content += "&";
			}
			content += entry.getKey() + "=" + entry.getValue();
		}
		return content;
	}
}
