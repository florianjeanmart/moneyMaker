package be.moneyMaker.dto.external.yahoo;

import be.moneyMaker.dto.DTO;

/**
 * Created by florian on 14/09/14.
 */
public class CompanyDTO extends DTO {

    private String name;

    private String symbol;

    public CompanyDTO() {
    }

    public CompanyDTO(String name, String symbol) {
        this.name = name;
        this.symbol = symbol;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "CompanyDTO{" +
                "name='" + name + '\'' +
                ", symbol='" + symbol + '\'' +
                '}';
    }
}
