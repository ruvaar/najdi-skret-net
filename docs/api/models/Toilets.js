const mongoose = require('mongoose')

const ToiletSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    lat: {
        type: Number,
        default: 0,
    },
    lon: {
        type: Number,
        default: 0,
    },
    tags: {
        type: Object,
        default: {},
    },
});

const ToiletModel = mongoose.model("toilets", ToiletSchema)
module.exports = ToiletModel;