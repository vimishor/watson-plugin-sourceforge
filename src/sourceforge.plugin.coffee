moment  = require('moment')
utils   = require('./utils')

module.exports = (watson) ->
    
    enabled = true
    name    = 'sourceforge'
    version = require("package.json").version

    date_start  = '2013-08-10'
    arch        = ['i386', 'amd64']

    ###
    # Get stats on build time
    #
    # NOTE: Because sf.net offers history through their API, we don't really
    # need to store fetched data in a local database.
    ###
    watson.addTask 'build', (complete) ->
        console.log "fetch data from #{name} plugin"

        updater     = require('./update')(watson)
        today       = moment().format('YYYY.MM.DD')

        updater.getDownloads date_start, moment().subtract(1, 'months').format('YYYY-MM-DD'), ['i386', 'amd64'], (err, results) ->
            if err
                return complete(err, null)

            downloads = { categories: [], series: [] }

            results.map (set) ->
                set = set[1]

                series_set = {
                    name: set.arch,
                    data: []
                }

                for item in set.data
                    item_date   = moment(item[0]).format('MMM<br>YYYY')
                    item_count  = item[1]

                    downloads.categories.push(item_date)
                    series_set.data.push(item_count)

                downloads.series.push(series_set)

            complete(null, { name: 'sourceforge', data: downloads } )

    return {
        enabled:    enabled,
        name:       name,
        version:    version,
        scripts:    "web/assets/js/sourceforge.js"
        partial:    "web/sourceforge.html"
    }
