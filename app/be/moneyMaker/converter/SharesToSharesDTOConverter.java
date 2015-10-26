package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.ShareDTO;
import be.moneyMaker.dto.internal.SharesDTO;
import be.moneyMaker.models.account.Share;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 10/09/14.
 */
public class SharesToSharesDTOConverter {

	public SharesDTO convert(List<Share> shares){

		List<ShareDTO> shareDTOs = new ArrayList<>();

		ShareToShareDTOConverter shareToShareDTOConverter = new ShareToShareDTOConverter();

		for(Share share : shares){
			shareDTOs.add(shareToShareDTOConverter.convert(share));
		}

		return new SharesDTO(shareDTOs);
	}
}
