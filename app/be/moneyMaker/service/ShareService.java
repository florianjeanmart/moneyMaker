package be.moneyMaker.service;

import be.moneyMaker.models.account.Share;
import be.moneyMaker.models.market.Stock;
import com.avaje.ebean.Ebean;

import java.util.List;

/**
 * Created by florian on 10/09/14.
 */
public class ShareService {

	public List<Share> getMyShares(){

		return Ebean.find(Share.class).findList();

	}

    public Share findById(Long id) {
        return Ebean.createNamedQuery(Share.class, Share.FIND_BY_ID)
                .setParameter("id", id).findUnique();
    }
}
