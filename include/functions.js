const seats = require("../models/seats");
const seatsPriceing = require("../models/seatPricing");
/**
 * @param {*} value 
 * @returns boolean
 */
 function checkNull (value){
    return ( value == null || value == '' || value == undefined ) ? false : true;
}

async function findPersOfSeatsBooked(seatID,type='obj'){ // type is for multiple return ex sometime hole object and some time only amount of seat
    let singleSeat = await seats.findOne({ id:seatID });
    let seatCls = singleSeat['seat_class'];
    let seatLeft = await seats.find({ seat_class:seatCls , bookedOrNotFlag:false }).count();
    let totalSeat = await seats.find({ seat_class:seatCls }).count();
    let seatPers = (seatLeft/totalSeat)*100;
    let seats_price = await seatsPriceing.findOne({seat_class:seatCls});
    singleSeat = JSON.parse(JSON.stringify(singleSeat));
    if( seatPers > 60 ){ 
        let seat_price = (seats_price['max_price']!=null || seats_price['max_price'] != undefined) ? seats_price['max_price'] : seats_price['normal_price'];
        if(type==='obj'){
            singleSeat.seat_price =  seat_price;
        }else{
            return seat_price;
        }
    }else if(seatPers >= 40  &&  seatPers <= 60 ){
        let seat_price = seats_price['normal_price'];
        if(type==='obj'){
            singleSeat.seat_price =  seat_price;
        }else{
            return seat_price;
        }
    }else if(seatPers < 40 ){  
        let seat_price = (seats_price['min_price']!=null || seats_price['min_price'] != undefined) ? seats_price['min_price'] : seats_price['normal_price'];
        if(type==='obj'){
            singleSeat.seat_price =  seat_price;
        }else{
            return seat_price;
        }
    }
    return singleSeat;
}

module.exports = {checkNull,findPersOfSeatsBooked}