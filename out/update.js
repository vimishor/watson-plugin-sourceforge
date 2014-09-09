(function() {
  var TaskGroup, utils;

  TaskGroup = require('taskgroup').TaskGroup;

  utils = require('./utils');

  module.exports = function(watson) {
    return {
      getDownloads: function(date_start, date_end, archs, cb) {
        var me, tasks;
        tasks = new TaskGroup("Fetch stats", {
          concurrency: 0
        });
        me = this;
        archs.map(function(arch) {
          return tasks.addTask(function(cb) {
            return me.getArchDownloads(utils.getFilename(date_start, arch), date_start, date_end, function(err, data) {
              return cb(err, {
                arch: arch,
                data: data
              });
            });
          });
        });
        tasks.done(function(err, results) {
          return cb(err, results);
        });
        return tasks.run();
      },

      /*
       * Get monthly downloads for a single architecture
       */
      getArchDownloads: function(file, date_start, date_end, cb) {
        var me, params, url;
        url = "http://sourceforge.net/projects/elementaryos/files/stable/" + file + "/stats/json";
        params = {
          'start_date': date_start,
          'end_date': date_end
        };
        me = this;
        return watson.client.get(url, params, function(err, body) {
          var json;
          if (err) {
            return cb(err, null);
          }
          try {
            json = JSON.parse(body);
            return cb(null, json.downloads);
          } catch (_error) {
            err = _error;
            return cb(err, null);
          }
        });
      }
    };
  };

}).call(this);
