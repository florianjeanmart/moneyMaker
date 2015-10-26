package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import java.util.List;

/**
 * Created by florian on 26/09/14.
 */
public class ListDTO extends DTO{

    private List<DTO> list;

    public ListDTO(List<DTO> list) {
        this.list = list;
    }

    public List<DTO> getList() {
        return list;
    }

    public void setList(List<DTO> list) {
        this.list = list;
    }

    @Override
    public String toString() {
        return "ListDTO{" +
                "list=" + list +
                '}';
    }
}
