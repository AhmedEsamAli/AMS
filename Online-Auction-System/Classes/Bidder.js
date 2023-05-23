const db = require('../db/dbConnection.js')
const User = require('./User');
const Auction = require('./Auction');

const bidderRole = 2;

  class Bidder {
    data;
    constructor(data){
        this.data = data
    }

    static async  authorize (token){
        const sqlQuery = "select id,name,email,phone,active,role,token from users where token = ? && role = ?";
        
        return  (await db.select(sqlQuery,token,bidderRole))[0] || null ;
    }

    static async nameSearch (req, res){
        const searchTerm = req.body.name;
        const currentDate = Date.now();
        const query = `SELECT * FROM auction WHERE (name LIKE '%${searchTerm}%'|| cat LIKE  '%${searchTerm}%') && endDate > ${currentDate} order by startDate  `;
        try {
          console.log(query)
          const search = (await db.select(query ));
          return res.json({
            search
          });

        }
        catch(err){ 
          console.log(err)
          return res.json({
            msg: 'error, try again'
          })
         }    
       }

    static async getAll (req,res) {
        const currentDate = Date.now();
        const query = `SELECT * FROM auction WHERE  endDate > ${currentDate} order by startDate `;
        try {
            await db.select(query)
            console.log(query)
            const search = (await db.select(query ));
            res.json({
              search
            });
        }
        catch(err){ 
            console.log(err)
            return res.json({
              msg: 'error, try again'
            })
        }
      }


    static async  categorySearch (req, res) {
   
        const searchTerm = req.body.cat;
        const currentDate = Date.now();
        const query = `SELECT * FROM auction WHERE cat LIKE '%${searchTerm}%' && endDate > ${currentDate} `;
        try {
          await db.select(query)
          console.log(query)
          const search = (await db.select(query));

          return res.json({
            search
          });

        }catch(err){ 
            console.log(err)
            return res.json({
              msg: 'error, try again'
            })
        }
      }

     static async placeBid (req, res) {
        const auctionId = req.params.id;
        const bidAmount = req.body.bidAmount;
        const currentBidder = req.userData.id
        try {
          // check request body
          console.log(auctionId)
          if(auctionId == undefined || bidAmount == undefined){
            return res.json({
              msg: " inavalid request body"
              
            })
          }
            // Find the auction with the given ID
          const auction = await Auction.getById(auctionId);
          
          if(auction == undefined  || auction.length == 0){
            return res.json({
              msg: "didn't find auction"
              
            })
          }
          // Check if the bid amount is higher than the current highest bid
          if (bidAmount <= auction.sellPrice) {
            return res.status(400).send(` Bid amount must be higher than ${auction.sellPrice} `);
          }
      
            

          // Update the current bidid
          const query = `UPDATE auction set bidderId = ? , sellPrice = ? where id = ? `
          try {await db.update(query,currentBidder , bidAmount , auction.id )}
            catch(err){ console.log(err) }
            
      
          res.send(`You have bid ${bidAmount} on auction ${auction.name} `);
      
        } catch (error) {
          console.error(error);
          res.status(500).send('Error placing bid, try again');
        }
      }  
      

     static async getWinnerAndPurchase (req, res) {
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
          
      };
    



module.exports = Bidder;
