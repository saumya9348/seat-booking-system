const express = require("express");
const app = express();
const cors = require("cors");

//include file
const bookingRouts = require("./routes/booking");
const seatsRouts = require("./routes/seats");
const seatsPriceing = require("./models/seatPricing");
const seats = require("./models/seats");


//cors and req body data solve
app.use(cors());
app.use(express.json());

//routes
app.use("/bookings",bookingRouts);
app.use("/seats",seatsRouts);


app.post("/uploadToSeats/:csvtype", (req,res)=>{ // csv type indiactes its whether seats or seatspricing only
    let csvtype = req.params.csvtype;
    let fs = require('fs'); 
    let Papa = require("papaparse");
    Papa.parse(fs.createReadStream("Seats.csv"), {
        complete: async function(results) {

            results['data'].map((data,ind)=>{
                if(ind>=1){
                    if(csvtype==='seats'){
                         seats.create({id:results['data'][ind][0],seat_identifier:results['data'][ind][1],seat_class:results['data'][ind][2],bookedOrNotFlag:false})
                         .then(()=>{})
                         .catch(err=>console.log(err));
                        res.send({msg:"sucessfully uploaded"});
                    }else if(csvtype==='seatspricing'){
                        seatsPriceing.create({id:results['data'][ind][0],seat_class:results['data'][ind][1],min_price:results['data'][ind][2],normal_price:results['data'][ind][3],max_price:results['data'][ind][4]})
                        .then(()=>{})
                        .catch(err=>console.log(err));
                        res.send({msg:"sucessfully uploaded"});
                    }
                }
            })
        }
    });
})

app.listen(8000,()=>console.log("Running express"));