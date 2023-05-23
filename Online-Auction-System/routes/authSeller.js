const authSeller = require("../controllers/auth/seller");
const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser());


router.post('/login',authSeller.sellerLogin);

router.get('/logout',authSeller.sellerLogout);

module.exports = router