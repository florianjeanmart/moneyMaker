angular.module('app.directives').directive("mmModalCreateCurrency", function(directiveService, messageFlash, $http) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngParams: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-create-currency.html",
    controller: function($scope, modalService) {
      directiveService.autoScopeImpl($scope);
      $scope.fields = {
        name: {
          fieldTitle: "Name in international system",
          validationRegex: "^[A-Z]{3}$",
          validationMessage: "3 majuscules letters",
          focus: function() {
            return true;
          }
        },
        symbol: {
          fieldTitle: "Symbol",
          validationRegex: "^.{1,3}$",
          validationMessage: "max 3 characters"
        }
      };
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
        var data;
        if ($scope.allFieldValid()) {
          data = {};
          data.name = $scope.fields.name.field;
          data.symbol = $scope.fields.symbol.field;
          $scope.isLoading = true;
          $http.post('/currency/create', data).success(function(data) {
            messageFlash.displaySuccess("new currency are created");
            return $scope.close();
          }).error(function(data) {
            messageFlash.displayError(data.message);
            return $scope.isLoading = false;
          });
        }
        return false;
      };
      return $scope.close = function() {
        return modalService.close(modalService.CREATE_CURRENCY);
      };
    },
    link: function(scope) {}
  };
});