angular
.module('app.controllers')
.controller "MyShareCtrl", ($scope, $http, messageFlash, modalService, ngTableParams, $filter, fortuneoPrice,generateId,openDayService) ->

    $scope.idChartStock =generateId.generate()
    $scope.idChartShare =generateId.generate()
    $scope.idChartResult=generateId.generate()
    $scope.idChartResultAverage=generateId.generate()


    $scope.editShare = (share) ->
        params = {}
        params.share = share
        params.refreshShare = $scope.refreshShare
        modalService.show modalService.CREATE_SHARE, params

    $scope.refreshShare = (share) ->
        i = 0
        console.log $scope.shares
        for shareToCompare in $scope.shares
            console.log shareToCompare
            if share.shareId == shareToCompare.shareId
                $scope.shares.splice(i, 1)
                break
            i++
        $scope.addShare(share)

    $scope.showAll = ->
        for share in $scope.shares
            $scope.setVisibleChart(share)
            share.visible = true

    $scope.hideAll = ->
        for share in $scope.shares
            $scope.setVisibleChart(share)
            share.visible = false


    $scope.remove = (share) ->
        data = {}
        data.value = share.shareId
        $http.post("share/remove", data)
        .success (data, status)->
            i = 0
            for shareToCompare in $scope.shares
                if share.shareId == shareToCompare.shareId
                    $scope.shares.splice(i, 1)
                    break
                i++
            $scope.loadTable()

    $scope.addShare = (share) ->
        $scope.shares.push share
        $scope.loadTable()


    $scope.createMyShare = ->
        params = {}
        params.addShare = $scope.addShare
        modalService.show modalService.CREATE_SHARE, params

    $scope.sellSimulation = (share) ->
        params={}
        if share?
            params.stock = share.stock
            params.nbShare = share.nbShare
            params.buyPrice = share.totalEur
        modalService.show modalService.SELL_SIMULATION,params

    $scope.shares = []

    $http.get("share/myShares")
    .success (data, status)->
        console.log data
        console.log new Date(data.shareList[0].buyDate)

        console.log new Date(data.shareList[0].stockValues[0].date)
        messageFlash.displaySuccess "My shares loaded ! "

        $scope.shares = data.shareList

        $scope.loadTable()

        $scope.buildChart()

    .error (data) ->
        messageFlash.displayError data.message
        $scope.isLoading = false

    $scope.loadTable = ()->

        $scope.summary = {
            value: 0
        }

        totalPercentSell = 0
        nbSell = 0
        totalDay = 0

        for share in $scope.shares

            share.visible = true
            share.total = share.buyPrice * share.nbShare
            buyConvert = fortuneoPrice.convert(share.total, share.stock.market.symbol, share.buyEuroConversion, true)
            share.totalEur = buyConvert.value
            share.totalEurDetails =
                exchangeRate: buyConvert.exchangeRate
                tax: buyConvert.tax
                cost: buyConvert.price

            if share.sellPrice?
                share.sellTotal = share.sellPrice * share.nbShare
                sellConvert = fortuneoPrice.convert(share.sellTotal, share.stock.market.symbol,share.sellEuroConversion, false)
                share.sellTotalEur = sellConvert.value
                share.totalSellEurDetails =
                    exchangeRate: sellConvert.exchangeRate
                    tax: sellConvert.tax
                    cost: sellConvert.price

                share.differenceEur = share.sellTotalEur - share.totalEur
                share.differencePercentEur = share.differenceEur / share.totalEur * 100

                $scope.summary.value += share.differenceEur
                nbSell++
                totalPercentSell+=share.differencePercentEur

                #average by day
                days = openDayService.getNbOpenDays(share.buyDate, share.sellDate)
                share.differencePercentEurAverageByDay = share.differencePercentEur / days

        $scope.averagePercentSell = totalPercentSell / nbSell

        if $scope.tableParams?
            $scope.tableParams.reload();
        else
            $scope.tableParams = new ngTableParams(
                page: 1 # show first page
                count: 100 # count per page
                sorting:
                    code: "asc" # initial sorting
            ,
                total: 0 # length of data
                getData: ($defer, params) ->
                    orderedData = $filter("orderBy")($scope.shares, params.orderBy())
                    $defer.resolve orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())
                    params.total $scope.shares.length
            )


    $scope.sellShare = (share) ->
        params = {}
        params.share = share
        params.refreshShare = $scope.refreshShare
        modalService.show modalService.SELL_SHARE, params


    $scope.isCompare = false

    $scope.colorMap =
        counter:0

    $scope.$watch ('isCompare'), (o, n)->
        if o != n
            $scope.buildChart()

    $scope.buildChart = ->
        if $scope.shares?
            $scope.buildChartStock()
            $scope.buildChartShare()
            $scope.buildChartResult()
            $scope.buildChartResultAverage()



    $scope.setVisibleChart = (share) ->

        if share.visible == true
            $("#" + $scope.idChartShare).highcharts().get(share.shareId).hide()
            $("#" + $scope.idChartResult).highcharts().get(share.shareId).hide()
            $("#" + $scope.idChartStock).highcharts().get(share.shareId).hide()
            $("#" + $scope.idChartResultAverage).highcharts().get(share.shareId).hide()
        else
            $("#" + $scope.idChartShare).highcharts().get(share.shareId).show()
            $("#" + $scope.idChartResult).highcharts().get(share.shareId).show()
            $("#" + $scope.idChartStock).highcharts().get(share.shareId).show()
            $("#" + $scope.idChartResultAverage).highcharts().get(share.shareId).show()

    $scope.buildChartStock = () ->
            # build price
            series = []

            for share in $scope.shares
                price = []

                for value in share.stockValues
                    price.push [
                            value.date + 12 * 3600 * 1000
                            value.valueClose
                    ]

                series.push
                    id: share.shareId
                    name: share.stock.symbol
                    data: price
                    yAxis: 0
                    tooltip:
                        valueDecimals: 4
                    dataGrouping:
                        units: $scope.groupingUnits

            $("#" + $scope.idChartStock).highcharts "StockChart",

                chart:
                    zoomType: 'x'

                rangeSelector:
                    selected: 1
                    inputEnabled: $("#" + $scope.idChartStock).width() > 480

                title:
                    text: "TITLE"

                scrollbar:
                    liveRedraw: false

                plotOptions:
                    series:
                        compare: if $scope.isCompare == true then 'percent' else null

                yAxis: $scope.yAxis

                series: series


    $scope.buildChartShare = ->
        # build price
        series = []

        for share in $scope.shares
            price = []

            # find color
            if $scope.colorMap[share.stock.symbol]?
                color = $scope.colorMap[share.stock.symbol]
            else
                color = Highcharts.getOptions().colors[$scope.colorMap.counter]
                $scope.colorMap.counter++
                $scope.colorMap[share.stock.symbol] = color

            for value in share.stockValues
                price.push [
                        value.date + 12 * 3600 * 1000
                        fortuneoPrice.convert(value.valueClose * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, true).value
                ]

            serie =
                id: share.shareId
                name: share.stock.symbol
                data: price
                yAxis: 0
                color:color
                tooltip:
                    valueDecimals: 4
                dataGrouping:
                    units: $scope.groupingUnits
                fillColor :
                    linearGradient :
                        x1: 0
                        y1: 0
                        x2: 0
                        y2: 1
                    stops : [
                        [0, color]
                        [1, Highcharts.Color(color).setOpacity(0).get('rgba')]
                    ]
            series.push serie

        $("#" + $scope.idChartShare).highcharts "StockChart",

            chart:
                zoomType: 'x'

            rangeSelector:
                selected: 1
                inputEnabled: $("#" + $scope.idChartShare).width() > 480

            title:
                text: "TITLE"

            scrollbar:
                liveRedraw: false

            plotOptions:
                series:
                    compare: if $scope.isCompare == true then 'percent' else null

            yAxis: $scope.yAxis

            series: series


    $scope.buildChartResult = ->
        # build price
        series = []

        for share in $scope.shares
            price = []

            buyValue = fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, true).value

            # find color
            if $scope.colorMap[share.stock.symbol]?
                color = $scope.colorMap[share.stock.symbol]
            else
                color = Highcharts.getOptions().colors[$scope.colorMap.counter]
                $scope.colorMap.counter++
                $scope.colorMap[share.stock.symbol] = color


            if $scope.isCompare == true
                startValuePrice=(fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100
            else
                startValuePrice=fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue

            price.push [
                share.buyDate
                startValuePrice
            ]

            for value in share.stockValues
                if $scope.isCompare == true
                    if value.date == share.sellDate
                        valuePrice = (fortuneoPrice.convert(share.sellPrice * share.nbShare, share.stock.market.symbol, share.sellEuroConversion, false).value - buyValue) / buyValue * 100
                    else
                        valuePrice=(fortuneoPrice.convert(value.valueClose * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100
                else
                    if value.date == share.sellDate
                        valuePrice = fortuneoPrice.convert(share.sellPrice * share.nbShare, share.stock.market.symbol, share.sellEuroConversion, false).value - buyValue
                    else
                        valuePrice=fortuneoPrice.convert(value.valueClose * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue

                price.push [
                    value.date + 12 * 3600 * 1000
                    valuePrice
                ]

            console.log "price for "+share.stock.symbol
            console.log price

            series.push
                id: share.shareId
                name: share.stock.symbol
                data: price
                type:'area'
                yAxis: 0
                color:color
                width:'2px'
                tooltip:
                    valueDecimals: 4
                dataGrouping:
                    units: $scope.groupingUnits
                fillColor :
                    linearGradient :
                        x1: 0
                        y1: 0
                        x2: 0
                        y2: 1
                    stops : [
                        [0, Highcharts.Color(color).setOpacity(0.5).get('rgba')]
                        [1, Highcharts.Color(color).setOpacity(0).get('rgba')]
                    ]

        # compute average
        averageData = []
        for share in $scope.shares
            if share.sellDate?
                nbTotal = 0
                total = 0

                for shareToCompute in $scope.shares
                    if shareToCompute.sellDate? && shareToCompute.sellDate <= share.sellDate
                        if $scope.isCompare == true
                            buyValue = fortuneoPrice.convert(shareToCompute.buyPrice * shareToCompute.nbShare, shareToCompute.stock.market.symbol, shareToCompute.buyEuroConversion, true).value
                            total+= (fortuneoPrice.convert(shareToCompute.sellPrice * shareToCompute.nbShare, shareToCompute.stock.market.symbol, shareToCompute.sellEuroConversion, false).value - buyValue) / buyValue * 100
                        else
                            buyValue = fortuneoPrice.convert(shareToCompute.buyPrice * shareToCompute.nbShare, shareToCompute.stock.market.symbol, shareToCompute.buyEuroConversion, true).value
                            total+= (fortuneoPrice.convert(shareToCompute.sellPrice * shareToCompute.nbShare, shareToCompute.stock.market.symbol, shareToCompute.sellEuroConversion, false).value - buyValue)
                        nbTotal++


                averageValue = total / nbTotal

                averageData.push [
                    share.sellDate + 12 * 3600 * 1000
                    averageValue
                ]
        ###
        averageData.push [
            new Date()
            averageValue
        ]
        ###

        averageData = $scope.orderValues(averageData)

        console.log averageData

        series.push
            id: 'average'
            name: "Average"
            data: averageData
            yAxis: 0
            width:'2px'
            step: true
            tooltip:
                valueDecimals: 4
            dataGrouping:
                units: $scope.groupingUnits


        plotLines = [
            value : 0
            color : 'red'
            dashStyle : 'shortdash'
            width : 2
            label :
                text : ''
        ]
        if $scope.isCompare == true
            plotLines.push
                value : $scope.averagePercentSell
                color : 'green'
                dashStyle : 'shortdash'
                width : 2
                label :
                    text : 'average'

        $("#" + $scope.idChartResult).highcharts "StockChart",

            chart:
                zoomType: 'x'

            rangeSelector:
                selected: 1
                inputEnabled: $("#" + $scope.idChartResult).width() > 480

            scrollbar:
                liveRedraw: false
            plotOptions:
                series:
                    compare: null

            yAxis:
                title :
                    text : if $scope.isCompare == true then 'Percent' else 'Value (Eur)'
                plotLines : plotLines

            series: series

    $scope.orderValues = (values) ->
        final = []
        i = 0
        for val in values
            j = 0
            founded=false
            for fin in final
               if val[0]<fin[0]
                   final.splice(j,0,val)
                   founded=true
                   break
               j++
            if founded == false
                final.push val
            i++
        return final


    $scope.buildChartResultAverage = ->
        # build price
        series = []

        for share in $scope.shares
            price = []

            buyValue = fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, true).value

            # find color
            if $scope.colorMap[share.stock.symbol]?
                color = $scope.colorMap[share.stock.symbol]
            else
                color = Highcharts.getOptions().colors[$scope.colorMap.counter]
                $scope.colorMap.counter++
                $scope.colorMap[share.stock.symbol] = color


            startValuePrice=(fortuneoPrice.convert(share.buyPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100

            price.push [
                share.buyDate
                startValuePrice / openDayService.getNbOpenDays(share.buyDate, share.buyDate)
            ]

            for value in share.stockValues
                if value.date == share.sellDate
                    valuePrice = (fortuneoPrice.convert(share.sellPrice * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100
                else
                    valuePrice=(fortuneoPrice.convert(value.valueClose * share.nbShare, share.stock.market.symbol, share.buyEuroConversion, false).value - buyValue) / buyValue * 100

                price.push [
                        value.date + 12 * 3600 * 1000
                        valuePrice / openDayService.getNbOpenDays(share.buyDate, value.date)
                ]

            series.push
                id: share.shareId
                name: share.stock.symbol
                data: price
                type:'area'
                step: true
                type: 'spline'
                yAxis: 0
                color:color
                width:'2px'
                tooltip:
                    valueDecimals: 4
                dataGrouping:
                    units: $scope.groupingUnits
                fillColor :
                    linearGradient :
                        x1: 0
                        y1: 0
                        x2: 0
                        y2: 1
                    stops : [
                        [0, Highcharts.Color(color).setOpacity(0.5).get('rgba')]
                        [1, Highcharts.Color(color).setOpacity(0).get('rgba')]
                    ]

            series.push
                type : 'flags'
                data : [
                    x : Date.UTC(2011, 3, 25)
                    title : 'H'
                    text : 'Euro Contained by Channel Resistance'
                ]
                onSeries : 'dataseries'
                shape : 'circlepin'
                width : 16

        plotLines = [
            value : 0
            color : 'red'
            dashStyle : 'shortdash'
            width : 2
            label :
                text : ''
        ]
        ###
        if $scope.isCompare == true
            plotLines.push
                value : $scope.averagePercentSell
                color : 'green'
                dashStyle : 'shortdash'
                width : 2
                label :
                    text : 'average'
        ###

        $("#" + $scope.idChartResultAverage).highcharts "StockChart",

            chart:
                zoomType: 'x'

            rangeSelector:
                selected: 1
                inputEnabled: $("#" + $scope.idChartResultAverage).width() > 480

            scrollbar:
                liveRedraw: false
            plotOptions:
                series:
                    compare: null

            yAxis:
                title :
                    text : 'Percent'
                plotLines : plotLines

            series: series

