const {AQI_token, Weatherbit_token, OpenWeatherMap_token} = require('./private') 
const fetch = require('node-fetch')


function send_get_req(link){
    return fetch(link, { method: 'GET' })
    .then(res => res.json())
}

function update_aqi_data(){
    return new Promise(async (resolve, reject) => {
        const data = await send_get_req(`https://api.waqi.info/feed/kyiv/?token=${AQI_token}`)
        if (data) {
            data.source = 'waqi'
            resolve(data)
        } else {
            reject()
        }
    })
}

function update_weather_data(){
    return new Promise(async (resolve, reject) => {
        const data = await send_get_req(`https://api.weatherbit.io/v2.0/current?city=Kyiv&country=UA&key=${Weatherbit_token}&include=minutely`)
        if (data) {
            data.source = 'WB_weather'
            resolve(data)
        } else {
            reject()
        }
    })
}

function update_air_polution_data(){
    return new Promise(async (resolve, reject) => {
        const data = await send_get_req(`http://api.openweathermap.org/data/2.5/air_pollution?lat=50.450001&lon=30.523333&appid=${OpenWeatherMap_token}`)
        if (data) {
            data.source = 'OWM'
            resolve(data)
        } else {
            reject()
        }
    })
}

function update_all(){
    return Promise.all([update_aqi_data(), update_forecast_data(), update_weather_data(), update_air_polution_data()])
}


module.exports.update_aqi_data = update_aqi_data
module.exports.update_weather_data = update_weather_data
module.exports.update_air_polution_data = update_air_polution_data
module.exports.update_all = update_all