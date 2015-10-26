angular
.module('app.controllers')
.controller "MainCtrl", ($scope) ->
    console.log "je suis le MainCtrl"
#rootScope
angular.module('app').run ($rootScope,$location)->

    $rootScope.isMenuCurrentlySelected = (loc) ->
        if $location.path().substring(0, loc.length) == loc
            return true
        else
            return false
