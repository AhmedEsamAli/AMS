const express = require('express');
const adminController = require('../controllers/Admin/AdminController')
const router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser());

const authorizeAdmin = require('../middleware/authorizeAdmin');


router.post('/acceptAccounts',authorizeAdmin ,adminController.acceptAccounts); 
router.post('/deleteAccounts', authorizeAdmin ,adminController.deleteAccount); 
router.get('/waitingAccounts',authorizeAdmin, adminController.getWaitingAccounts);
router.delete('/rejectAccounts',authorizeAdmin, adminController.deleteAccount);

router.get('/showTransactions',authorizeAdmin, adminController.showTransactions);
module.exports = router;