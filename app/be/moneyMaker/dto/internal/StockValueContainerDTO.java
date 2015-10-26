package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;
import be.moneyMaker.models.market.Stock;

import java.util.List;

/**
 * Created by florian on 1/09/14.
 */
public class StockValueContainerDTO extends DTO {

	private List<StockValuesDTO> values;
	private StockDTO stock;

	public StockValueContainerDTO() {
	}

	public List<StockValuesDTO> getValues() {
		return values;
	}

	public void setValues(List<StockValuesDTO> values) {
		this.values = values;
	}

	@Override
	public String toString() {
		return "StockValueContainerDTO{" +
				"values=" + values +
				'}';
	}

    public StockDTO getStock() {
        return stock;
    }

    public void setStock(StockDTO stock) {
        this.stock = stock;
    }
}
