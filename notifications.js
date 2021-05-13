const cron = require('node-cron')
const Elements = require('./models/elements')
const User = require('./models/user')
const {elements, weather} = require ('./data')

async function send_elems_notifications(bot){
    const data = await elements()
    await User.find({subscribed_to_elements: true})
        .then(users => users.forEach(doc => {
            bot.telegram.sendMessage(doc.chat_id, display_elems(data), { parse_mode: 'HTML' })
        }))
}

async function send_weather_notifications(bot){
    const data = await weather()
    await User.find({subscribed_to_weather: true})
        .then(users => users.forEach(doc => {
            bot.telegram.sendMessage(doc.chat_id, display_weather(data), { parse_mode: 'HTML' })
        }))
}

function schedule_a_notification(time, bot){
    cron.schedule(time, () => {
        save_data_to_db()
        send_weather_notifications(bot)
        send_elems_notifications(bot)
    }, {
        scheduled: true,
        timezone: "Europe/Kiev"
    })
}

async function save_data_to_db() {
    const already_exists = await Elements.exists({date: get_only_date()})
    if(!already_exists){
        const data = await elements()
        const elems = new Elements({
            o3: data.o3,
            co: data.co,
            so2: data.so2,
            no2: data.no2,
            pm2p5: data.pm2p5,
            pm10: data.pm10
        })
        await elems.save()
    }
}

function get_only_date() {
    return new Date().toISOString().split("T")[0]
 }
 
 function display_weather(param) {
    return `<b>Погода та середовище</b>\n\n<i>Статус</i>: ${param.skytext}\n<i>Температура</i>: ${param.temperature}°С\n<i>Відчувається як</i>: ${param.feelslike}°С
<i>Хмарність</i>: ${param.cloud_coverage}%\n<i>Швидкість вітру</i>: ${param.wind_speed} м/с\n<i>Напрямок вітру</i>: ${param.wind_direction}
<i>Вологість повітря</i>: ${param.humidity}%\n<i>Атмосферний тиск</i>: ${Math.floor(param.pressure / 1.3333)} мм рт. ст.
<i>Видимість</i>: ${param.visibility} км\n<i>УФ-індекс</i>: ${param.uv}
<i>Захід сонця</i>: ${param.sunset}`;
}

function display_elems(param) {
    return `<b>Панель якості атмосферного повітря</b>\n\n<i>AQI</i>: ${param.aqi}\n<i>Статус</i>: ${param.aqi_status}\n
<b>Панель концентрації шкідливих елементів у атмосферному повітрі</b>\n\n<i>O3</i>: ${param.o3} μg/m3\n<i>NO2</i>: ${param.no2} μg/m3\n<i>CO</i>: ${param.co} μg/m3\n<i>SO2</i>: ${param.so2} μg/m3\n<i>Pm2.5</i>: ${param.pm2p5} μg/m3\n<i>Pm10</i>: ${param.pm10} μg/m3`;
}

module.exports.schedule_a_notification = schedule_a_notification
module.exports.send_weather_notifications = send_weather_notifications
module.exports.send_elems_notifications = send_elems_notifications
module.exports.display_weather = display_weather
module.exports.display_elems = display_elems
module.exports.save_data_to_db = save_data_to_db
