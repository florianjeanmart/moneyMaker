angular
.module('app.directives')
.directive "mmWelcome", ($location,$http) ->
    restrict: "E"
    scope: {}
    templateUrl: "$/angular/templates/mm-welcome.html"
    replace: true
    transclude: true
    link: (scope) ->

        #
        # Tabs -- transition
        # loc : the localisation targeted
        # confirmed : the modification of localisation was already confirmed by the user
        #
        scope.nav = (loc) ->
            $location.path(loc)

        scope.test = ->
            $http.get("test")

