package be.moneyMaker.dto.external.Serializer;

import be.moneyMaker.dto.DTO;
import be.moneyMaker.dto.external.yahoo.CompanyDTO;
import be.moneyMaker.dto.external.yahoo.HistoricalDataDTO;
import be.moneyMaker.dto.external.yahoo.IndustryDTO;
import be.moneyMaker.dto.external.yahoo.QuotesDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 19/09/14.
 */
public class JsonParserUtil{

    public static List<IndustryDTO> convertToListIndustryDTO(JsonNode jsonNode) {

        ObjectMapper mapper = new ObjectMapper();

        TypeReference<List<IndustryDTO>> typeRef = new TypeReference<List<IndustryDTO>>() {
        };

        TypeReference<IndustryDTO> typeRef2 = new TypeReference<IndustryDTO>() {
        };
        try {
            List<IndustryDTO> list = mapper.readValue(jsonNode.traverse(), typeRef);

            return list;

        } catch (IOException e) {

            try {
                IndustryDTO dto = mapper.readValue(jsonNode.traverse(), typeRef2);
                List<IndustryDTO> list = new ArrayList<>();
                list.add(dto);

                return list;
            } catch (IOException e1) {
                e1.printStackTrace();
                throw new RuntimeException("Error during Json parsing : " + e1.getMessage());
            }
        }
    }

    public static List<QuotesDTO> convertToListQuotesDTO(JsonNode jsonNode) {

        ObjectMapper mapper = new ObjectMapper();

        TypeReference<List<QuotesDTO>> typeRef = new TypeReference<List<QuotesDTO>>() {
        };

        TypeReference<QuotesDTO> typeRef2 = new TypeReference<QuotesDTO>() {
        };
        try {
            List<QuotesDTO> list = mapper.readValue(jsonNode.traverse(), typeRef);

            return list;

        } catch (IOException e) {

            try {
                QuotesDTO dto = mapper.readValue(jsonNode.traverse(), typeRef2);
                List<QuotesDTO> list = new ArrayList<>();
                list.add(dto);

                return list;
            } catch (IOException e1) {
                e1.printStackTrace();
                throw new RuntimeException("Error during Json parsing : " + e1.getMessage());
            }
        }
    }

    public static List<HistoricalDataDTO> convertToListHistoricalDataDTO(JsonNode jsonNode) {

        ObjectMapper mapper = new ObjectMapper();

        TypeReference<List<HistoricalDataDTO>> typeRef = new TypeReference<List<HistoricalDataDTO>>() {
        };

        TypeReference<HistoricalDataDTO> typeRef2 = new TypeReference<HistoricalDataDTO>() {
        };
        try {
            List<HistoricalDataDTO> list = mapper.readValue(jsonNode.traverse(), typeRef);

            return list;

        } catch (IOException e) {

            try {
                HistoricalDataDTO dto = mapper.readValue(jsonNode.traverse(), typeRef2);
                List<HistoricalDataDTO> list = new ArrayList<>();
                list.add(dto);

                return list;
            } catch (IOException e1) {
                e1.printStackTrace();
                throw new RuntimeException("Error during Json parsing : " + e1.getMessage());
            }
        }
    }

    public static List<CompanyDTO> convertToListCompanyDTO(JsonNode jsonNode) {

        ObjectMapper mapper = new ObjectMapper();

        TypeReference<List<CompanyDTO>> typeRef = new TypeReference<List<CompanyDTO>>() {
        };

        TypeReference<CompanyDTO> typeRef2 = new TypeReference<CompanyDTO>() {
        };
        try {
            List<CompanyDTO> list = mapper.readValue(jsonNode.traverse(), typeRef);

            return list;

        } catch (IOException e) {

            try {
                CompanyDTO dto = mapper.readValue(jsonNode.traverse(), typeRef2);
                List<CompanyDTO> list = new ArrayList<>();
                list.add(dto);

                return list;
            } catch (IOException e1) {
                e1.printStackTrace();
                throw new RuntimeException("Error during Json parsing : " + e1.getMessage());
            }
        }
    }
        /*
    public List<T> convertToList(JsonNode jsonNode) {

        ObjectMapper mapper = new ObjectMapper();

        TypeReference<List<T>> typeRef = new TypeReference<List<T>>() {
        };

        TypeReference<T> typeRef2 = new TypeReference<T>() {
        };
        try {
            List<T> list = mapper.readValue(jsonNode.traverse(), typeRef);

            return list;

        } catch (IOException e) {

            try {
                T dto = mapper.readValue(jsonNode.traverse(), typeRef2);
                List<T> list = new ArrayList<>();
                list.add(dto);

                return list;
            } catch (IOException e1) {
                e1.printStackTrace();
                throw new RuntimeException("Error during Json parsing : " + e1.getMessage());
            }
        }
    }
    */
}
