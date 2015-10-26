package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.AutoCompletionDTO;
import be.moneyMaker.dto.internal.AutoCompletionListDTO;
import be.moneyMaker.models.market.Company;
import be.moneyMaker.models.market.Stock;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 1/10/14.
 */
public class CompaniesToAutoCompletionDTOConverter {


    public AutoCompletionListDTO convert(List<Company> companies) {

        AutoCompletionListDTO dto = new AutoCompletionListDTO();

        List<AutoCompletionDTO> listDTO = new ArrayList<>();

        for(Company company: companies){
            listDTO.add(new AutoCompletionDTO(company.getSymbol(),company.getName()+" ("+company.getSymbol()+")"));
        }

        dto.setValues(listDTO);

        return dto;

    }
}
