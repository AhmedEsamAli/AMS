const db = require('../db/dbConnection.js')


class Auction  {

    auction;
    constructor(auction) {
        this.auction = auction
    }

    async add(){
        try{
            return await this.auction.add();
        }catch(err){
            throw err;
        }
    }

    hasValidTime(){
        try{ 
            return this.auction.validateTime(); 
        }catch(err){
            throw err;
        }
    };
    // abstract get();
    // abstract getById(id : number);

    static async getSubmitedAucitons(sellerId){
        const sqlQuery = 'SELECT * FROM auction where sellerId =? order by startDate DESC'
        try{
            const auctions = await db.select(sqlQuery,sellerId)
            return auctions;
        }catch(err){
            throw err;
        }
        
    }
    
    static async getById(auctionId){
        const sqlQuery = 'SELECT * FROM auction where id = ?'

        try{

            const auction = (await db.select(sqlQuery,auctionId))[0];
           
            return auction;

        }catch(err){
            
            throw err;
        }
        
    }

    // return bids on specific auction



    static async SellerId(auctionId){
        const sqlQuery = 'SELECT sellerId FROM  auction where id = ?'
        try{
            const auction = (await db.select(sqlQuery,auctionId))[0];
            if(auction != undefined)
                return auction.sellerId;
            else
                return false;
        }catch(err){
            throw err;
        }
        
    }


    static async wipe(auctionId){
        const query = 'DELETE FROM auction WHERE id = ?'
        try{
            await db.remove(query,auctionId);
        }catch(err){
            throw err;
        }
    }

    
    getData(){
        this.auction.getData();
    }

    // ****************************************** old methods ******************************************

    // static async getBidsOnAuction(auctionId){
    //     const sqlQuery = 'SELECT users.name, biddings.amount as auctoinName FROM users JOIN auction on users.id = auction.sellerId JOIN biddings ON auction.id = biddings.auctionId where biddings.auctionId = ?';
    //     try{
            
    //         const auction = await db.select(sqlQuery,auctionId);
    //         return auction;

    //     }catch(err){
            
    //         throw err;
    //     }
        
    // }
    
}

module.exports = Auction



