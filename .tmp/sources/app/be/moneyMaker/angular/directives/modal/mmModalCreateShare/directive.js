angular.module('app.directives').directive("mmModalCreateShare", function(directiveService, messageFlash, $http) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngParams: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-create-share.html",
    controller: function($scope, modalService) {
      directiveService.autoScopeImpl($scope);
      $scope.fields = {
        stock: {
          fieldTitle: "Stock",
          url: "stock/autoCompletion/",
          focus: function() {
            return true;
          }
        },
        stockEdit: {
          fieldTitle: "Stock",
          disabled: true,
          field: null
        },
        nb: {
          fieldTitle: "Number",
          validationRegex: "^[0-9]+$",
          validationMessage: "Only number",
          numbersOnly: 'integer'
        },
        price: {
          fieldTitle: "Price",
          validationRegex: "^[0-9.]+$",
          validationMessage: "Only number",
          numbersOnly: 'double'
        },
        date: {
          fieldTitle: "date",
          validationRegex: "^.{1,255}$",
          validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH"
        },
        sellPrice: {
          fieldTitle: "Sell price",
          validationRegex: "^[0-9.]+$",
          validationMessage: "Only number",
          numbersOnly: 'double',
          hidden: true
        },
        sellDate: {
          fieldTitle: "Sell date",
          validationRegex: "^.{1,255}$",
          validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH",
          hidden: true
        }
      };
      if (($scope.getParams() != null) && ($scope.getParams().share != null)) {
        console.log($scope.getParams().share);
        $scope.fields.stockEdit.field = $scope.getParams().share.stock.name + " (" + $scope.getParams().share.stock.symbol + ")";
        $scope.fields.nb.field = $scope.getParams().share.nbShare + "";
        $scope.fields.price.field = $scope.getParams().share.buyPrice + "";
        $scope.fields.date.field = $scope.getParams().share.buyDate + "";
        $scope.fields.stock.hidden = true;
        if ($scope.getParams().share.sellPrice != null) {
          $scope.fields.sellPrice.hidden = false;
          $scope.fields.sellPrice.field = $scope.getParams().share.sellPrice;
          $scope.fields.sellDate.hidden = false;
          $scope.fields.sellDate.field = $scope.getParams().share.sellDate;
        }
      } else {
        $scope.fields.stockEdit.hidden = true;
      }
      $scope.allFieldValid = function() {
        var key, _i, _len, _ref;
        _ref = Object.keys($scope.fields);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (key !== '$$hashKey') {
            if (!($scope.fields[key].isValid != null) || $scope.fields[key].isValid === false) {
              return false;
            }
          }
        }
        return true;
      };
      $scope.save = function() {
        var dto, url;
        if ($scope.allFieldValid()) {
          dto = {};
          if (($scope.getParams() != null) && ($scope.getParams().share != null)) {
            dto.shareId = $scope.getParams().share.shareId;
            dto.sellDate = $scope.fields.sellDate.field;
            dto.sellPrice = $scope.fields.sellPrice.field;
            url = "share/edit";
          } else {
            dto.stockName = $scope.fields.stock.field;
            url = "share/create";
          }
          dto.number = $scope.fields.nb.field;
          dto.price = $scope.fields.price.field;
          dto.date = $scope.fields.date.field;
          console.log(dto);
          $scope.isLoading = true;
          $http.post(url, dto).success(function(data, status) {
            if (($scope.getParams() != null) && ($scope.getParams().share != null)) {
              $scope.getParams().refreshShare(data);
            } else {
              $scope.getParams().addShare(data);
            }
            $scope.close();
            return $scope.isLoading = false;
          }).error(function(data) {
            messageFlash.displayError(data.message);
            return $scope.isLoading = false;
          });
        }
        return;
      };
      return $scope.close = function() {
        return modalService.close(modalService.CREATE_SHARE);
      };
    },
    link: function(scope) {}
  };
});