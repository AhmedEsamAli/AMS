const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// CONFIGURATION FOR MULTER

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/");
    },
    filename: function(req,file,cb){
        cb(null,crypto.randomBytes(16).toString('hex') + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

module.exports = upload;