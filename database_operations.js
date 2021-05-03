const mongoose = require('mongoose')
const User = require('./models/user')
const {mongodb_connection_link} = require('./private')

async function db_connection() {
    try{
      const url_db = mongodb_connection_link
      await mongoose.connect(url_db, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        useFindAndModify: false,
        useCreateIndex: true
      }) 
    } catch (e) {
        console.log(e)
    }
}

async function save_user_chat_id(id){
    try{
        const already_exists = await User.exists({chat_id: id})
        if(!already_exists){
            const user = new User({
                chat_id: id
            })
            await user.save()
        }
    } catch (e) {
        console.log(e)
    }
}

async function update_weather_subscription_status(id) {
    let message = ''
    const updated_status = await User.findOneAndUpdate(
        { chat_id: id },
        [ {"$set": { "subscribed_to_weather": {"$eq": [false, "$subscribed_to_weather"] } } } ]
        )
    if (updated_status.subscribed_to_weather){
        message = 'Ви відписалися від розсилки про погодні умови.'
    } else {
        message = 'Ви підписалися на розсилку про погодні умови. Очікуйте на сповіщення щодня о 8:00 та о 18:00.'
    }
    return message
} 

async function update_elements_subscription_status(id) {
    let message = ''
    const updated_status = await User.findOneAndUpdate(
        { chat_id: id },
        [ {"$set": { "subscribed_to_elements": {"$eq": [false, "$subscribed_to_elements"] } } } ]
        )
    if (updated_status.subscribed_to_elements){
        message = 'Ви відписалися від розсилки показників якості повітря.'
    } else {
        message = 'Ви підписалися на розсилку показників якості повітря. Очікуйте на сповіщення щодня о 8:00 та о 18:00.'
    }
    return message
}

module.exports.db_connection = db_connection
module.exports.update_weather_subscription_status = update_weather_subscription_status
module.exports.update_elements_subscription_status = update_elements_subscription_status
module.exports.save_user_chat_id = save_user_chat_id
