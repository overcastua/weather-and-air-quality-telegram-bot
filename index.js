const {bot_token} = require('./private') 
const { Telegraf } = require('telegraf')
const {db_connection, save_user_chat_id, update_elements_subscription_status, update_weather_subscription_status} = require('./database_operations')
const {fetch_chart1_data, fetch_chart2_data, chartSend, get_only_month} = require('./charts')
const {schedule_a_notification, display_elems, display_weather} = require('./notifications')
const {weather, elements} = require('./data')

const bot = new Telegraf(bot_token)

bot.start((ctx) => {
    const menu = {
        reply_markup: {
            keyboard: [
                ['Погодні умови', 'Забруднення повітря'], 
                ['Cповіщення: Погодні умови', 'Cповіщення: Забруднення повітря'],
                ['Графіки забрудення повітря за поточний місяць'],
                ['Розшифровка показників'],
                ['Загальна інформація про бота'],
            ]
        }
    }
    ctx.reply(`Привіт, ${ctx.from.first_name}. Тут ти можеш отримати актуальні дані про стан довкілля у місті Київ.`, menu)
    save_user_chat_id(ctx.update.message.chat.id)      
})


bot.on('message', async (ctx) => {
    if (ctx.message.text === 'Cповіщення: Погодні умови') {
        const message = await update_weather_subscription_status(ctx.update.message.chat.id, 'subscribed_to_weather')
        ctx.reply(message)
    } else if (ctx.message.text === 'Cповіщення: Забруднення повітря') {
        const message = await update_elements_subscription_status(ctx.update.message.chat.id, 'subscribed_to_elements')
        ctx.reply(message)
    } else if (ctx.message.text === 'Погодні умови') {
        ctx.reply(display_weather(await weather()), { parse_mode: 'HTML' })
    } else if (ctx.message.text === 'Забруднення повітря') {
        ctx.reply(display_elems(await elements()), { parse_mode: 'HTML' })
    }  else if (ctx.message.text === 'Графіки забрудення повітря за поточний місяць') {
        await chartSend(ctx, get_only_month(), await fetch_chart1_data(), 1)
        await chartSend(ctx, get_only_month(), await fetch_chart2_data(), 2)
    } else if (ctx.message.text === 'Розшифровка показників') {
        ctx.reply('Функція ще не реалізована.')
    } else if (ctx.message.text === 'Загальна інформація про бота') {
    }  
})


schedule_a_notification("0 18 * * *", bot)
schedule_a_notification("0 8 * * *", bot)
schedule_a_notification("23 18 * * *", bot)


db_connection()
bot.launch()
