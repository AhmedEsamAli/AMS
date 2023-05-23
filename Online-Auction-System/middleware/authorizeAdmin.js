const db = require('../db/dbConnection.js');
const util = require('util');
const Bidder  = require('../Classes/Bidder.js');
const User  = require('../Classes/User.js');


const authorizeAdmin = async (req,res,next)=>{
    const {token} = req.headers;
    
    if(data = await User.authorize(token)){
        if(data.role == 0)
        {        console.log("authorizeAdmin");

            req.userData = data;
            await User.updateLastSeen(data.id);
            next();
        }else
            return res.status(401).json({
                msg: 'U R NOT An admin'
            })
    }else
        return res.status(401).json({
            msg: 'u must login first'
        });
}

module.exports = authorizeAdmin