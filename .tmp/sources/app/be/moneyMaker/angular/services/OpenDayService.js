angular.module('app.services').service("openDayService", function(flash) {
  this.getNbOpenDays = function(date1, date2) {
    var day, i, nbDay, nbOpenDay;
    nbDay = (date2 - date1) / (24 * 3600 * 1000);
    i = 0;
    nbOpenDay = 0;
    while (i < nbDay) {
      day = new Date(date1 + (24 * 3600 * 1000 * i)).getDay();
      if (day !== 5 && day !== 6) {
        nbOpenDay++;
      }
      i++;
    }
    if (nbOpenDay === 0) {
      nbOpenDay = 1;
    }
    return nbOpenDay;
  };
  return;
});