angular.module('app.directives').directive("numbersOnly", function($filter, $locale) {
  return {
    restrict: 'A',
    require: "ngModel",
    link: function(scope, element, attrs, modelCtrl) {
      var convertToFloat, convertToString, displayError, errorMessage, filterFloat, nbDecimal;
      if (attrs.numbersOnly === "integer" || attrs.numbersOnly === "double") {
        if (attrs.numbersOnly === "integer") {
          errorMessage = 'Only integer';
        } else {
          errorMessage = 'Only number';
        }
        nbDecimal = 3;
        if (attrs.numbersOnly === "integer") {
          nbDecimal = 0;
        }
        scope.$root.$on('$localeChangeSuccess', function(event, current, previous) {
          var result;
          if (modelCtrl.$modelValue != null) {
            result = convertToString(parseFloat(modelCtrl.$modelValue));
            if (result != null) {
              modelCtrl.$setViewValue(result.toString());
              return modelCtrl.$render();
            }
          }
        });
        modelCtrl.$parsers.unshift(function(viewValue) {
          var result, resultString, resultToDisplay;
          if (viewValue === "") {
            return null;
          }
          result = convertToFloat(viewValue);
          if (isNaN(result)) {
            displayError();
            if (scope.lastValidValue != null) {
              resultString = scope.lastValidValue.toString();
              if (attrs.numbersOnly === "percent") {
                resultToDisplay = (scope.lastValidValue * 100).toString();
              } else {
                resultToDisplay = scope.lastValidValue.toString();
              }
            } else {
              resultString = "";
              resultToDisplay = "";
            }
            modelCtrl.$setViewValue(resultToDisplay);
            modelCtrl.$render();
          } else {
            if (attrs.numbersOnly === "percent") {
              result = result / 100;
            }
            scope.lastValidValue = result;
            resultString = result.toString();
          }
          if (resultString === "") {
            return null;
          }
          return resultString;
        });
        modelCtrl.$formatters.unshift(function(modelValue) {
          var result;
          result = parseFloat(modelValue);
          if (attrs.numbersOnly === "percent") {
            result = result * 100;
          }
          return convertToString(result);
        });
        displayError = function() {
          if (scope.setErrorMessage != null) {
            return scope.setErrorMessage(errorMessage);
          }
        };
        convertToString = function(value) {
          var formats, result;
          if (!(value != null) || isNaN(value)) {
            return "";
          }
          value = value.toFixed(nbDecimal);
          formats = $locale.NUMBER_FORMATS;
          return result = value.toString().replace(new RegExp("\\.", "g"), formats.DECIMAL_SEP);
        };
        convertToFloat = function(viewValue) {
          var decimalRegex, formats, value;
          if (viewValue === "") {
            return NaN;
          }
          formats = $locale.NUMBER_FORMATS;
          decimalRegex = formats.DECIMAL_SEP;
          if (decimalRegex === ".") {
            decimalRegex = "\\.";
          }
          value = viewValue.replace(new RegExp(decimalRegex, "g"), ".");
          return filterFloat(value);
        };
        filterFloat = function(value) {
          var regexFloat;
          if (attrs.numbersOnly === "integer") {
            regexFloat = new RegExp("^(\\-|\\+)?([0-9]+|Infinity)$");
          } else {
            regexFloat = new RegExp("^(\\-|\\+)?([0-9]+(\\.[0-9]*)?|Infinity)$");
          }
          if (regexFloat.test(value)) {
            return Number(value);
          }
          return NaN;
        };
        return scope.$root.$on('FORM_LOADING_FINISH', function(event, current, previous) {
          if (modelCtrl.$modelValue != null) {
            return scope.lastValidValue = modelCtrl.$modelValue;
          }
        });
      }
    }
  };
});