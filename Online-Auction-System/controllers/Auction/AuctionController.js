const db = require('../../db/dbConnection')
const User = require('../../Classes/User');
const Auction = require('../../Classes/Auction');
const Bidder = require('../../Classes/Bidder');
const BidderController = require('../Bidder/BidderController');

       
    async function nameSearch(req, res) {
    const searchTerm = req.body.name;
    const currentDate = Date.now();
    const query = `
      SELECT * FROM auction
      WHERE (name LIKE '%${searchTerm}%' OR cat LIKE '%${searchTerm}%')
        AND endDate > ${currentDate}
      ORDER BY startDate`;
    try {
      console.log(query);
      const search = await db.select(query);
      return res.json({ search });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error searching auctions, try again" });
    }
  }
  
    async function getAll(req, res) {
    const currentDate = Date.now();
    const query = `
      SELECT * FROM auction
      WHERE endDate > ${currentDate}
      ORDER BY startDate`;
    try {
      console.log(query);
      const search = await db.select(query);
      return res.json({ search });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error searching auctions, try again" });
    }
  }
  
     async function categorySearch(req, res) {
    const searchTerm = req.body.cat;
    const currentDate = Date.now();
    const query = `
      SELECT * FROM auction
      WHERE cat LIKE '%${searchTerm}%'
        AND endDate > ${currentDate}`;
    try {
      console.log(query);
      const search = await db.select(query);
      return res.json({ search });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error searching auctions, try again" });
    }
  }

   const validateExist = (auction)=> {
    if (!auction || auction.length == 0) {
      throw new Error("Auction not found");
    }
  };

module.exports={validateExist,categorySearch,getAll,nameSearch}