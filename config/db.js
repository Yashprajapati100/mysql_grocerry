const mysql = require('mysql2');
let db;
class Database {
   connectDb() {
        try {
            db = mysql.createConnection({
                user:"root",
                host:"localhost",
                database:"grocerry",
                password:"",
                port: 3306
            })
            db.on('error', function (error) {
                if (error) throw error;
            });
            db.on('connect',()=>{
                console.log('database connected');
        })
            return db.promise();
        } catch (error) {
            console.log("error====>",error)
        }
    }
}
module.exports= new Database();