const db = require('../db/dbConnection.js');
const util = require('util');
const User  = require('../Classes/User.js');



const authorizeUser = async (req,res,next)=>{
    const {token} = req.headers;

    if(data = await User.authorize(token)){
        await User.updateLastSeen(data.id);
        req.userData = data;
        next();
    }else
        res.status(401).json({
            msg: ' register first'
        });
}




module.exports = authorizeUser