const express = require('express');
const compression = require('compression');
var cors = require('cors');
// const connectDB = require('./config/db');
//apidoc -f "api/.*\\.js$" -i ./  -o apidoc/

const app = express();

// Connect to DB 

// connectDB();

// Init Body parser via express midleware
app.use(compression());
app.use(cors());
app.use(express.json({ extended : false }));
 
// If no port is set by default the port would be 5000
const PORT = process.env.PORT || 5000; 

//Sample endpoint , callback with req, resoponse
app.get('/', (req,res) => res.send('API Running....'));
// DEFINE AND ACCESS THE ROUTES
app.use('/api/docs', require('./routes/api/docs'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/hospital', require('./routes/api/hospital'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/auth', require('./routes/api/auth'));

// PORT, Callback
app.listen(PORT, () =>{
    console.log(`Server started at port : ${PORT}`);
});



