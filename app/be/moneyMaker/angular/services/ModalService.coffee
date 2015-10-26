# simple download service
angular
.module('app.services')
.service "modalService", ($rootScope) ->

    @CREATE_SHARE = 'create-share'
    @CREATE_CURRENCY = 'create-currency'
    @SELL_SHARE = 'SELL_SHARE'
    @SELL_SIMULATION='SELL_SIMULATION'

    @show = (modalName,params) ->

        args = []
        args.show = true
        args.params = params
        args.target = modalName
        $rootScope.displayModalBackground = true
        $rootScope.$broadcast('SHOW_MODAL', args)

    @close = (modalName) ->

        args = []
        args.show = false
        args.target = modalName
        $rootScope.displayModalBackground = false
        $rootScope.$broadcast('SHOW_MODAL', args)

    return