const mongoose = require("../config/dbconn");
const seatBooking = mongoose.Schema({
    bookingID:{
        type:String,
        required:true
    },
    customerPh:{
        type:String,
        required:true,
        ref:"customers"
    },
    customerName:{
        type:String,
        required:true,
        ref:"customers"
    },
    seatID:{
        type:String,
        required:true,
        ref:"seats"
    }
},{timestamps:true})

const seatBookingModel = mongoose.model("seat-bookings",seatBooking);

module.exports = seatBookingModel;