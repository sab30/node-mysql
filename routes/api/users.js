// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();
const config = require('config');
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
// Import UserModel
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
var crud = require('../../config/crud');

// @route  GET api/users
// @desc   Test Route
// @access Public
//https://github.com/sidorares/node-mysql2/blob/master/examples/promise-co-await/await.js
var db = require('../../config/db');
var pool = db.getConnection();
router.get('/', async (req,res) => {

    try {
        const data= await pool.execute('select * from test where id =1;');
        console.log(rows);
        
        // const data2= await pool.execute('select * from test where id =2;');
        // console.log(rows2);
        res.send({'q' : data['rows']});
        // res.send({'q' : rows});
    } catch (e) {
        console.log('caught exception!', e);
    }

    // try{
    //     let [data1, data2]= await Promise.all([
    //         pool.query('select * from test where id=1'),
    //         pool.query('select * from test where id=2')
    //     ]);
    //     console.log(data1.rows);
    //     console.log(data2.rows);
    //     return res.send({data1 : data1.rows});
    // } catch (e) {
    //     console.log('caught exception!', e);
    // }


        



    // pool.getConnection((err, db) => {
    //     if (err) res.send(err);
    //     db.query('select 1+1', (err, rows, fields) => {
    //     if (err) res.send(err);
    //       console.log(rows, fields);
    //       res.send(rows);
    //       db.release();
    //     });
    //   });



    // User.select('select 1 + 1' , function (err,task){
    //     if (err) res.send(err);
    //     console.log('res', task);
    //     res.send(task);
    // });
    // User.check('select 1', req,res, function(err, task) {
    // //User.check('select 1', req,res, function(err, task) {
    //     console.log('controller')
    //     if (err)
    //       res.send(err);
    //       console.log('res', task);
    //     res.send(task);
    //   });
    // let data = await crud.select('select 1+1');
    // console.log(data);
    // return res.json({data : data});
});
// @route  GET api/users
// @desc   Test Route
// @access Public
// router.get('/', (req,res) =>{
//     res.send('User Route');
// })

router.post('/',[
    check('name' , 'Name is required').not().isEmpty(),
    check('email' , 'Please include a valid email').isEmail(),
    check('password' , 'Please enter a password with 6 or more chrachters').isLength({
        min:6
    })
], async (req,res) =>{ 
    // Validate error which takes a req object 
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        console.error(errors);
        return res.status(400).json({errors : errors.array()});
    }

    const {name , email, password } = req.body;

    // Destruct from req.body 
    try {
   
    // See if user exists
    let user = await User.findOne({ email });

    if(user){
        return res.status(400).json({errors : [ { message : 'User already exist'}]});
    }

    //Get user gravatar
    // s(size): , r(rating):  d(default): 
    const avatar = gravatar.url({
        s:'200',
        r:'pg',
        d:'mm'
    });

    // Crate instance of the user;
     user = new User({name , email , password , avatar});

    // Encrypt password with bcrypt

    const salt = await bcrypt.genSalt(10);

    user.password  = await bcrypt.hash(password,salt);
    // Will Return a Promise 
    await user.save();

    //Return JWT 

    const payload = {
        user:{
            id: user.id
        }
    }
    //get from config
    jwt.sign(
        payload, 
        config.get('jwtSecret'),
        {expiresIn: 360000},
        (err,token) => {
            if (err) throw err;
            res.json({token});
        }
        );

    //res.send('User Registered');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('User/ server error');
    }

})




// Export the router

module.exports = router;