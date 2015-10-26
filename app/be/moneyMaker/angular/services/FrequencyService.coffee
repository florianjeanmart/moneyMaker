# simple download service
angular
.module('app.services')
.service "frequencyService", ($rootScope) ->
    @DAY = {
        label : 'DAILY'
        time : 24* 3600 * 1000
    }
    @WEEK = {
        label : 'WEEKLY'
        time : 7 * @DAY.time
    }
    @MONTH = {
        label : 'MONTHLY'
        time : 30.4375 * @DAY.time
    }
    @YEAR ={
        label : 'YEARLY'
        time : 365.25 * @DAY.time
    }
    @QUARTER = {
        label : 'QUARTERLY'
        time : @YEAR.time / 4
    }

    @getFrequency = (frequencyString) ->
        if frequencyString == @DAY.label
            return @DAY
        if frequencyString == @WEEK.label
            return @WEEK
        if frequencyString == @MONTH.label
            return @MONTH
        if frequencyString == @YEAR.label
            return @YEAR
        if frequencyString == @QUARTER.label
            return @QUARTER
        return null
    return
