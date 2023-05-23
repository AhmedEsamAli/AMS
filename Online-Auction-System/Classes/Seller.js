const db = require('../db/dbConnection.js')
const User = require('./User');
const moment = require('moment');
const maxAllowedAuctions = 5;
const {millisIn} = require('../helper/time');
const sellerRole = 1;

class Seller {

    data;
    constructor(data){
        this.data = data
    }

    static async  authorize (token){
        const sqlQuery = "select id,name,email,phone,active,role,token from users where token = ? && role = ?";
        
        return  (await db.select(sqlQuery,token,sellerRole))[0] || null ;
    } 

    static async getByToken(token){
        const query = "select * from users where token = ?"
        try{
            const seller = (await db.select(query,token))[0]
            
            return seller
        }catch(err){

        }
    }

    static async initializeSeller(sellerId){
        const query = "INSERT INTO seller_remianing_submits (sellerId, remainingSubmits ) VALUES (?,?)"
        try{
            const seller = await db.select(query,sellerId,maxAllowedAuctions)
        }catch(err){

        }
    }

    async canSubmit(){
                        // prepare query

        try{
            const remainingSubmits = await this.remainingSubmits(); 
            return remainingSubmits != undefined && remainingSubmits > 0;

        }catch(err){
            console.log(err)
            throw err;
        }
    }

    async remainingSubmits(){
        const query = "select remainingSubmits from seller_remianing_submits where  sellerId= ?";

        try{
            const remainingSubmits = (await db.select(query,data.id))[0]
            if(remainingSubmits != undefined)
                return remainingSubmits.remainingSubmits
            return undefined

        }catch(err){

            throw err;
        }
    }



    async reduceRemainingSubmits(){
        const query = "UPDATE seller_remianing_submits SET remainingSubmits = remainingSubmits - 1  WHERE sellerId = ?";
        try{
            await db.update(query,data.id)
        }catch(err){
            throw err;
        }
    }



    // +++++++++++++++++++++++++ OLD METHODS +++++++++++++++++++++++++++ //


    // canSubmit (endDate,startDate){
    //     const timeInMillis = new Date(endDate) - new Date(startDate);
    //     const timePastInMillis = new Date() - new Date(startDate);
        
    //     return timeInMillis >= millisIn(30) && timePastInMillis > millisIn(30);
    // }



    // ***********************
    // #timeInDays(end_date,start_date){
    //     const time_in_millis = end_date - start_date;
    //     const time_in_days = moment(time_in_millis).format('D').valueOf();
    //     return time_in_days;

    // }
    

    // *********************** returns last maxAllowed Auctions in month for specific seller  
    // async latelySubmitedAuctions(){
    //     const sqlQuery ='SELECT startDate,endDate FROM auction where sellerId =? order by startDate DESC LIMIT ' + maxAllowedAuctions
        
    //     const latelySubmitedAuctions = await db.select(sqlQuery,[this.data.id]) ;
    //     return  latelySubmitedAuctions;
    // }
    
    
    // ***********************
    // isSeller(){
    //     return this.data.role == sellerRole;
    // }

    
}


module.exports = Seller;
