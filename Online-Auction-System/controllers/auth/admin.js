const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {promisify} = require('util'); 

var express = require('express')
var bodyParser = require('body-parser')
const bcryptjs = require('bcryptjs')
var app = express()
const db = require('../../db/dbConnection');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST, 
//     user: process.env.DATABASE_USER, 
//     password: process.env.DATABASE_PASSWORD, 
//     database: process.env.DATABASE
// });



exports.adminLogin = async (req, res)=>{
    if(req.cookies.sellerId || req.cookies.bidderId){ return res.json({message:'Please log out as Bidder or Seller'});};
    if (req.cookies.adminId){return res.json({
        message:'you already logged in'
    });}else{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send( {
                message: "Please provide an Email and Password"
            })
        }  

        db.query("SELECT * FROM users WHERE email = ?", [email], async(error, results)=>{
            if(error){
                console.log(error);
                res.status(422).send( {
                    message: "Something went wrong. Please try Again"
                })
            }
            else if(results.length==0){
                res.status(401).send( {
                    message: "An Admin with this Email does not exist. Please Register yourself."
                })
            }
            else if(!results || !(password==results[0].password) ){
                res.status(401).send( {
                    message: "Email or Password is incorrect"
                })
            }
            else{
                const id = results[0].id;
               res.cookie('adminId', id, { maxAge: 3600000, httpOnly: true });
                db.query("UPDATE users SET active = ?  WHERE id = ?",
                [1, results[0].id], (err, resp)=>{
                    if(err){
                        console.log(err);}
                    });
                res.status(200).send({
                    message:'Logged in'
                });

            }
        })
    }catch(error){
        console.log(error);
    }
}
}

exports.adminLogout = async (req, res)=>{
    if (!req.cookies.adminId){return res.json({
        message:'you are not logged in'
    });}else{
    const adminId = req.cookies.adminId;
    db.query("SELECT * FROM admin WHERE id = ?", [adminId], async(error, results)=>{
        db.query("UPDATE users SET active = ?  WHERE id = ?",
        [0,adminId], (err, resp)=>{
            if(err){
                console.log(err);}
            });
    });

    res.clearCookie('adminId');
    res.json({
        message:'logged out'
    });
}
} 