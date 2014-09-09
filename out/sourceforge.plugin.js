(function() {
  var moment, utils;

  moment = require('moment');

  utils = require('./utils');

  module.exports = function(watson) {
    var arch, date_start, enabled, name, version;
    enabled = true;
    name = 'sourceforge';
    version = require("package.json").version;
    date_start = '2013-08-10';
    arch = ['i386', 'amd64'];

    /*
     * Get stats on build time
     *
     * NOTE: Because sf.net offers history through their API, we don't really
     * need to store fetched data in a local database.
     */
    watson.addTask('build', function(complete) {
      var today, updater;
      console.log("fetch data from " + name + " plugin");
      updater = require('./update')(watson);
      today = moment().format('YYYY.MM.DD');
      return updater.getDownloads(date_start, moment().subtract(1, 'months').format('YYYY-MM-DD'), ['i386', 'amd64'], function(err, results) {
        var downloads;
        if (err) {
          return complete(err, null);
        }
        downloads = {
          categories: [],
          series: []
        };
        results.map(function(set) {
          var item, item_count, item_date, series_set, _i, _len, _ref;
          set = set[1];
          series_set = {
            name: set.arch,
            data: []
          };
          _ref = set.data;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            item_date = moment(item[0]).format('MMM<br>YYYY');
            item_count = item[1];
            downloads.categories.push(item_date);
            series_set.data.push(item_count);
          }
          return downloads.series.push(series_set);
        });
        return complete(null, {
          name: 'sourceforge',
          data: downloads
        });
      });
    });
    return {
      enabled: enabled,
      name: name,
      version: version,
      scripts: "web/assets/js/sourceforge.js",
      partial: "web/sourceforge.html"
    };
  };

}).call(this);
