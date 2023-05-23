const db = require('../db/dbConnection.js')
const User = require('./User');
const Auction = require('./Auction');

const bidderRole = 2;

  class Bid {
    data;
    constructor(data){
        this.data = data
    }
    // return bids on specific auction
    static async getBidsOnAuction(auctionId){
        const sqlQuery = 'SELECT users.name, biddings.amount as auctoinName FROM users JOIN auction on users.id = auction.sellerId JOIN biddings ON auction.id = biddings.auctionId where biddings.auctionId = ?';
        try{
            
            const auction = await db.select(sqlQuery,auctionId);
            return auction;

        }catch(err){
            
            throw err;
        }
        
    }


    static async placeBid(userId,auctionId,amount){
        const sqlQuery = "INSERT INTO biddings (id,bidderId , auctionId , amount ) VALUES ('', ?, ?, ? ) "
        try{   
            const bids = await db.insert(sqlQuery,userId,auctionId,amount);
            return bids;
           
        }catch(err){
           throw err;
        }
    }

    static async updateSellPrice( currentBidder, bidAmount, auctionID){
        try{   
            const query = `UPDATE auction SET bidderId = ?, sellPrice = ? WHERE id = ?`;
            await db.update(query, currentBidder, bidAmount, auctionID);
           
        }catch(err){
           throw err;
        }
    }

    
  }


module.exports = Bid;
