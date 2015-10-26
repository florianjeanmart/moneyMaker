angular
.module('app.directives')
.directive "mmModalSellShare", (directiveService, messageFlash,$http) ->
    restrict: "E"

    scope: directiveService.autoScope
        ngParams: '='
    templateUrl: "$/angular/templates/mm-modal-sell-share.html"

    controller: ($scope, modalService) ->
        directiveService.autoScopeImpl $scope

        $scope.fields = {

            date:{
                fieldTitle: "date"
                validationRegex: "^.{1,255}$"
                validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH"
            }

            price:{
                fieldTitle: "Price"
                validationRegex: "^[0-9.]+$"
                validationMessage: "Only number"
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
        $scope.save = () ->
            if $scope.allFieldValid()

                #build dto
                dto = {}
                dto.shareId = $scope.getParams().share.shareId
                dto.price = $scope.fields.price.field
                dto.date = $scope.fields.date.field

                console.log dto
                url = "share/sell"

                $scope.isLoading = true

                $http.post(url,dto)
                .success (data,status) ->
                    $scope.getParams().refreshShare(data)
                    $scope.close()
                    $scope.isLoading = false
                .error (data) ->
                    messageFlash.displayError data.message
                    $scope.isLoading = false

            return

        $scope.close = ->
            modalService.close modalService.SELL_SHARE

    link: (scope) ->

