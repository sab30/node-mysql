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
var md5 = require('md5');
const auth = require('../../middleware/auth');
// @route  GET api/users
// @desc   Test Route
// @access Public
//https://github.com/sidorares/node-mysql2/blob/master/examples/promise-co-await/await.js
var db = require('../../config/db');

var pool = db.getConnection();
var poolReplica = db.getConnectionReplica();


  
router.get('/login', async (req,res) => {

    try {
        const data= await pool.execute('select id,user_role, from test where id =1;');
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

  /**
     * Creates a User or Registration
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} / Create or Register a User
     * @apiName 		Register a Mypulse User
     * @apiGroup 		User
     * @apiDescription  Create or Register a User for all the Mypulse Roles ex: Super Admin, 
     *                  
     *
     * @apiPermission 	None
     * @access Public
     * */

    router.post('/createUser',[
        check('user_name' , 'Name is required').not().isEmpty(),
        check('user_email' , 'Please include a valid email').isEmail(),
        check('user_password' , 'Please enter a password with 6 or more chrachters').isLength({
            min:6
        })
    ], async (req,res) =>{ 

        const errors= validationResult(req);

        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
    
        // Check User Exists
        let {user_email , user_password, user_mobile ,
            user_name,
            user_unique_id,
            user_first_name,
            user_last_name,
            user_gender,
            user_dob,
            longitude,
            latitude,
            address,
            aadhar,
            qualification,
            profession,
            specializations,
            owner_name,
            owner_mobile,
            experience,
            user_role
        } = req.body;
        try {
            // Check user already exists

            let rows = null;
            [rows] =await pool.query(`select id from users where user_email= ? or user_mobile= ? and user_password = ? limit 1`,[
                user_email,
                user_mobile,
                user_password
            ]) ;

            if(rows.length > 0){
                // User already exists
                return res.status(400).json({errors : [ { message : 'User already exist'}]});
            }


            // // res.send({results : rows });

            // // console.log(md5(user_password + config.get('passwordHash')));
            // // get last unique ID
            // getUniqueId = await pool.query(`select user_unique_id from users 
            // where user_role=? order by id desc limit 1`,
            // [ user_role ]);

            // if(getUniqueId.err)throw err;

            // if(getUniqueId.rows.length > 0){
            //     user_unique_id=  parseInt(rows[0].user_unique_id.split('_')[1]) + 1;
            // }else{
            //     user_unique_id=  config.get('uniqueStartNumber') + 1;
            // }

            // // console.log(user_unique_id);
            // // console.log(config.get('uniqueCodePrefix')[user_role] + '_' + user_unique_id.toString());


            // user_unique_id = config.get('uniqueCodePrefix')[user_role] + "_" + user_unique_id.toString()
            // // Create the user

            // let values = {
            //     user_name : user_name ? user_name: null,
            //     user_unique_id : user_unique_id,
            //     user_first_name : user_first_name ? user_first_name: null,
            //     user_last_name : user_last_name ? user_last_name: null,
            //     user_gender : user_gender ? user_gender: null,
            //     user_dob : user_dob ? user_dob: null,
            //     latitude : latitude ? latitude: null,
            //     longitude : longitude ? longitude: null,
            //     user_password  : md5(user_password + config.get('passwordHash')),
            //     user_email : user_email,
            //     created_by : 99,
            //     address : address ? address : '',
            //     aadhar : aadhar ? aadhar : null,
            //     qualification : qualification ? qualification : null,
            //     profession : profession ? profession : null,
            //     specializations : specializations ? specializations : null,
            //     owner_name : owner_name ? owner_name : null,
            //     owner_mobile : owner_mobile ? owner_mobile : null,
            //     experience : experience ? experience : null,
            //     user_role : user_role ? user_role : null,
            // };
            // const insertUser = await pool.execute(`insert into users SET ? `, values);
            // if (insertUser.err) throw err;

            // if(insertUser.results){

            //     const getRole = await pool.query(`select id from roles where
            //     role_code=? limit 1`,
            //     [ config.get('uniqueCodePrefix')[user_role] ]);
            //     if(getRole.err)throw err;
            //     if(getRole.rows.length > 0){
            //         let row = results[0];
            //         // Map role to user
            //         let values={
            //             user_id : results.insertId, 
            //             role_id : created_by
            //         }
            //         const mapRole= pool.query(`insert into user_role SET ? `, values);
            //         console.log('insert err');
            //         console.log(error);

                  
            //         if(mapRole.err) throw error;
            //         if(mapRole.results){
            //             //Send Email 
            //             let nodemailer = require('nodemailer');
            //             let smtpTransport = require('nodemailer-smtp-transport');

            //             let transporter = nodemailer.createTransport(smtpTransport(config.get('smtp')));

            //             let mailOptions = { 
            //                 from: config.get('smtpFrom'), 
            //                 to: user_email, 
            //                 subject: 'Activate your MyPulse Account',
            //                 html: `<b>Dear User<b>`+
            //                 `<br />`
            //                 +
            //                 `Your ID is : ` + user_unique_id +
            //                 `<br />
            //                 Thanks for registering with MyPulse. Please click this button to complete your registration.`
            //                 };

            //             transporter.sendMail(mailOptions, function(error, info){ 
            //                 if (error) {
            //                     return res.status(400).json({errors : 'Unable to send email to user'});
            //                 } else {
            //                     res.send({results :{ user_id : results.insertId } });
            //                 }
            //             });  
            //         }
            //     }
            //     // Send SMS,
            // }else{
            //     return res.status(400).json({errors : 'Unable to create user'});
            // }
        } catch (error) {
            console.log(error);
            return res.status(400).json({errors : error});
        }
    }
    )


/**
     * Reset or Change User Password
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} / Reset User Password
     * @apiName 		Register a Mypulse User
     * @apiGroup 		User
     * @apiDescription  Update or change Pasword, 
     *                  
     *
     * @apiPermission 	None
     * @access Private
     * */

    router.post('/updatePassword',[
        check('user_password' , 'Please enter a password with 6 or more chrachters').isLength({
            min:6
        }),
        check('old_password' , 'Please enter a old password').isLength({
            min:6
        }),
        check('new_password' , 'Please enter a password with 6 or more chrachters for new password').isLength({
            min:6
        })
    ], async (req,res) =>{

        const [ old_password, new_password, user_password ] = req.body;

        user_password= md5(user_password + config.get('passwordHash'));
        old_password= md5(old_password + config.get('passwordHash'));
        new_password = md5(new_password + config.get('passwordHash'));

        try {
            const [err, results, fields] = await pool.query(`select id from users where
            user_id=? and user_password=? limit 1`,
            [ old_password ]);
            if (err) throw err;

            if(rows.length > 0){
                res.send(results);
            }else{
                return res.status(400).json({errors : [ { message : 'User dosen exist'}]});
            }
          } catch (e) {
              console.error(e);
            return res.status(500).json({errors : 'Internal server error'});
          }
    });


router.post('/',[
    check('user_email' , 'Please include a valid email').isEmail(),
    check('user_password' , 'Please enter a password with 6 or more chrachters').isLength({
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

    //const salt = await bcrypt.genSalt(10);

    // user.password  = await bcrypt.hash(password,salt);
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