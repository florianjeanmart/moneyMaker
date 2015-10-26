angular.module('app.services').service("frequencyService", function($rootScope) {
  this.DAY = {
    label: 'DAILY',
    time: 24 * 3600 * 1000
  };
  this.WEEK = {
    label: 'WEEKLY',
    time: 7 * this.DAY.time
  };
  this.MONTH = {
    label: 'MONTHLY',
    time: 30.4375 * this.DAY.time
  };
  this.YEAR = {
    label: 'YEARLY',
    time: 365.25 * this.DAY.time
  };
  this.QUARTER = {
    label: 'QUARTERLY',
    time: this.YEAR.time / 4
  };
  this.getFrequency = function(frequencyString) {
    if (frequencyString === this.DAY.label) {
      return this.DAY;
    }
    if (frequencyString === this.WEEK.label) {
      return this.WEEK;
    }
    if (frequencyString === this.MONTH.label) {
      return this.MONTH;
    }
    if (frequencyString === this.YEAR.label) {
      return this.YEAR;
    }
    if (frequencyString === this.QUARTER.label) {
      return this.QUARTER;
    }
    return null;
  };
  return;
});