const db = require('../db/dbConnection.js');
const util = require('util');
const Seller  = require('../Classes/Seller.js');
const User  = require('../Classes/User.js');
const SELLER_ROLE = 1;
const authorizeSeller = async (req,res,next)=>{

    const {token} = req.headers;

    // authorize seller
    if(data = await User.authorize(token)){
        if(data.role = SELLER_ROLE){
            req.userData = data;
            await User.updateLastSeen(data.id);
            next();
            return
        }else
            return res.json({
                msg: "U R NOT A SELLER"
            })
    }
        res.status(401).json({
            msg: 'regirster first'
        });

}

module.exports = authorizeSeller