const mysql = require('mysql');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
const db = require('../db/dbConnection');



// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST, 
//     user: process.env.DATABASE_USER, 
//     password: process.env.DATABASE_PASSWORD, 
//     database: process.env.DATABASE
// });



const adminAuthorized  = (req,res,next) =>{
    if (req.cookies.adminId) {
        next();
    } else{
        res.json({
            message:' you are not authorized'
        });
    }

}
module.exports = adminAuthorized;