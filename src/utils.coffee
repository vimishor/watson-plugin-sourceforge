moment = require('moment')

module.exports =
    
    ###
    # Get filename for specified architecture
    #
    # @public
    # @param {String} date Format: YYYY.MM.DD
    # @param {String} arch i386 or amd64
    # @return {String}
    ###
    getFilename: (date, arch) ->
        if not arch in ['i386', 'amd64']
            return null

        date = moment(date).format('YYYYMMDD')

        return "elementaryos-stable-#{arch}.#{date}.iso"

    ###
    # Enumerate months since startDate until today
    #
    # @public
    # @param {Object} startDate moment.js date object
    # @return {Array} Format: [ 'MMM YYYY' ]
    ###
    getMonths: (startDate) ->
        months              = []
        nowNormalized       = moment().startOf('month')
        startDateNormalized = startDate.clone().startOf('month').add('M', 0)
        
        while (startDateNormalized.isBefore(nowNormalized))
            months.push startDateNormalized.format('MMM YYYY')
            startDateNormalized.add('M', 1)
        return months
