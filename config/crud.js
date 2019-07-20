var db = require('./db');
var conn = db.getConnection(); // re-uses existing if already created or creates new one
var connReplica = db.getConnectionReplica();


module.exports = {
    /**
     * Pool Connection 
     * Connection has to be released after aquiring the pool
     */

    select: (query) => {
        conn.getConnection((err, connection) => {
            console.log('Connection %d acquired', connection.threadId);
            if(err){
                console.error(err);
                return res.status(500).json({errors : err});
            }
            connection.query(query, function(err, rows) {
                if (connection) connection.release();
                if(err){
                    console.error(err);
                    return res.status(500).json({errors : err});
                }
                console.log(rows);
                return new Promise((resolve, reject)=>{
                    resolve(rows);
                });
            });
        });
    },
    insert: async (query, values) => {
        await conn.getConnection(function(err, connection) {
            console.log('Connection %d acquired', connection.threadId);
            if(err){
                console.error(err);
                return res.status(500).json({errors : err});
            }
            connection.query(query, values, function(err, rows) {
                if (connection) connection.release();
                if(err){
                    console.error(err);
                    return res.status(500).json({errors : err});
                }
                console.log(rows);
                
                return rows;
            });
        });
    },

    getConnectionReplica: function () {
        if (connectionReplica) return connectionReplica;
        connectionReplica = mysql.createPool({
          host     : dbReplica.host,
          user     : dbReplica.user,
          password : dbReplica.password,
          database : dbReplica.database
        });
        return connectionReplica;
      }
};