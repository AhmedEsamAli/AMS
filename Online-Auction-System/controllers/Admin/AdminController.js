const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {promisify} = require('util'); 
const express = require('express');
const crypto = require ('crypto')

const cookieParser = require('cookie-parser');
const app = express();
const moment = require('moment');
const { json } = require('body-parser');
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
// Parsing JSON bodies (as sent by API clients)
app.use(express.json());
const db = require('../../db/dbConnection');


// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST, 
//     user: process.env.DATABASE_USER, 
//     password: process.env.DATABASE_PASSWORD, 
//     database: process.env.DATABASE
// });



exports.getWaitingAccounts = (req, res)=>{
    db.query('SELECT * FROM users where accepted = 0', (error, results)=>{
        if(error){
            console.log(error);
            return res.json({
                msg: "error, try again"
            })
        }else{
            return res.json(results);
        }
   
    })
   
}


exports.acceptAccounts = (req, res)=>{
    // getAccounts=exports.getWaitingAccounts();
    console.log('accepet')
    const { email, name, mobile, password, role} = req.body;
    if(true ){
 
     db.query(`update users SET accepted = ${1} where email = '${email}' `, (error, result)=>{
         if(error){
             console.log(error);
             return res.json({
                msg: "data base error,try again"
             });
         }
         else{
              
                return res.json({
                    msg: "accepted"
                });

         }
     });
     //-------//---
    }else{
        res.json({
            message:"Please fill fieldes correctly"
        })
    }
 }
 

 exports.deleteAccount = (req, res)=>{ 
    try{
    const { email} = req.body;
     db.query('DELETE FROM users WHERE email = ? ', [email], (error, result)=>{
         if(error){
             console.log(error);
         }
         else{
             res.json({message:'Accout Rejected'});
         }
     }); 
    } catch(error){
        res.json("Something went wrong ");
    }
 }

 exports.showTransactions  =  (req, res)=>{
 
 
  db.query('SELECT * from auction where state = 1', (error, results)=>{
    if(error){
        console.log(error);
        return res.json({
            msg: "query error, try again"
        });
    }
    return res.json({
        msg: results
    });
  });
    
 }