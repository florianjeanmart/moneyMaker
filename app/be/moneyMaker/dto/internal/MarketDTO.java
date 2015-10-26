package be.moneyMaker.dto.internal;

/**
 * Created by florian on 1/09/14.
 */
public class MarketDTO {

	private String name;
	private String symbol;

	public MarketDTO() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "MarketDTO{" +
				"name='" + name + '\'' +
				'}';
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public String getSymbol() {
		return symbol;
	}
}
