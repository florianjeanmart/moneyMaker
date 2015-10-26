# simple download service
angular
.module('app.services')
.service "fortuneoPrice", ($sce, messageFlash, $http, downloadService) ->

    taxValue = 0.0025

    exchangeRateTax = 0.005

    prices = [
        markets: ['Paris', 'Brussels']
        0: 5.95
        2500: 9.50
        5000: 13.50
        25000: 19.50
        50000: 19.50 * 2
        75000: 19.50 * 3
    ,
        markets: ['NYSE', 'NasdaqNM', 'Toronto', 'London', 'AMEX']
        0: 11.00
        2500: 12.50
        5000: 16.50
        25000: 21
        50000: 21 * 2
        75000: 21 * 3
    ]


    @convert = (currentValue, marketSymbol, exchangeRate, buy = true) ->
        result = {}
        eurValue=0
        if exchangeRate == null
            eurValue = currentValue
        else
            if buy
                exchangeRate = exchangeRate * (1 + exchangeRateTax)
            else
                exchangeRate = exchangeRate / (1 + exchangeRateTax)
            eurValue = currentValue * exchangeRate
            result.exchangeRate = 1 / exchangeRate

        priceType = null

        #compute price
        for price in prices
            for market in price.markets
                if market == marketSymbol
                    priceType = price

        if priceType == null
            price = eurValue * 0.0125
            if price < 150
                price = 150
        else
            for key in Object.keys(priceType)
                if key != '$$hashKey' && key != 'markets'
                    if eurValue > parseFloat(key)
                        price = priceType[key]

        #compute taxe
        tax = eurValue * taxValue

        #result
        if buy
            value = eurValue + price + tax
        else
            value = eurValue - price - tax
        result.price = price
        result.tax = tax
        result.value = value
        return result

    return