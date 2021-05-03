const {Schema, model} = require('mongoose')

const elementsSchema = new Schema({
    date: {
        type: String,
        default: new Date().toISOString().split("T")[0]
    },
    month: {
        type: Number,
        default: new Date().toISOString().split("T")[0].split("-")[1]
    },
    o3: Number,
    co: Number,
    so2: Number,
    no2: Number,
    pm2p5: Number,
    pm10: Number
})

module.exports = model('Elements', elementsSchema)