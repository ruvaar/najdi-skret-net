const mongoose = require('mongoose')

const ToiletSchema = new mongoose.Schema({
    toilet_id: {
        type: String,
        required: true,
    },
    avgRating: {
        type: Number,
        default: 0,
    },
});

const ToiletModel = mongoose.model("toilets", ToiletSchema)
module.exports = ToiletModel;