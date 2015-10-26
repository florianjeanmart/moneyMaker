package be.moneyMaker.controllers;

import be.moneyMaker.dto.ResultDTO;
import be.moneyMaker.models.account.Share;
import com.avaje.ebean.Ebean;
import play.mvc.Result;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by florian on 28/09/14.
 */
public class FixController extends AbstractController {


    public Result fix1() {

        for (Share share : Ebean.find(Share.class).findList()) {

            DateFormat dateFormat  = new SimpleDateFormat("yyyy-MM-dd");

            try {
                share.setBuildDate(dateFormat.parse(dateFormat.format(share.getBuildDate())));

                if (share.getSellDate() != null)
                    share.setSellDate(dateFormat.parse(dateFormat.format(share.getSellDate())));
                share.update();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }


        return ok(new ResultDTO());
    }
}
