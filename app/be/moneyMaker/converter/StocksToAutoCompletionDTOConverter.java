package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.AutoCompletionDTO;
import be.moneyMaker.dto.internal.AutoCompletionListDTO;
import be.moneyMaker.models.market.Stock;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 1/09/14.
 */
public class StocksToAutoCompletionDTOConverter{

	public AutoCompletionListDTO convert(List<Stock> stocks) {

		AutoCompletionListDTO dto = new AutoCompletionListDTO();

		List<AutoCompletionDTO> listDTO = new ArrayList<>();

		for(Stock stock : stocks){
			listDTO.add(new AutoCompletionDTO(stock.getSymbol(),stock.getName()+" ("+stock.getSymbol()+")"));
		}

		dto.setValues(listDTO);

		return dto;

	}
}
