angular.module('app.directives').directive("mmModalSellShare", function(directiveService, messageFlash, $http) {
  return {
    restrict: "E",
    scope: directiveService.autoScope({
      ngParams: '='
    }),
    templateUrl: "$/angular/templates/mm-modal-sell-share.html",
    controller: function($scope, modalService) {
      directiveService.autoScopeImpl($scope);
      $scope.fields = {
        date: {
          fieldTitle: "date",
          validationRegex: "^.{1,255}$",
          validationMessage: "ORGANIZATION_NAME_WRONG_LENGTH"
        },
        price: {
          fieldTitle: "Price",
          validationRegex: "^[0-9.]+$",
          validationMessage: "Only number",
          numbersOnly: 'double'
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
        var dto, url;
        if ($scope.allFieldValid()) {
          dto = {};
          dto.shareId = $scope.getParams().share.shareId;
          dto.price = $scope.fields.price.field;
          dto.date = $scope.fields.date.field;
          console.log(dto);
          url = "share/sell";
          $scope.isLoading = true;
          $http.post(url, dto).success(function(data, status) {
            $scope.getParams().refreshShare(data);
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
        return modalService.close(modalService.SELL_SHARE);
      };
    },
    link: function(scope) {}
  };
});