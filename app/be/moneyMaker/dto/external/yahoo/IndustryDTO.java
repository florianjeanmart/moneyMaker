package be.moneyMaker.dto.external.yahoo;

import be.moneyMaker.dto.DTO;

/**
 * Created by florian on 13/09/14.
 */
public class IndustryDTO extends DTO {

    private Integer id;

    private String name;

    public IndustryDTO() {

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Sector{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
