const router = require("express").Router();
const public = require('../helper/public.js');
const seller = require('../middleware/sellerModule.js');
const Seller = require ('../Classes/Seller.js')
const User = require("../Classes/User.js");


const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


const SELLER_ROLE = 1;
const PENDING_ACCOUNT = 0;


// LOGIN
router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("please enter a valid email!"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
  async (req, res) => {

    try {

      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF EMAIL EXISTS
      const email = req.body.email;
      const user = await User.getByEmail(email);
      if (!user) {
        res.status(404).json({
          msg:'"',
          errors: [
            {
              msg: " incorrect email or password  !",
            },
          ],
        });
      }
      console.log('email and password found',user,req.body.password)
      // 3- COMPARE HASHED PASSWORD
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if(!checkPassword){
        res.status(404).json({
          msg:'"',
          errors: [
            {
              msg: "incorrect email or password",
            },
          ],
        });
      }

      if(user.accepted = PENDING_ACCOUNT){
        return res.json({
          msg:"pending account"
        })
      }

    } catch (err) {
      console.log(err)
      return res.status(500).json({
        msg: "server error"
      });
    }
  }
);

// REGISTRATION
router.post(
  "/register",
  // body("email").isEmail().withMessage("please enter a valid email!"),
  body("name")
    .isString()
    .withMessage("please enter a valid name")
    .isLength({ min: 10, max: 20 })
    .withMessage("name should be between (10-20) character"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
    body("role")
      .notEmpty()
      .withMessage("role can't be empty"),

  async (req, res) => {
    try {

      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }


      // 2- CHECK IF EMAIL EXISTS
      const email = req.body.email;
      const emailExists = await User.getByEmail(email); 
      if (emailExists != undefined ) {
        return res.status(400).json({
          errors: [
            {
              msg: "email already exists !",
            },
          ],
        });
      }
      


      // 3- PREPARE OBJECT USER TO -> SAVE
      const userData = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        role: req.body.role,
        token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
      };

      

      // 4- INSERT USER OBJECT INTO DB
      User.newUser(userData);
      delete userData.password;

      
      if(userData.role == SELLER_ROLE){
        const user = await Seller.getByToken(userData.token);
        console.log(userData.token)
        console.log(user)
        await Seller.initializeSeller(user.id)
      }


      return res.status(200).json(
        {
          msg: "account created",
          userData,
        }
      );
    } catch (err) {
      console.log(err)
      return res.status(500).json({ err: err });
    }
  }
);


module.exports = router;