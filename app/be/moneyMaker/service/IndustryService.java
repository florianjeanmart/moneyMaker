package be.moneyMaker.service;

import be.moneyMaker.dto.external.Serializer.JsonParserUtil;
import be.moneyMaker.dto.external.yahoo.IndustryDTO;
import be.moneyMaker.dto.external.yahoo.ResultYahooSectorDTO;
import be.moneyMaker.dto.external.yahoo.SectorDTO;
import be.moneyMaker.models.market.Currency;
import be.moneyMaker.models.market.Industry;
import be.moneyMaker.models.market.Sector;
import be.moneyMaker.util.exception.MyException;
import be.moneyMaker.util.externalComm.HttpRequest;
import be.moneyMaker.util.externalComm.YahooApiRequest;
import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by florian on 13/09/14.
 */
public class IndustryService {

    private static final String URL_SECTOR = "https://query.yahooapis.com/v1/public/yql";

    public List<Sector> getAllSector() {
        return new Currency.Finder(String.class, Sector.class).all();
    }

    public List<Industry> getIndustriesBySector(Sector sector) {
        return Ebean.createNamedQuery(Industry.class, Industry.FIND_BY_SECTOR).setParameter("sectorId", sector.getId()).findList();
    }

    public boolean loadAndSaveValue() {

        YahooApiRequest yahooApiRequest = new YahooApiRequest();

        Map<String, String> params = new HashMap<>();

        params.put("q", "select%20*%20from%20yahoo.finance.sectors");
        params.put("format", "json");
        params.put("diagnostics", "false");
        params.put("env", "http%3A%2F%2Fdatatables.org%2Falltables.env");

        ResultYahooSectorDTO result = null;
        try {
            result = yahooApiRequest.sendRequest(HttpRequest.RequestMethod.GET, URL_SECTOR, params, ResultYahooSectorDTO.class);
        } catch (MyException e) {
            e.printStackTrace();
        }

        List<Sector> sectors = new ArrayList<>();

        for (SectorDTO sectorDTO : result.getSector()) {

            Sector sector = new Sector(sectorDTO.getName());

            sectors.add(sector);

            JsonParserUtil jsonParserUtil = new JsonParserUtil();

            List<be.moneyMaker.dto.external.yahoo.IndustryDTO> industryDTOList = jsonParserUtil.convertToListIndustryDTO(sectorDTO.getIndustry());

            //convert industryDTO to industry
            convertDTOToIndustries(industryDTOList, sector);
        }

        Ebean.save(sectors);
        if (sectors.size() > 0) {
            return true;
        }
        return false;
    }

    private List<IndustryDTO> a(JsonNode jsonNodeIndustries) {

        ObjectMapper mapper = new ObjectMapper();
        JsonParser jp = jsonNodeIndustries.traverse();

        TypeReference<List<IndustryDTO>> typeRef = new TypeReference<List<IndustryDTO>>() {
        };

        TypeReference<IndustryDTO> typeRef2 = new TypeReference<IndustryDTO>() {
        };
        try {
            List<IndustryDTO> list = mapper.readValue(jsonNodeIndustries.traverse(), typeRef);
            return list;

        } catch (IOException e) {

            try {
                IndustryDTO dto = mapper.readValue(jsonNodeIndustries.traverse(), typeRef2);
                List<IndustryDTO> list = new ArrayList<>();
                list.add(dto);
                return list;
            } catch (IOException e1) {
                e1.printStackTrace();
                return null;
            }
        }
    }
    /* ***************************************
	 *************************** PRIVATE
	 ****************************************** */

    private void convertDTOToIndustries(List<IndustryDTO> industryDTOs, Sector sector) {

        for (IndustryDTO dto : industryDTOs) {
            Industry industry = new Industry();
            industry.setName(dto.getName());
            industry.setReference(dto.getId().intValue());
            sector.addIndustry(industry);
        }
    }

    private void convertDTOToIndustry(IndustryDTO industryDTO, Sector sector) {
        List<IndustryDTO> list = new ArrayList<>();
        list.add(industryDTO);
        convertDTOToIndustries(list, sector);

    }
}
