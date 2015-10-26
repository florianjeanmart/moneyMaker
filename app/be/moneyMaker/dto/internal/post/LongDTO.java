package be.moneyMaker.dto.internal.post;

import be.moneyMaker.dto.DTO;

/**
 * Created by florian on 27/09/14.
 */
public class LongDTO extends DTO {

    private Long value;

    public LongDTO() {
    }

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "LongDTO{" +
                "value=" + value +
                '}';
    }
}
