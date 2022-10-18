const mongoose = require("../config/dbconn");


const seats = mongoose.Schema({
    id : {
        type : String,
    },
    seat_identifier : {
        type : String,
        required : true
    },
    seat_class : {
        type : String,
        required : true
    },
    bookedOrNotFlag : { // is it booked or not
        type : Boolean
    }
})

const seatsModel = mongoose.model("seats",seats);

module.exports = seatsModel;