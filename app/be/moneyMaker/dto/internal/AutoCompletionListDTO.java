package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import java.util.List;

/**
 * Created by florian on 7/09/14.
 */
public class AutoCompletionListDTO  extends DTO {

	List<AutoCompletionDTO> values;

	public AutoCompletionListDTO() {
	}

	public List<AutoCompletionDTO> getValues() {
		return values;
	}

	public void setValues(List<AutoCompletionDTO> values) {
		this.values = values;
	}

	@Override
	public String toString() {
		return "AutoCompletionListDTO{" +
				"values=" + values +
				'}';
	}
}
