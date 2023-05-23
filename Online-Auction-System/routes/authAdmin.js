const express = require('express');
const adminAuthController = require('../controllers/auth/admin');
const router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser());

router.post('/login', adminAuthController.adminLogin);
router.get("/logout", adminAuthController.adminLogout);
module.exports = router;