var db = require('../config/db');
var conn = db.getConnection(); // re-uses existing if already created or creates new one
var connReplica = db.getConnectionReplica();

module.exports = {
    /**
     * Pool Connection 
     * Connection has to be released after aquiring the pool
     */
    select: function(query , req , callback){
        console.log('User Model');
        console.log(query);
        conn.getConnection((err, connection) => {
            console.log('Connection %d acquired', connection.threadId);
            if(err){
                console.error(err);
                callback(err, null);
            }
            connection.query(query, function(err, rows) {
                if (connection) connection.release();
                if(err){
                    console.error(err);
                    callback(err, null);
                }
                callback(err, rows);
            });
        });
    },

    check : async (query,req,res) => {


        // async function getRows() {
        //     const someRows = await database.query( 'SELECT * FROM some_table' ).then( rows => rows )
        //     const otherRows = await database.query( 'SELECT * FROM other_table' ).then( rows => rows );
        //     return { someRows: someRows, otherRows: otherRows }
        // }
        // conn.getConnection(async (err, connection) => {
        //     console.log('Connection %d acquired', connection.threadId);
        //     if(err){
        //         console.error(err);
        //         res.status(500).send(err);
        //     }

        conn.getConnection((err, connection) => {
            console.log('Connection %d acquired', connection.threadId);
            if(err){
                console.error(err);
                callback(err, null);
            }
            let data = connection.query('Select 1+1')
            .then( rows => {
                someRows = rows;
                console.log(rows);
            } )
            .catch( err => {
                console.log(err);
            } )
        });
            // try{
            // let someRows =await conn.query(query).then(err, rows => rows);
            // console.log(someRows);
            // res.send(rows);
            // }catch (error) {
            //     console.error(error.message);
            //     res.status(500).send('Profile/ server error');
            // }
        // });
    }
};

