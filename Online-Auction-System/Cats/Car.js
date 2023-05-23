const db = require('../db/dbConnection.js');
const {millisInDays,afterDays} = require("../helper/time.js");
const maxDurationInMillis = 172_800_000;



class Car {
    auction;
    constructor(data){
        this.auction = data;
    }
    async add() {
        try{
            await db.insert("insert into auction set?",this.auction);
        }catch(err){
            throw err; 
        }
    }

    validateTime(){    
        const currentDate = new Date();
        const startDate = new Date(this.auction.startDate);
        const endDate = new Date(this.auction.endDate);
        const dateAfterMonth = afterDays(30);

        const durationInMillis = new Date(endDate) - new Date(startDate);
        return (currentDate < startDate) && (startDate < endDate ) && (durationInMillis <= maxDurationInMillis) && (dateAfterMonth >= startDate)
        
    }

    getData(){
        return this.auction;
    }
}



module.exports =  Car
