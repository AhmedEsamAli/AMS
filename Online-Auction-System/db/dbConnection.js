const mysql= require('mysql');
const util = require('util');


const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'online-auction-system',
        port: '3306'
    }
);

connection.connect( (err)=>{
    if(err)
        console.log("DB CONNECTION ERR");
    else
        console.log("DB CONNECTED");
});

const select = async (sqlQuery,...queryAttributes)=>{
    return await promisifyQuery()(sqlQuery,queryAttributes);
}

const insert = async (sqlQuery,...queryAttributes)=>{
    await promisifyQuery()(sqlQuery,queryAttributes);
}

const update = async (sqlQuery,...queryAttributes)=>{
    await promisifyQuery()(sqlQuery,queryAttributes);
}

const remove = async (sqlQuery,...queryAttributes)=>{
    await promisifyQuery()(sqlQuery,queryAttributes);
}

    const query = util.promisify(connection.query).bind(connection);

    
// transform query mysql --> promise to use [await/async]
const promisifyQuery = () => {
    const promisifiedQuery = util.promisify(connection.query).bind(connection); 
    return promisifiedQuery;
}


module.exports = {select,insert,update,remove,query};