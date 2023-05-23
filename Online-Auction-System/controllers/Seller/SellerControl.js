//  const  create =  (req,res,next)=>{
        
//     // DECLARE AUCTION VARIABLE
//     var auction;

//     // Validate request 
//     try{
//         // validate body data
//         const errors = validationResult(req);            
//         if(!errors.isEmpty()){
//             rollBackUpload(req.file.filename);
//             return res.status(400).json({
//                 state: "fail",
//                 errors: errors.array(),
//             });
            
//         }

//         // VALIDATE IMAGE
//         if(!req.file){
//             res.status(400).json({
//                 state:'fail',
//                 errors:
//                         [
//                             {
//                                 "msg": "image is required!",
//                                 "path": "image",
//                                 "location": "file"
//                             }
//                         ]
//             })
//             return ;
//         }
        
//         // VALIDATE START PRICE
//         if(req.body.start_price < minStartPrice){
//             rollBackUpload("./public/" + req.file.filename);
//             res.status(400).json({
//                 state:'fail',
//                 errors:
//                         [
//                             {
//                                 "type": "field",
//                                 "msg": "min price is 50 pounds",
//                                 "path": "start_price",
//                                 "location": "body"
//                             }
//                         ]
//             })
//             return ;
//         }

//         auction = {
//             ...req.body,
//             state: 0,
//             sellPrice: req.body.startPrice,
//             sellerId: req.userData.id,
//             imageURL: req.file.filename,
//         }; 
//         auction = new Auction(new Car(data));

//         // VALIDATE start & end time
//         if(!auction.hasValidTime()){
//             rollBackUpload("./public/" + req.file.filename);
//             return res.status(400).json({
//                 state:'fail',
//                 errors:
//                         [
//                             {
//                                 "type": "field",
//                                 "msg": "invalid time!",
//                                 "path": "time",
//                                 "location": "body"
//                             }
//                         ]
//             });
//         }
//     }catch(err){
//         console.log(err);
//         rollBackUpload("./public/" + req.file.filename);
//         return res.status(500).json({
//             state:'fail',
//             errors:
//                 [
//                     {
//                         msg:"error while initializing auction, try again"
//                     }
//                 ]
//         })
//     }
    
    
//     // Declare new seller object with seller data
//     const seller = new Seller(req.userData);


//     // ========== CHECK SUMBIT LIMIT ==========
//     {

//     // let canSubmit = true;
    
//     // //
//     // if(latelySubmitedAuctions.length >= Max_Allowed_Auctions){
//     //     lastAuctionDate =latelySubmitedAuctions[0].endDate
//     //     firstAuctionDate = latelySubmitedAuctions[Max_Allowed_Auctions - 1].startDate;
//     //     canSubmit = seller.canSubmit(lastAuctionDate,firstAuctionDate)

//     // }
//     }

//     try{
//         if(! await seller.canSubmit()){
//             rollBackUpload("./public/" + req.file.filename);
//             return res.json({
//                 state:'fail',
//                 errors:
//                     [
//                         {
//                             msg: "limit reached!",
//                         }        
//                     ]
//             }); 
//         }
//     }catch(err){
//         return res.status(500).json({
//             state:'fail',
//                 errors:
//                     [
//                         {
//                             msg: "couldn't complete action, try again",
//                             console:"error while checking remaining submits"
//                         }        
//                     ]
//         });
//     }   

    
//     // add auction
//     try{ 
//         await auction.add();
//         await seller.reduceRemainingSubmits();
//         return res.json({
//             state:'success',
//             msg: 'created',
//             auction: auction.getData()
//         });
        

//     }catch(err){
//         console.log(err);
//         rollBackUpload("./public/" + req.file.filename);
//         return res.status(500).json({
//             state:'fail',
//                 errors:
//                     [
//                         {
//                             msg: "couldn't complete action, try again",
//                             console: "error while adding auction to dataBase"
//                         }        
//                     ]
//         });
//     }
// }


// const submits = ()=>{

























// }