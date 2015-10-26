package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

public class ExceptionsDTO extends DTO {

	private final String message;

	// add default constructor for Json Parser
	public ExceptionsDTO() { this.message = null; }

	public ExceptionsDTO(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}
}
