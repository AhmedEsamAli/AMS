const db = require('../db/dbConnection.js');
const util = require('util');
const crybto = require('crypto');
const {body,validationResult} = require('express-validator');
const { log } = require('console');
const { throws } = require('assert');
const seller_role = 1;

const isSeller= (user_role) => {
    if(user_role == seller_role)
        return true;
    return false;
}


const addAuction = async (auction)=>{
    try{
        await db.insert("insert into auction set?",auction);
    }catch(err){
        throw err; 
    }
};

const checkTime= (start_time,end_time)=>{
    current_time = new Date() ;
    start_time = new Date(start_time);
    end_time = new Date(end_time);

    if(current_time < start_time && start_time < end_time)
        return true;
    return false;
}

const auctionsList = async (seller_id)=>{
    return await db.select('select * from auction where seller_id = ?',[seller_id]);
}
const myAuction = async (auction_id)=>{
    return await db.select('select * from auction where id = ? ',[auction_id]);
}

//++++++++++ == +++++++++++
const createAuction = (req,res)=>{
    try{
        req.body.auction= {
            name: req.body.name,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        }
        res.json(req.body)
    }catch(err){
        console.log(err)
        res.json({msg: "COULDN'T CREATE AUCTION OBJECT"});
    }
}
const insertAuction = async (req,res,next)=>{
    try{
        await inserIntoDB("insert into auction set?",req.body.auction);
        res.json({msg: 'auction saved'})
    }catch(err){
        console.log(err);
        res.json({msg:"COULDN'T SAVE AUCTION"});
    }
}

const sellItem = async (req,res,next)=>{
    try{
        await makeDataBaseQuery("update auction set bidder_id = 3 where id = ?",req.body.id);
        res.json({msg: 'item selled'})
    }catch(err){
        console.log(err);
        res.json({msg:"COULDN'T SELL ITEM"});
    }
}



const startAuction=()=>{};

//======================= =======================





//======================= =======================
module.exports = {isSeller,addAuction,checkTime,auctionsList,myAuction,sellItem,insertAuction,createAuction};