const fs = require('fs')
const path = require('path')
const chartExporter = require("highcharts-export-server")
const Elements = require('./models/elements')

let chartOptions = {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Динаміка зміни вмісту шкідливих речовин у повітрі в м. Київ'
    },
    xAxis: {
        categories: [],
        title: {
            text: 'День місяця',
        }
    },
    yAxis: {
        min: 0,
        tickInterval: 10,
        title: {
            text: 'Концентрація (μg/m3)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' μg/m3'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: []
}

function fetch_chart1_data(){
    return new Promise( async (resolve, reject) => {
        let o3_data = []
        let co_data = []
        await Elements.find({month: +get_only_month()}) ///проверить документы которые находит
            .then(data => data.forEach(doc => {
                o3_data.push(doc.o3)
                co_data.push(doc.co)

                chartOptions.xAxis.categories.push(get_day(doc.date))
            }))
            chartOptions.series.push({ name: 'озон', data: o3_data })
            chartOptions.series.push({ name: 'чадний газ', data: co_data })
            chartOptions.yAxis.tickInterval = 10
            resolve(chartOptions)
    })
}

function fetch_chart2_data(){
    return new Promise( async (resolve, reject) => {
        let so2_data = []
        let no2_data = []
        let pm2p5_data = []
        let pm10_data = []
        await Elements.find({month: +get_only_month()}) 
            .then(data => data.forEach(doc => {
                so2_data.push(doc.so2)
                no2_data.push(doc.no2)
                pm2p5_data.push(doc.pm2p5)
                pm10_data.push(doc.pm10)

                chartOptions.xAxis.categories.push(get_day(doc.date))
            }))
            chartOptions.series.push({ name: 'діоксид сірки', data: so2_data });
            chartOptions.series.push({ name: 'оксид азоту', data: no2_data });
            chartOptions.series.push({ name: 'PM 2.5', data: pm2p5_data });
            chartOptions.series.push({ name: 'PM 10', data: pm10_data });
            chartOptions.yAxis.tickInterval = 1
            resolve(chartOptions)
    })
}

async function chartSend(ctx, month, opt, number_of_chart) {
    return new Promise((resolve, reject) => {
        chartExporter.initPool()
        chartExporter.export({
            type: "png",
            options: opt,
            width: 1800
        }, (err, res) => {
                try {
                    let imageb64 = res.data;
                    let outputFile = './chart.png';

                    fs.writeFileSync(outputFile, imageb64, "base64", (err) => {
                        if (err) { console.log(err); }
                    });

                    chartExporter.killPool();
                    resolve()
                }
                catch (e) {
                    console.log(e);
                }
            })
    }).then(() => {
        ctx.replyWithPhoto({ source: './chart.png' }, { caption: `Графік за ${months.get(month)} №${number_of_chart}`})
    }).then(() => {
        chartOptions.series = []
        chartOptions.xAxis.categories = []
        if (fs.existsSync(path.join(__dirname + '/chart.png'))) {
            fs.unlinkSync(path.join(__dirname + '/chart.png'))
          }
    })
}


function get_only_month(){
    return new Date().toISOString().split("T")[0].split("-")[1]
}

function get_day(date){
    return date.split('-')[2]
}

const months = new Map([
    ['01', 'січень'],
    ['02', 'лютий'],
    ['03', 'березень'],
    ['04', 'квітень'],
    ['05', 'травень'],
    ['06', 'червень'],
    ['07', 'липень'],
    ['08', 'серпень'],
    ['09', 'вересень'],
    ['10', 'жовтень'],
    ['11', 'листопад'],
    ['12', 'грудень']
])

module.exports.fetch_chart1_data = fetch_chart1_data
module.exports.fetch_chart2_data = fetch_chart2_data
module.exports.chartSend = chartSend
module.exports.get_only_month = get_only_month