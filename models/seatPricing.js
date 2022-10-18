const mongoose = require("mongoose");

const seatPricing = mongoose.Schema({
        id : {
            type : String
        },
        seat_class : {
            type : String,
            required: true
        },
        min_price : {
            type : String,
            required: true
        },
        normal_price : {
            type : String,
            required: true
        },
        max_price : {
            type : String,
            required: true
        }
})

const seatPricingModel = mongoose.model("seatPricing",seatPricing);

module.exports = seatPricingModel;