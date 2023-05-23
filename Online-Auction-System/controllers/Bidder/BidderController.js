const db = require('../../db/dbConnection')
const User = require('../../Classes/User');
const Auction = require('../../Classes/Auction');
const Bidder = require('../../Classes/Bidder');
const Bid = require('../../Classes/Bid');
const AuctionController = require('../Auction/AuctionController');

  async function makeBid(req, res) {
    const auctionId = req.params.id;
    const bidAmount = req.body.bidAmount;
    const currentBidder = req.userData.id;
  
    try {
      // Validate Request
      validateRequest( auctionId , bidAmount);

      const auction = await Auction.getById(auctionId);
      
      // Validate Exist
      //AuctionController.validateExist(auction);

      if(!validateExist(auction))
        return res.json({
          msg:"auction not found"
        })
      // Validate bid input

      if (!validateBidInput(res,auction, bidAmount)) {
        return res.send(`Invalid bid amount, must be higher than ${auction.sellPrice}`);
      }

  
      // Update the current bid
      Bid.updateSellPrice( currentBidder, bidAmount, auction.id);
  
      res.send(`You have bid ${bidAmount} on auction ${auction.name}`);

      Bid.placeBid(currentBidder , auction.id , bidAmount ) ;

    } catch (error) {
      handleError(error, res);
    }
  }

    async function getWinnerAndPurchase (req, res) {
    const bidId = req.userData.id;
    const currentDate = Date.now();
    const query = `SELECT * FROM auction WHERE bidderId = ${bidId}  && endDate <  ${currentDate} `;
    try {  
        const auctoinsWon =await db.select(query )
      return res.json({
        auctoinsWon
      });
    }catch(err){ 
        console.log(err)
        return res.json({
          msg: 'error, try again'
        })
    }    
   }

   function validateBidInput(res,auction, bidAmount) {
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= auction.sellPrice) {
      return false
    }return true
  }
  function validateRequest( auctionId , bidAmount) {
    if(auctionId == undefined || bidAmount == undefined){
      return res.json({
        msg: " invalid request body"
        
      })
  }
}
  
  function handleError(error, res) {
    console.error(error);
    return res.status(500).send("Error placing bid, try again");  
  }

  module.exports={makeBid,getWinnerAndPurchase,validateBidInput,validateRequest}

  const validateExist = (auction)=> {
    if (!auction || auction.length == 0) {
      return false
    }
    return true
  };