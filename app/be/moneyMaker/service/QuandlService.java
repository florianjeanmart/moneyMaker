package be.moneyMaker.service;/*package be.florian.moneyMaker.service;

import be.florian.moneyMaker.dto.external.Quandl.QuandLResponseDTO;
import be.florian.moneyMaker.util.externalComm.HttpRequest;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Created by florian on 30/08/14.
 *//*
public class QuandlService {

	//http://www.quandl.com/api/v1/datasets/WIKI/"+shared+".json?column=4&sort_order=asc&collapse=daily&trim_start=2014-07-28&trim_end=2014-08-28

	//NASDAC
	//http://www.quandl.com/api/v1/datasets/BCB/UDJIAD1.json
	public QuandlService(){


		HashMap<String,String> map = new HashMap<>();
		map.put("column","4");
		map.put("sort_order","asc");
		map.put("collapse","daily");
		map.put("trim_start","2014-07-28");
		map.put("trim_end","2014-08-28");

		HttpRequest request = new HttpRequest();
		play.Logger.info("==>" + request.sendRequest(HttpRequest.RequestMethod.GET, "http://www.quandl.com/api/v1/datasets/WIKI/AAPL.json", map, QuandLDTO.class).toString());
	}

}
*/