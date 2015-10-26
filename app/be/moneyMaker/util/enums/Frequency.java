package be.moneyMaker.util.enums;

/**
 * Created by florian on 31/08/14.
 */
public enum Frequency {

	DAILY("daily"),
	MONTHLY("monthly"),
	YEARLY("yearly");
	private final String text;

	private Frequency(String text) {
		this.text = text;
	}

	public String toString() {
		return text;
	}
}
