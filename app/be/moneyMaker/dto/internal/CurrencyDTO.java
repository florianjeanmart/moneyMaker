package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * Created by florian on 31/08/14.
 */
public class CurrencyDTO extends DTO{

	@Pattern(regexp = "[A-Z]{3}")
	@NotNull
	String name;

	@NotNull
	String symbol;

	public CurrencyDTO() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	@Override
	public String toString() {
		return "CurrencyDTO{" +
				"name='" + name + '\'' +
				", symbol='" + symbol + '\'' +
				'}';
	}
}
