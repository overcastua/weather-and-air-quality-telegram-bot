const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    chat_id: {
        type: Number,
        required: true
    },
    subscribed_to_elements: {
        type: Boolean,
        default: false
    },
    subscribed_to_weather: {
        type: Boolean,
        default: false
    },

})

module.exports = model('User', userSchema)