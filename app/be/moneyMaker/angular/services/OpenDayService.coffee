angular
.module('app.services')
.service "openDayService", (flash) ->

    @getNbOpenDays = (date1, date2) ->

        # compute difference
        nbDay = (date2 - date1) / (24 * 3600 * 1000)
        i = 0
        nbOpenDay = 0
        while i < nbDay
            day = new Date(date1 + (24 * 3600 * 1000 * i)).getDay()
            if day != 5 && day != 6
                nbOpenDay++
            i++
        if nbOpenDay == 0
            nbOpenDay = 1
        return nbOpenDay

    return