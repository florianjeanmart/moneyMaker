package be.moneyMaker.controllers;

import be.moneyMaker.dto.DTO;
import play.mvc.Controller;

/**
 * Created by florian on 7/09/14.
 */
public class AbstractController extends Controller {

	protected static <T extends DTO> T extractDTOFromRequest(Class<T> DTOclass) {
		T dto = DTO.getDTO(request().body().asJson(), DTOclass);
		if (dto == null) {
			throw new RuntimeException("The request content cannot be converted to a '" + DTOclass.getName() + "'.");
		}
		return dto;
	}
}
