angular
.module('app.controllers')
.controller "StockCtrl", ($scope, $http,messageFlash,modalService,generateId) ->


    $http.get("stock/historic")
    .success (data) ->
        console.log data
        $scope.historic = data
    .error (data) ->
        messageFlash.displayError data.messages

    $scope.id =generateId.generate()
    $scope.stocks = {}

    $scope.stock =
        fieldTitle: "Stock"
        url:"stock/autoCompletion/"


    $scope.$watch 'stock.field', (n,o) ->
        if o != n && n?
            $scope.loadStock($scope.stock.field)

    $scope.loadStock = (stock)->
        $http.get("stock/values/"+stock)
        .success (data) ->
            $scope.stocks[data.stock.symbol] =  data
            $scope.buildChart()
        .error (data) ->
            messageFlash.displayError data.messages


    $scope.isCompare = false

    $scope.$watch ('isCompare'), (o,n)->
        if o != n
            console.log  if $scope.isCompare == true then 'percent' else null
            $scope.buildChart()

    $scope.groupingUnits = [
        [
            'week'
            [1]
        ]
        [
            'month',
            [1, 2, 3, 4, 6]
        ]
    ]

    $scope.yAxis = [
        labels:
            align: 'right'
            x: -3
        title:
            text:'truc'
        height: if $scope.isCompare == true then '100%' else '70%'
        lineWidth:2
    ]

    $scope.removeStock = (symbol)->
        delete $scope.stocks[symbol]
        $scope.buildChart()

    $scope.buildChart = ->
        if $scope.stocks?

            # build price
            series = []

            for key in Object.keys($scope.stocks)
                if key != '$$hashKey'
                    stock = $scope.stocks[key]

                    price = []

                    for value in stock.values
                        price.push [
                                value.date+12*3600*1000
                                value.valueClose
                                value.valueMax
                                value.valueMin
                                value.valueOpen
                        ]

                    series.push
                        name: stock.stock.symbol
                        data: price
                        yAxis:0
                        type:'area'
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
                                [0, Highcharts.getOptions().colors[0]]
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]

            $("#"+$scope.id).highcharts "StockChart",

                chart:
                    zoomType : 'x'

                rangeSelector:
                    selected: 1
                    inputEnabled: $("#"+$scope.id).width() > 480

                scrollbar:
                    liveRedraw: false

                plotOptions:
                    series:
                        compare: if $scope.isCompare == true then 'percent' else null

                yAxis:$scope.yAxis

                series: series

    $scope.loadStocks = ->
        $http.get("stock/loading")
