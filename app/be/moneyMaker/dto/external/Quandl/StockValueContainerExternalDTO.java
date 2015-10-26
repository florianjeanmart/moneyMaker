package be.moneyMaker.dto.external.Quandl;

import java.util.List;

/**
 * Created by florian on 31/08/14.
 */
public class StockValueContainerExternalDTO extends QuandLDTO{

	private List<List<String>> data;

	public StockValueContainerExternalDTO() {
	}

	public List<List<String>> getData() {
		return data;
	}

	public void setData(List<List<String>> data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "StockValueContainerExternalDTO{" +
				"data=" + data +
				'}';
	}
}
