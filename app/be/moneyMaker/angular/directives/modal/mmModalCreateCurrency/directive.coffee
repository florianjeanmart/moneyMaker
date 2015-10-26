angular
.module('app.directives')
.directive "mmModalCreateCurrency", (directiveService, messageFlash,$http) ->
    restrict: "E"

    scope: directiveService.autoScope
        ngParams: '='
    templateUrl: "$/angular/templates/mm-modal-create-currency.html"

    controller: ($scope, modalService) ->
        directiveService.autoScopeImpl $scope

        $scope.fields = {

            name:{
                fieldTitle: "Name in international system"
                validationRegex: "^[A-Z]{3}$"
                validationMessage: "3 majuscules letters"
                focus: ->
                    return true
            }

            symbol:{
                fieldTitle: "Symbol"
                validationRegex: "^.{1,3}$"
                validationMessage: "max 3 characters"
            }
        }

        $scope.allFieldValid = () ->
            for key in Object.keys($scope.fields)
                if key != '$$hashKey'
                    if !$scope.fields[key].isValid? || $scope.fields[key].isValid == false
                        return false
            return true

        #send the request to the server
        $scope.save = () ->
            if $scope.allFieldValid()

                #create DTO
                data = {}
                data.name = $scope.fields.name.field
                data.symbol = $scope.fields.symbol.field

                $scope.isLoading = true
                #create currency
                $http.post('/currency/create', data)
                .success (data) ->

                    #display success message
                    messageFlash.displaySuccess "new currency are created"

                    #TODO add to list

                    #close window
                    $scope.close()
                .error (data) ->
                    messageFlash.displayError data.message
                    $scope.isLoading = false

            return false

        $scope.close = ->
            modalService.close modalService.CREATE_CURRENCY

    link: (scope) ->

