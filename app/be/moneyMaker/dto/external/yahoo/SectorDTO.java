package be.moneyMaker.dto.external.yahoo;

import be.moneyMaker.dto.DTO;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * Created by florian on 13/09/14.
 */
public class SectorDTO extends DTO {

    private String name;

    private JsonNode industry;

    public SectorDTO() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public JsonNode getIndustry() {
        return industry;
    }

    public void setIndustry(JsonNode industry) {
        this.industry = industry;
    }

    @Override
    public String toString() {
        return "Sector{" +
                ", name='" + name + '\'' +
                ", industry=" + industry +
                '}';
    }
}
