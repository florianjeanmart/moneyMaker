package be.moneyMaker.dto.external.Quandl;

import com.fasterxml.jackson.annotation.JsonProperty;
import be.moneyMaker.dto.DTO;

import java.util.List;

/**
 * Created by florian on 31/08/14.
 */
public class StocksExternalDTO extends DTO{

	@JsonProperty("total_count")
	private Integer totalCount;

	private List<StockExternalDTO> docs;

	public StocksExternalDTO() {
	}

	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
	}

	public List<StockExternalDTO> getDocs() {
		return docs;
	}

	public void setDocs(List<StockExternalDTO> docs) {
		this.docs = docs;
	}

	@Override
	public String toString() {
		return "StocksDTO{" +
				"totalCount=" + totalCount +
				", docs=" + docs +
				'}';
	}
}
