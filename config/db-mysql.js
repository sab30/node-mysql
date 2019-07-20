/**
 * Database Configuration file 
 * Every time the the connection has be to changed basde in environment
 */
var mysql = require('mysql');
const config = require('config');

const db = config.get('localhost');
const dbReplica=config.get('localhostReplica');

//Singleton Design 
var connection;
var connectionReplica;


module.exports = {
    /**
     * Pool Connection 
     * Connection has to be released after aquiring the pool
     */
    getConnection: function () {
      if (connection) return connection;
      connection = mysql.createPool({
        host     : db.host,
        user     : db.user,
        password : db.password,
        database : db.database
      });
      return connection;
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


//module.exports = connection;