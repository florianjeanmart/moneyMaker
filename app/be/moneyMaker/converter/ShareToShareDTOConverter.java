package be.moneyMaker.converter;

import be.moneyMaker.dto.internal.ShareDTO;
import be.moneyMaker.dto.internal.StockDTO;
import be.moneyMaker.dto.internal.StockValuesDTO;
import be.moneyMaker.models.account.Share;
import be.moneyMaker.models.market.value.CurrencyExchangeValue;
import be.moneyMaker.models.market.value.StockValue;
import be.moneyMaker.service.CurrencyExchangeValueService;
import be.moneyMaker.service.CurrencyService;
import be.moneyMaker.service.StockValueService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 10/09/14.
 */
public class ShareToShareDTOConverter {

    private CurrencyService currencyService = new CurrencyService();

    private CurrencyExchangeValueService currencyExchangeValueService = new CurrencyExchangeValueService();

    private StockValueService stockValueService = new StockValueService();

    private StockToStockDTOConverter stockToStockDTOConverter = new StockToStockDTOConverter();
    private StockValueToStockValueDTOConverter stockValueToStockValueDTOConverter = new StockValueToStockValueDTOConverter();

    public ShareDTO convert(Share share) {


        ShareDTO shareDTO = new ShareDTO();

        StockDTO stockDTO = stockToStockDTOConverter.convert(share.getStock());
        shareDTO.setStock(stockDTO);
        shareDTO.setShareId(share.getId());

        shareDTO.setBuyDate(share.getBuildDate());
        shareDTO.setBuyPrice(share.getBuildPrice());
        shareDTO.setNbShare(share.getNumber());

        if (share.getStock().getCurrency().getName().equals("EUR")) {
            shareDTO.setBuyEuroConversion(1.0);
        } else {
            CurrencyExchangeValue currencyExchangeValueForBuy = currencyExchangeValueService.getCurrencyExchangeValue(share.getStock().getCurrency(), currencyService.getByName("EUR"), share.getBuildDate());

            shareDTO.setBuyEuroConversion(currencyExchangeValueForBuy.getValue());
        }

        List<StockValue> valueList = stockValueService.getStockValues(share.getStock(), share.getBuildDate(), share.getSellDate());

        List<StockValuesDTO> stockValuesDTOList = new ArrayList<>();

        for (StockValue stockValue : valueList) {
            stockValuesDTOList.add(stockValueToStockValueDTOConverter.convert(stockValue));
        }


        shareDTO.setStockValues(stockValuesDTOList);

        if (share.getSellPrice() != null) {
            shareDTO.setSellDate(share.getSellDate());
            shareDTO.setSellPrice(share.getSellPrice());

            if (share.getStock().getCurrency().getName().equals("EUR")) {
                shareDTO.setSellEuroConversion(1.0);
            } else {
                CurrencyExchangeValue currencyExchangeValueForSell = currencyExchangeValueService.getCurrencyExchangeValue(share.getStock().getCurrency(), currencyService.getByName("EUR"), share.getSellDate());

                shareDTO.setSellEuroConversion(currencyExchangeValueForSell.getValue());
            }
        }
        return shareDTO;

    }
}
