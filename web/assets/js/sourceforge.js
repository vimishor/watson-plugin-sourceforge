$(document).ready(function() {

buildDownloadsChart = function (event) {
    var stats = event.message.sourceforge;

    var options = {

        chart: {
            type: 'line',
            height: 340
        },

        title: {
            text: 'Downloads for elementaryOS Luna'
        },

        subtitle: {
            //text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: stats.categories
        },
        yAxis: {
            title: {
                text: 'Downloads'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: stats.series
    };

    // Column chart
    options.chart.renderTo = 'downloads';
    var chart2 = new Highcharts.Chart(options);
};

$(document).on('data.ready', buildDownloadsChart);

});
