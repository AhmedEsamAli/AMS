const db = require('../db/dbConnection.js');
const bcrybt = require('bcrypt');
const fs = require("fs");

const userData = async (user_id)=>{
    return await db.select('select * from users where id = ?',user_id);
}
const metaUser = async (user_id)=>{
    return await db.select('select id,name from users where id = ?',user_id);
}

const hash = (data)=>{
    return bcrybt.hashSync(data,'10');
}

const rollBackUpload = (filePath)=>{
    fs.unlinkSync(filePath)
}
module.exports = {userData,metaUser,rollBackUpload};