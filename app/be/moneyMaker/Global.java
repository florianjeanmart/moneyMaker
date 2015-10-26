package be.moneyMaker;/*
 *
 * Instant Play Framework
 * AWAC
 *                       
 *
 * Copyright (c) 2014 Factor-X.
 * Author Gaston Hollands
 *
 */

import be.moneyMaker.dto.internal.ExceptionsDTO;
import play.Application;
import play.GlobalSettings;
import play.Logger;
import play.libs.F;
import play.libs.F.Promise;
import play.mvc.Http.RequestHeader;
import play.mvc.Results;
import play.mvc.SimpleResult;

// Spring imports

public class Global extends GlobalSettings {

	@Override
	public void onStart(Application application) {

		//new InitialData();

	}


	@Override
	public Promise<SimpleResult> onError(RequestHeader request, Throwable t) {
		ExceptionsDTO exceptionsDTO = new ExceptionsDTO(t.getCause().getMessage());

		Logger.error("ERROR into global : " + exceptionsDTO.getMessage());

		return Promise.<SimpleResult>pure(Results.internalServerError(exceptionsDTO
		));
	}

}

