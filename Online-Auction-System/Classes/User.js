const db = require('../db/dbConnection.js')

class User {
    
    data;

    constructor(data){
        this.data = data;
    }

    static async  authorize (token){
        const sqlQuery = "select id,name,email,phone,active,role,token from users where token = ?";
        try{
            return  (await db.select(sqlQuery,token))[0] || null ;
        }catch(err){
            throw err;
        }
    }

    static async getById(userId){
        const query = "select * from users where id = ?";

        try{
            const user = (await db.select(query,userId))[0];
            return user;
        }catch(err){
            throw err;
        }

    }

    static async getByEmail(email){
        const query = "select * from users where email = ?";

        try{
            const user = (await db.select(query,email))[0];
            return user;
        }catch(err){
            throw err;
        }
        
    }

    static async newUser(userData){
        try{
            const query = "insert into users set ?"
            await db.insert(query,userData)
        }catch(err){
            throw err;
        }
    }

    static async updateLastSeen(id){
        const sqlQuery = "update users set lastRequestTime = ? where id = ?";
        try{
            
            await db.update(sqlQuery,new Date(),id)
            return;
        }catch(err){
            throw err;
        }
    }


    



    

}



module.exports = User;