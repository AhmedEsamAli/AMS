const db = require('../db/dbConnection.js')
const User = require('./User');
const moment = require('moment');
const maxAllowedAuctions = 5;
const {millisIn} = require('../helper/time');
const adminRole = 0;

class admin {

    data;
    constructor(data){
        this.data = data
    }

    static async  authorize (token){
        const sqlQuery = "select id,name,email,phone,active,role,token from users where token = ? && role = ?";
        
        return  (await db.select(sqlQuery,token,adminRole))[0] || null ;
    } 
}