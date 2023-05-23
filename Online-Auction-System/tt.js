// const db = require('./db/dbConnection.js');

// const authorize= async (token)=>{
//     const sql_query = "select * from users where token = ?";
//     console.log((await db.select(sql_query,['2']))[0]) 
// }

// authorize();


// const Seller = require('./Classes/Seller.js');

// const {} = require('./Cats/Car.js');

// const a = new Auction({msg: 'msg'});
// a.add();


const testUndefined = ()=>{
    return undefined;
}

if(!testUndefined()){
    console.log('hello')
}
