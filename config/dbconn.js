const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/seatbooking")
.then(()=>{
    console.log("Db connected sucessfully");
})
.catch((err)=>{
    console.log("err found while connect to db");
})

module.exports = mongoose;