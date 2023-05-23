const router = require("express").Router();
const {validationResult,body} = require('express-validator');
const authorizeUser = require('../middleware/authorizeUser.js');
const authorizeSeller = require('../middleware/authorizeSeller.js');
const Seller = require('../Classes/Seller.js');
const Auction = require('../Classes/Auction.js');
const Car = require('../Cats/Car.js');
const upload = require("../middleware/upload.js"); 
const {rollBackUpload}= require("../helper/public.js");
const Bid = require("../Classes/Bid.js");

const Max_Allowed_Auctions = 5;
const minStartPrice = 1;


//               ================     CREATE NEW AUCTION     ================

router.post('',
    authorizeSeller,
    upload.single("image"),
    body('name')
        .isString()
        .isLength(min = 3 ,max = 15 )
        .withMessage('name should be 3-15 length'),
    body('startDate')
        .notEmpty()
        .withMessage('Invalid start date'),
    body('endDate')
        .notEmpty()
        .withMessage('Invalid end date'),
    body('startPrice')
        .notEmpty()
        .withMessage("price can't be empty")
        .isDecimal()
        .withMessage('min price is 1 pound'),
    async (req,res,next)=>{
        
        // DECLARE AUCTION VARIABLE
        var auction;

        // Validate request 
        try{
            // validate body data
            const errors = validationResult(req);            
            if(!errors.isEmpty()){
                rollBackUpload(req.file.filename);
                return res.status(400).json({
                    state: "fail",
                    errors: errors.array(),
                });
                
            }

            // VALIDATE IMAGE
            if(!req.file){
                res.status(400).json({
                    state:'fail',
                    errors:
                            [
                                {
                                    "msg": "image is required!",
                                    "path": "image",
                                    "location": "file"
                                }
                            ]
                })
                return ;
            }
            
            // VALIDATE START PRICE
            if(req.body.start_price < minStartPrice){
                rollBackUpload("./public/" + req.file.filename);
                res.status(400).json({
                    state:'fail',
                    errors:
                            [
                                {
                                    "type": "field",
                                    "msg": "min price is 50 pounds",
                                    "path": "start_price",
                                    "location": "body"
                                }
                            ]
                })
                return ;
            }

            auction = {
                ...req.body,
                state: 0,
                sellPrice: req.body.startPrice,
                sellerId: req.userData.id,
                imageURL: req.file.filename,
            }; 
            auction = new Auction(new Car(auction));

            // VALIDATE start & end time
            if(!auction.hasValidTime()){
                rollBackUpload("./public/" + req.file.filename);
                return res.status(400).json({
                    state:'fail',
                    errors:
                            [
                                {
                                    "type": "field",
                                    "msg": "invalid time!",
                                    "path": "time",
                                    "location": "body"
                                }
                            ]
                });
            }
        }catch(err){
            console.log(err);
            rollBackUpload("./public/" + req.file.filename);
            return res.status(500).json({
                state:'fail',
                errors:
                    [
                        {
                            msg:"error while initializing auction, try again"
                        }
                    ]
            })
        }
        
        
        // Declare new seller object with seller data
        const seller = new Seller(req.userData);


        // ========== CHECK SUMBIT LIMIT ==========
        {

        // let canSubmit = true;
        
        // //
        // if(latelySubmitedAuctions.length >= Max_Allowed_Auctions){
        //     lastAuctionDate =latelySubmitedAuctions[0].endDate
        //     firstAuctionDate = latelySubmitedAuctions[Max_Allowed_Auctions - 1].startDate;
        //     canSubmit = seller.canSubmit(lastAuctionDate,firstAuctionDate)

        // }
        }

        try{
            if(! await seller.canSubmit()){
                rollBackUpload("./public/" + req.file.filename);
                return res.json({
                    state:'fail',
                    errors:
                        [
                            {
                                msg: "limit reached!",
                            }        
                        ]
                }); 
            }
        }catch(err){
            return res.status(500).json({
                state:'fail',
                    errors:
                        [
                            {
                                msg: "couldn't complete action, try again",
                                console:"error while checking remaining submits"
                            }        
                        ]
            });
        }   
    
        
        // add auction
        try{ 
            await auction.add();
            await seller.reduceRemainingSubmits();
            return res.json({
                state:'success',
                msg: 'created',
                auction: auction.getData()
            });
            

        }catch(err){
            console.log(err);
            rollBackUpload("./public/" + req.file.filename);
            return res.status(500).json({
                state:'fail',
                    errors:
                        [
                            {
                                msg: "couldn't complete action, try again",
                                console: "error while adding auction to dataBase"
                            }        
                        ]
            });
        }
    }
);



//               ================     GET LIST OF SELLER AUCTIONS     ================

router.get('/submits',
    authorizeSeller,
    async (req,res,next)=>{
        
    // get list of seller auctions

    try{
        const sellerId = req.userData.id;
        const auctions = await Auction.getSubmitedAucitons(sellerId);
        return res.json({
            msg: 'returned list of ur auctions',
            state:'success',
            data: auctions
        });
    }catch(err){
        return res.status(500).json({
            state:'fail',
            errors:
                [
                    {
                        msg: "couldn't complete action, try again",
                    }        
                ]
        });
    }
    

    
});




//               ================    ACTIVITY HISTORY ON SPACIFIC AUCTION    ================

router.get('/history/:id',
    authorizeSeller,
    async(req,res)=>{
        try{
            const sellerId = req.userData.id;
            const auctionId = req.params.id;


            // authorize seller to be creator of this auctoin
            if(sellerId != await Auction.SellerId(auctionId) ){
                console.log(sellerId,auctionId)
                return res.status(400).json({
                    state:'fail',
                    errors:
                        [
                            {
                                msg: "U R NOT AUTHORIZED TO ACCESS THIS DATA",
                            }        
                        ]
                });
            }
            
            const bids = await Bid.getBidsOnAuction(sellerId,auctionId);
            return res.json({
                msg: 'bids on auction',
                state:'success',
                data: bids
            });

        }catch(err){
            console.log(err);
            return res.status(500).json({
                state:'fail',
                    errors:
                        [
                            {
                                msg: "couldn't complete action, try again",
                            }        
                        ]
            });
    
        }
    }
);



//               ================    GET SPECIFIC AUCTION     ================

router.get('/:id',
    authorizeSeller,
    async (req,res,next)=>{
        
        try{
            const auctionId = req.params.id;
            const auction = await Auction.getById(auctionId);
            return res.json({
                msg: 'auction returned',
                state:'success',
                auction
            })
            
        }catch(err){
            res.json({
                state: "fail",
                errors: [
                    {
                        msg: "couldn't complete auction, try again",
                    }
                ]
            })
        }
});




router.delete('/:id',
    authorizeSeller,
    async(req,res)=>{
        try{
            const sellerId = req.userData.id;
            const auctionId = req.params.id;


            // authorize seller to be creator of this auctoin
            if(sellerId != await Auction.SellerId(auctionId) ){

                return res.status(400).json({
                    state:'fail',
                    errors:
                        [
                            {
                                msg: "THIS DATA DOES NOT EXIST OR U R NOT AUTHORIZED TO ACCESS THIS DATA",
                            }        
                        ]
                });
            }
            
                Auction.wipe(auctionId);
            return res.json({
                msg: 'auction deleted successfuly',
                state:'success',
            });

        }catch(err){
            console.log(err);
            return res.status(500).json({
                state:'fail',
                    errors:
                        [
                            {
                                msg: "couldn't complete action, try again",
                            }        
                        ]
            });
    
        }
    }
);




//               ================    EXPORT ROUTER    ================

module.exports = router;