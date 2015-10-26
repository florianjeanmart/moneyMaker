package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

/**
 * Created by florian on 7/09/14.
 */
public class AutoCompletionDTO  extends DTO {

	private String key;

	private String content;

	public AutoCompletionDTO() {
	}

	public AutoCompletionDTO(String key, String content) {
		this.key = key;
		this.content = content;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Override
	public String toString() {
		return "AutoCompletionDTO{" +
				"key='" + key + '\'' +
				", content='" + content + '\'' +
				'}';
	}
}
