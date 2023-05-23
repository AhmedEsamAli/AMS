//================ REQUIRE NODE MODULES ================
const express = require("express");
const cors = require('cors');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const  jsonwebtoken = require('jsonwebtoken')

//================ REQUIRE IMPLEMENTED MIDDLEWARE ================
const admin = require('./middleware/authorizeAdmin.js');
const authorize = require('./middleware/authorizeUser.js');

//================ REQUIRE ROUTES ================
const auth = require("./routes/Auth.js");
const auction = require('./routes/Auction.js');
const bidder = require('./routes/Bidder.js')
//================ INITIALIZE APP ================
const app = express();

//================ GLOBAL MIDDLEWARE ================ 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(cors());
app.use(cookieParser());


//================ RUN APP ================

app.listen(4000,'localhost',()=>{
    console.log('SERVER IS RUNNING');
})


//================ API ROUTES ================

// app.use('/auth',auth);
app.use('/auctions',auction);
app.use('/bid',bidder )
// app.use('/createauction',auth);
// app.use('/:id',auth);
// app.use('/sell-item',auth);
// app.use('/admin', require('./routes/Admin'))
// app.use('/auth/admin', require('./routes/authAdmin'))
// app.use('/auth/seller', require('./routes/authSeller.js'))
app.use('/auth',auth)