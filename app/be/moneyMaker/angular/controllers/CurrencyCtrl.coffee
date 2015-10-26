angular
.module('app.controllers')
.controller "CurrencyCtrl", ($scope, $http,messageFlash,modalService) ->

    $scope.currencies = []
    $scope.reference = null
    $scope.currency = null

    url = "currency/all"
    $http.get(url)
    .success (data, status)->
        $scope.currencies = data.currenciesList
        messageFlash.displaySuccess "Currency list loaded"

    .error (data, status)->
        messageFlash.displaySuccess data.messages

    $scope.$watch 'currency', (o,n)->
        if o!=n
            $scope.loadValues()
    $scope.$watch 'reference', (o,n)->
        if o!=n
            $scope.loadValues()

    $scope.loadValues = ->
        if $scope.currency? && $scope.reference?
            $http.get("currency/values/"+$scope.reference.name+"/"+$scope.currency.name)
            .success (data, status)->


                values = []
                for value in data.values
                    values[values.length] = [value.date+10*3600*1000, value.value]

                $scope.chartData = {}
                $scope.chartData.values = values
                $scope.chartData.title = data.reference.name+" to "+data.currency.name+" exchange rate"
                $scope.chartData.seriesTitle = data.currency.name

            .error (data, status)->
                messageFlash.displayError data.messages

    $scope.createCurrency = ->
        modalService.show modalService.CREATE_CURRENCY