package be.moneyMaker.dto.internal.post;

import be.moneyMaker.dto.DTO;

/**
 * Created by florian on 24/09/14.
 */
public class DoubleToValueDTO extends DTO{

    public Double value;

    public DoubleToValueDTO(Double value) {
        this.value=value;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }
}
