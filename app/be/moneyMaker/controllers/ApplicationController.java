/*
 *
 * Instant Play Framework
 * AWAC
 *
 *
 * Copyright (c) 2014 Factor-X.
 * Author Gaston Hollands
 *
 */

package be.moneyMaker.controllers;

import be.moneyMaker.dto.ResultDTO;
import be.moneyMaker.service.IndustryService;
import be.moneyMaker.service.StockLoaderService;
import play.Routes;
import play.mvc.Controller;
import play.mvc.Result;

public class ApplicationController extends Controller {

	public Result index() {
		return ok(be.moneyMaker.views.html.index.render());
	}

	public Result javascriptRoutes() {
		response().setContentType("text/javascript");
		return ok(Routes.javascriptRouter("jsRoutes"
				// Routes
		));
	}

	public Result test() {

		IndustryService industryService = new IndustryService();
		industryService.loadAndSaveValue();

		return ok(new ResultDTO("Stocks are loading. PLease wait some minuts"));
	}
}
