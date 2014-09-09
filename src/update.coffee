{TaskGroup} = require('taskgroup')
utils       = require('./utils')

module.exports = (watson) ->

    getDownloads: (date_start, date_end, archs, cb) ->
        tasks   = new TaskGroup "Fetch stats", concurrency:0
        me      = @

        archs.map (arch) ->
            tasks.addTask (cb) ->
                me.getArchDownloads utils.getFilename(date_start, arch), date_start, date_end, (err, data) ->
                    cb(err, { arch: arch, data: data })

        tasks.done (err, results) ->
            cb(err, results)

        tasks.run()



    ###
    # Get monthly downloads for a single architecture
    ###
    getArchDownloads: (file, date_start, date_end, cb) ->
        url     = "http://sourceforge.net/projects/elementaryos/files/stable/#{file}/stats/json"
        params  = { 'start_date': date_start, 'end_date': date_end }
        me      = @

        watson.client.get url, params, (err, body) ->
            if err
                return cb(err, null)

            try
                json = JSON.parse body
                return cb(null, json.downloads)
            catch err
                return cb(err, null)
