//-----------------------------------------------------------by ali---------------------------------------------
const db = require('../db/dbConnection.js');
const util = require('util');
const Bidder  = require('../Classes/Bidder.js');
const User  = require('../Classes/User.js');
const BIDDER_ROLE = 2;

const authorizeBidder = async (req,res,next)=>{
    const {token} = req.headers;
    
    
    if(data = await User.authorize(token)){
        if(data.role == BIDDER_ROLE){
            req.userData = data;
            await User.updateLastSeen(data.id);
            next();
            return
        }
        return res.json({
            msg: "U R NOT A BIDDER"
        })
    }else
        res.status(401).json({
            msg: 'regirster first'
        });
}

module.exports = authorizeBidder