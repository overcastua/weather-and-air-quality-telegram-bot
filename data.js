const {update_aqi_data, update_weather_data, update_air_polution_data, update_all} = require('./fetch_data')

async function refresh_data() {
    const results = await update_all()
}

async function weather(){
    const data = await update_weather_data()
    const result = {
        skytext: data.data[0].weather.description,
        temperature: data.data[0].temp,
        feelslike: data.data[0].app_temp,
        cloud_coverage: data.data[0].clouds,
        wind_speed: data.data[0].wind_spd,
        wind_direction: data.data[0].wind_cdir_full,
        humidity: data.data[0].rh,
        pressure: data.data[0].pres,
        visibility: data.data[0].vis,
        uv: data.data[0].uv,
        sunset: data.data[0].sunset
    }
    return result
}

async function elements(){
    const data = await update_air_polution_data()
    const data_aqi = await update_aqi_data()
    const result = {
        aqi: data_aqi.data.aqi,
        aqi_status: data_aqi.status,
        o3: data.list[0].components.o3,
        no2: data.list[0].components.no2,
        co: data.list[0].components.co,
        so2: data.list[0].components.so2,
        pm2p5: data.list[0].components.pm2_5,
        pm10: data.list[0].components.pm10
    }
    return result
}

module.exports.weather = weather
module.exports.elements = elements