package be.moneyMaker.dto;

/**
 * Created by florian on 7/09/14.
 */
public class ResultDTO extends DTO{

	private String message;

    public ResultDTO() {
    }

    public ResultDTO(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "ResultDTO{" +
				"message='" + message + '\'' +
				'}';
	}
}
