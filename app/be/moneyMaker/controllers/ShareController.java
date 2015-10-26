package be.moneyMaker.controllers;

import be.moneyMaker.converter.ShareToShareDTOConverter;
import be.moneyMaker.converter.SharesToSharesDTOConverter;
import be.moneyMaker.dto.ResultDTO;
import be.moneyMaker.dto.internal.SharesDTO;
import be.moneyMaker.dto.internal.post.CreateShareDTO;
import be.moneyMaker.dto.internal.post.LongDTO;
import be.moneyMaker.dto.internal.post.SellShareDTO;
import be.moneyMaker.models.account.Share;
import be.moneyMaker.models.market.Stock;
import be.moneyMaker.models.market.value.StockValue;
import be.moneyMaker.service.ShareService;
import be.moneyMaker.service.StockService;
import be.moneyMaker.service.StockValueService;
import play.Logger;
import play.mvc.Result;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 * Created by florian on 7/09/14.
 */
public class ShareController extends AbstractController {


    public Result createShare() {

        CreateShareDTO createShareDTO = this.extractDTOFromRequest(CreateShareDTO.class);


        //control stock
        StockService stockService = new StockService();
        Stock stock = stockService.findBySymbol(createShareDTO.getStockName());
        if (stock == null) {
            throw new RuntimeException("Stock unknown : "+createShareDTO.getStockName());
        }

        //control price
        StockValueService stockValueService = new StockValueService();
        StockValue stockValue = stockValueService.getStockValue(stock, createShareDTO.getDate());
/*
        if (createShareDTO.getPrice() < stockValue.getValueMin() ||
                createShareDTO.getPrice() > stockValue.getValueMax()) {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            throw new RuntimeException("Price must be comprise between " + stockValue.getValueMin() + " and " + stockValue.getValueMax() + " for the date of " + dateFormat.format(stockValue.getDate()));
        }
*/
        //create share
        Share share = new Share();
        //share.setAccount();
        share.setBuildDate(createShareDTO.getDate());
        share.setNumber(createShareDTO.getNumber());
        share.setStock(stock);
        share.setBuildPrice(createShareDTO.getPrice());

        share.save();

        ShareToShareDTOConverter converter = new ShareToShareDTOConverter();

        return ok(converter.convert(share));
    }

    public Result editShare(){

        CreateShareDTO createShareDTO = this.extractDTOFromRequest(CreateShareDTO.class);

        ShareService shareService = new ShareService();
        Share share = shareService.findById(createShareDTO.getShareId());

        if(share==null){
            throw new RuntimeException("share "+createShareDTO.getShareId()+" doesn't exists");
        }

        share.setBuildDate(createShareDTO.getDate());
        share.setBuildPrice(createShareDTO.getPrice());
        share.setNumber(createShareDTO.getNumber());
        share.setSellPrice(createShareDTO.getSellPrice());
        share.setSellDate(createShareDTO.getSellDate());

        share.update();

        ShareToShareDTOConverter  converter = new ShareToShareDTOConverter();

        return ok(converter.convert(share));
    }

    public Result removeShare(){

        LongDTO longDTO = extractDTOFromRequest(LongDTO.class);

        ShareService shareService = new ShareService();
        Share share = shareService.findById(longDTO.getValue());
        if(share!=null){
            share.delete();
        }

        return ok(new ResultDTO());
    }

    public Result sellShare() {

        SellShareDTO sellShareDTO = this.extractDTOFromRequest(SellShareDTO.class);

        //control share
        ShareService shareService = new ShareService();
        Share share = shareService.findById(sellShareDTO.getShareId());
        if (share == null) {
            throw new RuntimeException("share unknown");
        }

        //control price
        StockValueService stockValueService = new StockValueService();
        StockValue stockValue = stockValueService.getStockValue(share.getStock(), sellShareDTO.getDate());
/*
        if (sellShareDTO.getPrice() < stockValue.getValueMin() ||
                sellShareDTO.getPrice() > stockValue.getValueMax()) {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            throw new RuntimeException("Price must be comprise between " + stockValue.getValueMin() + " and " + stockValue.getValueMax() + " for the date of " + dateFormat.format(stockValue.getDate()));
        }
*/
        //save
        share.setSellDate(sellShareDTO.getDate());
        share.setSellPrice(sellShareDTO.getPrice());

        share.update();

        ShareToShareDTOConverter converter = new ShareToShareDTOConverter();

        return ok(converter.convert(share));
    }

    public Result getMyShares() {

        ShareService shareService = new ShareService();

        List<Share> myShares = shareService.getMyShares();

        Logger.info(myShares.toString());

        SharesToSharesDTOConverter sharesToSharesDTOConverter = new SharesToSharesDTOConverter();

        SharesDTO sharesDTO = sharesToSharesDTOConverter.convert(myShares);

        return ok(sharesDTO);


    }


}
