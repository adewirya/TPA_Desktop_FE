const mySql = require("mysql2/promise");

class Connect{
    static connect;
    static async getConnection(){
        if(this.connect == null){
            this.connect = await mySql.createConnection({
                host:"localhost",
                user:"root",
                database:"tpa-destkop"
            }); 
        }
        return this.connect
    }
}

module.exports = Connect;
