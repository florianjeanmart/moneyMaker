package be.moneyMaker.dto.internal;

import be.moneyMaker.dto.DTO;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 10/09/14.
 */
public class SharesDTO extends DTO {

	private List<ShareDTO> shareList = new ArrayList<>();

	public SharesDTO() {
	}

	public SharesDTO(List<ShareDTO> shareList) {
		this.shareList = shareList;
	}

	public List<ShareDTO> getShareList() {
		return shareList;
	}

	public void setShareList(List<ShareDTO> shareList) {
		this.shareList = shareList;
	}

	@Override
	public String toString() {
		return "SharesDTO{" +
				"shareList=" + shareList +
				'}';
	}
}
