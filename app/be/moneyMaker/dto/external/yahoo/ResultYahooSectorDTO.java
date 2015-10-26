package be.moneyMaker.dto.external.yahoo;

import be.moneyMaker.dto.DTO;

import java.util.List;

/**
 * Created by florian on 13/09/14.
 */
public class ResultYahooSectorDTO extends DTO {

    private List<SectorDTO> sector;

    public ResultYahooSectorDTO() {
    }

    public List<SectorDTO> getSector() {
        return sector;
    }

    public void setSector(List<SectorDTO> sector) {
        this.sector = sector;
    }

    @Override
    public String toString() {
        return "ResultYahooSectorDTO{" +
                "sector=" + sector +
                '}';
    }
}
