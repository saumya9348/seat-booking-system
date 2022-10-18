const express = require("express");
const route = express.Router();
const seatBookingModel = require("../models/seatBooking");
const seatsModel = require("../models/seats");
const {checkNull,findPersOfSeatsBooked} = require("../include/functions");


route.post("/", async (req,res)=>{

    let bodydata = req.body;
    if(checkNull(bodydata)){
        let lastBoking = await seatBookingModel.findOne().sort({bookingID:-1});
        let date = new Date();

        let lastBookID;
        if(!checkNull(lastBoking)){ // this is for unique booking id
            lastBookID = "FLURN-"+date.getFullYear()+"SAM-"+1;
        }else{
            lastBookID = lastBoking['bookingID'].split('-')[2];
            lastBookID = "FLURN-"+date.getFullYear()+"SAM-"+(++lastBookID);
        }
        bodydata.bookingID = lastBookID;
        seatBookingModel.create(bodydata)
        .then( async (insertData) => {
            let updateSeat = await seatsModel.updateOne({id:bodydata.seatID},{$set : {bookedOrNotFlag:true}});
            let seatCls = await seatsModel.findOne({id:bodydata.seatID});
            seatCls = seatCls['seat_class'];
            let seatPrie = await findPersOfSeatsBooked(bodydata.seatID,"price");
            if(updateSeat.modifiedCount==1){ // will chek whether its updated or not
                let smsBody = "Hi "+bodydata.customerName+" ,your booked seat from our site. Your confirmation id is "+lastBookID+" thanks for chossing us. \n Your total cost is "+seatPrie;
                res.send({status:true,msg:{bookingID:lastBookID,totalPrice:seatPrie}});
                sendBookedMessage(smsBody,bodydata.customerPh); // message sent to user
            }else{ 
                res.send({status:false,msg:"Already booked"});
            }
        }).catch(err=>res.send({status:false,msg:err}))
    }else{
        res.send({status:false,msg:"id,name,phone could not be null"});
    }
})


route.get("/:phno",async (req,res)=>{ // end point for get bookings 
    let phno = req.params.phno;
    if(checkNull(phno)){
        let allBookings = await seatBookingModel.find({customerPh:phno}).sort({bookingID:-1});
        if(checkNull(allBookings)){
            res.send({status:true,msg:allBookings});
        }else{
            res.send({status:false,msg:"no bookings"});
        }
    }else{
        res.send({status:false,msg:"Provide phone number , It should not be blank"});
    }
})

function sendBookedMessage(msg,phno){
    const accountSid = 'ACef2c97ddf6d97809ddb29e2e6e1bd8bf'; 
    const authToken = '7a20a3ce282219debf448076c2a1df31'; 
    const client = require('twilio')(accountSid, authToken); 
 
    client.messages 
      .create({     
         body : msg,
         from : "+12284006785",
         to: '+91'+phno
       }) 
      .then(message => console.log(message.sid)) 
      .done();
}


module.exports = route;