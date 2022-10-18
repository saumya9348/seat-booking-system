const exp = require("express");
const router = exp.Router();
const seats = require("../models/seats");
const { checkNull,findPersOfSeatsBooked } = require("../include/functions")

router.get("/", async (req,res)=>{ // this endpoint is according to the assignment (all seats)
    const allSeats = await seats.find().sort({seat_class:'asc'});
    res.send(allSeats);
})

router.get("/:seatID", async (req,res)=>{
    let { seatID } = req.params; // need id column of mongo document not objectid
    if(checkNull(seatID)){
        const allSeats = await seats.find({ id:seatID }).sort({seat_class:'asc'});
        let x = await findPersOfSeatsBooked(seatID);
        res.send(x);
    }
})

router.get("/available-seats", async (req,res)=>{ // this endpoint extra for available seats only
    const allSeats = await seats.find({ $or : [ {bookedOrNotFlag  : false }] }).sort({seat_class:'asc'});
    res.send(allSeats);
})

router.put("/update-seats",async (req,res)=>{ //set all seats available as false flag (only for my useability)
    const result = await seats.updateMany({},{bookedOrNotFlag : false});
    res.send(result);
})


module.exports = router ;