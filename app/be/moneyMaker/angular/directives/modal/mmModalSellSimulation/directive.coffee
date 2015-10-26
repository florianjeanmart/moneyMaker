angular
.module('app.directives')
.directive "mmModalSellSimulation", (directiveService, messageFlash,$http) ->
    restrict: "E"

    scope: directiveService.autoScope
        ngParams: '='
    templateUrl: "$/angular/templates/mm-modal-sell-simulation.html"

    controller: ($scope, modalService,fortuneoPrice) ->
        directiveService.autoScopeImpl $scope

        $scope.buy = true
        $scope.result = {}
        $scope.priceCurrency = null


        $scope.fields = {

            stock:{
                fieldTitle: "Stock"
                url:"stock/autoCompletion/"
                field:$scope.getParams().stock
                focus: ->
                    return true
            }

            nb:{
                fieldTitle: "Number"
                validationRegex: "^[0-9]+$"
                validationMessage: "Only number"
                field:$scope.getParams().nbShare
                numbersOnly: 'integer'
            }

            buyPrice:{
                fieldTitle: "Buy price (total in €)"
                validationRegex: "^[0-9.]*$"
                validationMessage: "Only number"
                field:$scope.getParams().buyPrice
                numbersOnly: 'double'
            }

            sellPrice:{
                fieldTitle: "Sell price (by share in currency)"
                validationRegex: "^[0-9.]+$"
                validationMessage: "Only number"
                numbersOnly: 'double'
            }

            date:{
                fieldTitle: "date"
                validationRegex: "^.{1,255}$"
                validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH"
                field: new Date()
            }
        }

        # add values
        if $scope.getParams().stock?
            $scope.fields.stock.field = $scope.getParams().stock.name+" ("+$scope.getParams().stock.symbol+")"


        $scope.fieldsResult = {
            totalCurrency:{
                fieldTitle: 'Price in currency'
                disabled: true
                numbersOnly: 'double'
            }
            exchangeRate:{
                fieldTitle: 'Exchange rate'
                disabled: true
                numbersOnly: 'double'
            }
            price:{
                fieldTitle: 'Cost management'
                disabled: true
                numbersOnly: 'double'
            }
            tax:{
                fieldTitle: 'Taxe'
                disabled: true
                numbersOnly: 'double'
            }
            value:{
                fieldTitle: 'Total'
                disabled: true
                numbersOnly: 'double'
            }
            percentCost:{
                fieldTitle: 'Cost in %'
                disabled: true
                numbersOnly: 'double'
            }
        }

        $scope.allFieldValid = () ->
            for key in Object.keys($scope.fields)
                if key != '$$hashKey'
                    if !$scope.fields[key].isValid? || $scope.fields[key].isValid == false
                        return false
            return true

        #send the request to the server
        $scope.simulation= () ->
            if $scope.allFieldValid()
                $scope.loadStock()

        $scope.loadStock = ->
            $http.get("stock/get/"+$scope.fields.stock.field)
            .success (data,status)->
                $scope.stock = data
                if $scope.stock.currency.symbol != 'EUR'
                    $scope.loadCurrencyValue()
                else
                    $scope.compute()
            .error (data,status) ->
                messageFlash.displayError data.messages


        $scope.loadCurrencyValue = ->
            $http.get("currency/value/"+$scope.stock.currency.symbol+"/EUR/"+$scope.fields.date.field)
            .success (data,status)->
                $scope.compute(data.value)
            .error (data,status) ->
                messageFlash.displayError data.messages

        $scope.compute = (exchangeRate=null)->

             # compute price
            $scope.fieldsResult.totalCurrency.field = $scope.fields.nb.field * $scope.fields.buyPrice.field

            #fortuneo price
            $scope.result = fortuneoPrice.convert($scope.fieldsResult.totalCurrency.field, $scope.stock.market.symbol, exchangeRate, $scope.buy)
            $scope.fieldsResult.exchangeRate.field = $scope.result.exchangeRate
            $scope.fieldsResult.price.field = $scope.result.price
            $scope.fieldsResult.tax.field = $scope.result.tax
            if $scope.fields.buyPrice.field?
                console.log $scope.result.value+" "+$scope.fields.buyPrice.field
                $scope.fieldsResult.value.field = $scope.result.value - $scope.fields.buyPrice.field
            else
                $scope.fieldsResult.value.field = $scope.result.value

            # compute % cost
            percentCostDelta = ($scope.result.value - ($scope.fieldsResult.totalCurrency.field * exchangeRate)) / ($scope.fieldsResult.totalCurrency.field * exchangeRate) * 100
            if $scope.buy
                $scope.fieldsResult.percentCost.field = percentCostDelta
            else
                $scope.fieldsResult.percentCost.field = - percentCostDelta

        $scope.close = ->
            modalService.close modalService.SELL_SIMULATION

    link: (scope) ->

