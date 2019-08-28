// User Js
const express = require('express');
// Use express Rerouter
const router = express.Router();
const config = require('config');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
var md5 = require('md5');
const auth = require('../../middleware/auth');
//https://github.com/sidorares/node-mysql2/blob/master/examples/promise-co-await/await.js
var db = require('../../config/db');
const moment = require('moment');
var pool = db.getConnection();
var poolReplica = db.getConnectionReplica();

  

/**
     * Reset or Change User Password
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{put} /api/users/password Reset User Password
     * @apiName 		Register a Mypulse User
     * @apiGroup 		User
     * @apiDescription  Update or change Pasword, 
* @apiPermission 	auth,JWT
     * @apiHeader       {String} Content-Type application/json
     * @apiHeader       {String} x-auth-token JWT token from login API
     * @apiHeader       {String} authorization The user’s JWT
     * @apiParam        {String} current_password User Name
     * @apiParam        {String} new_password Email for login in
     * @apiParam        {String} confirm_password Users Password
     * @apiParamExample {json} Request-Example:
     * {
        "current_password":"123456",
        "new_password":"123456",
        "confirm_password":"123456"
        }
     * @access Private
     * */

    router.put('/password',
    auth,[
        check('current_password' , 'Please enter a current_password with 6 or more chrachters').isLength({
            min:6
        }),
        check('new_password' , 'Please enter a new password with 6 or more chrachters').isLength({
            min:6
        }),
        check('confirm_password' , 'Please enter confirm password with 6 or more chrachters').isLength({
            min:6
        })
    ], async (req,res) =>{


        let { current_password, new_password,  confirm_password} = req.body;

        if(new_password != confirm_password){
            return res.status(500).json({errors : [ { message : 'confirm password is wrong'}]});
        }

        current_password= md5(current_password + config.get('passwordHash'));
        new_password= md5(new_password + config.get('passwordHash'));
        confirm_password = md5(confirm_password + config.get('passwordHash'));
        
        try {
            let [rows] = await poolReplica.query(`select id from users where
            id=? and user_password=? limit 1`,
            [ req.user.id, current_password ]);

            if(rows.length > 0){
                // Update Password if user exist

                [rows ] = await pool.query(`update users SET user_password=?,
                modified_by=? ,modified_at=now() where id=? `, [ new_password,req.user.id,req.user.id]);

                if(rows){
                    res.send({results :{ status : 'password changed' } });
                }else{
                    return res.status(400).json({errors : [ { message : 'Unable to verify user'}]});
                }

            }else{
                return res.status(400).json({errors : [ { message : 'password didnt match'}]});
            }
          } catch (e) {
              console.error(e);
            return res.status(500).json({errors : 'Internal server error'});
          }
    });


    /**
     * User Registration
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} /api/users/create Register Mypulse User
     * @apiName 		Register a Mypulse User
     * @apiGroup 		User
     * @apiDescription  Create or Register a User for all the Mypulse Roles ex: Super Admin, 
     * @apiPermission 	auth,JWT
     * @apiHeader       {String} Content-Type application/json
     * @apiHeader       {String} x-auth-token JWT token from login API
     * @apiHeader       {String} authorization The user’s JWT
     * @apiParam        {String} user_role Role of the user [SUPER_ADMIN,HOSPITAL_ADMIN,DOCTOR,RECEPTIONIST,NURSE,MYPULSE_USER] 
     * @apiParam        {String} first_name User Name
     * @apiParam        {String} user_email Email for login in
     * @apiParam        {String} user_password Users Password
     * @apiParam        {String} user_mobile Users Mobile
     * @apiParamExample {json} Request-Example:
     * {
            "first_name" :"Sabarish",
            "user_email" : "sabarish3012@gmail.com",
            "user_password": "123456",
            "user_role":"MYPULSE_USER",
            "user_mobile":"1234567890"
        }   
     * @access Public
     * */

    router.post('/create',[
        check('user_role' , 'Role is required').not().isEmpty(),
        check('first_name' , 'Name is required').not().isEmpty(),
        check('user_email' , 'Please include a valid email').isEmail(),
        check('user_password' , 'Please enter a password with 6 or more chrachters').not().isEmpty().isLength({
            min:6
        }),
        check('user_mobile' , 'Enter mobile number').isLength({
            min:10
        })
    ], async (req,res) =>{ 

        const errors= validationResult(req);

        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
    
        // Check User Exists
        let {
            first_name,
            user_email , 
            user_password, 
            user_mobile ,
            user_role
        } = req.body;
        try {
            // Check user already exists

            let rows = null;
            [rows] =await poolReplica.query(`select id,user_email,user_mobile from users where user_email= ? or user_mobile= ? limit 1`,[
                user_email,
                user_mobile
            ]) ;

            if(rows.length > 0){
                // User already exists
                console.log(rows);
                let message= '';
                if(rows[0].user_email){
                    message= "User email already exist";
                }else{
                    message= "User mobile already exist";
                }   
                return res.status(400).json({errors : [ { message : message}]});
            }


            // res.send({results : rows });

            // console.log(md5(user_password + config.get('passwordHash')));
            // get last unique ID
            [rows] = await poolReplica.query(`select user_unique_id from users 
            where user_role=? order by id desc limit 1`,
            [ user_role ]);

            if(rows.length > 0){
                user_unique_id=  parseInt(rows[0].user_unique_id.split('_')[1]) + 1;
            }else{
                user_unique_id=  config.get('uniqueStartNumber') + 1;
            }

            // console.log(user_unique_id);
            // console.log(config.get('uniqueCodePrefix')[user_role] + '_' + user_unique_id.toString());
            const UtilsService = require('./services/UtilsService');
            let year = moment().format('YY');
            let nextUniqueId = UtilsService.getNextUniqueId(user_unique_id);
            user_unique_id = config.get('uniqueCodePrefix')[user_role] + year +"_" + nextUniqueId;
            // Create the user

            let values = {
                user_unique_id : user_unique_id,
                user_password  : md5(user_password + config.get('passwordHash')),
                user_email : user_email,
                created_by : 99,
                user_role : user_role ? user_role : null,
            };


            let sql= pool.format(`insert into users SET ? `, values);
            //console.log(sql);
            const [results]= await pool.query(sql);

            if(results){
                [rows] = await poolReplica.query(`select id from roles where
                role_code=? limit 1`,
                [ config.get('uniqueCodePrefix')[user_role] ]);

                if(rows.length > 0){

                    let values= {
                        first_name : first_name,
                        user_id : results.insertId,
                        created_by : 99,
                    }


                    let sql= pool.format(`insert into users_info SET ? `, values);
                    //console.log(sql);
                    [row]= await pool.query(sql);
                    // console.log(row);

                    // Map role to user
                    values={
                        user_id : results.insertId, 
                        role_id : rows[0].id,
                        created_by : results.insertId
                    }

                    sql= pool.format(`insert into user_role SET ? `, values);
                    [rows]= await pool.query(sql);
                    if([rows]){
                        //Send Email 
                        let nodemailer = require('nodemailer');
                        let smtpTransport = require('nodemailer-smtp-transport');

                        let transporter = nodemailer.createTransport(smtpTransport(config.get('smtp')));

                        const payload = {
                            id : results.insertId
                        }
                        // Email Expiry 30 min (30 * 60 * 1000)
                        jwt.sign(
                            payload, 
                            config.get('jwtSecret'),
                            {expiresIn: 3600000},
                            (err,token) => {
                                if (err) throw err;
                                
                                let mailOptions = { 
                                    from: config.get('smtpFrom'), 
                                    to: user_email, 
                                    subject: 'Activate your MyPulse Account',
                                    html: `<b>Dear User<b>`+
                                    `<br />`
                                    +
                                    `Your ID is : ` + user_unique_id +
                                    `<br />
                                    Thanks for registering with MyPulse. Please click this button to complete your registration.`
                                    +`<br />`+
                                    `<a href='`+ config.get('url') +"/api/users/verifyEmail/"+ token +`'>Click Here to activate</a>`
                                    };
                                    //console.log(token);
                                transporter.sendMail(mailOptions, function(error, info){ 
                                    if (error) {
                                        return res.status(400).json({errors : 'Unable to send email to user'});
                                    } else {
                                        res.send({results :{ user_id : results.insertId } });
                                    }
                                });  
                            }
                        );
                    }
                }
                // Send SMS,
            }else{
                return res.status(400).json({errors : 'Unable to create user'});
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({errors : error});
        }
    });

/**
     * Email Verification
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{get} /api/users/verifyemail/Hash-token-from-mail
     * @apiName 		Verify Email
     * @apiGroup 		User
     * @apiDescription  Verify Email from mail change status of email status in user table,
     * @apiPermission 	None
     * @access Public
     * */

    router.get('/verifyEmail/:token', async (req,res) =>{
        try {

            const token= req.params.token;
            // Decode the JWT hash 
            const decoded= jwt.verify(token,config.get('jwtSecret'));
            // Assaign the req.user to parsed output
            let [rows ] = await poolReplica.query(`select id from users where
                id=? limit 1`,
                [ decoded.id ]);
                if(rows.length > 0){
                    // Update user
                    [rows ] = await pool.query(`update users SET is_email_verified=?,
                    modified_by=? ,modified_at=now() where id=? `, [ 1,  decoded.id,  decoded.id]);
                    if(rows){
                        res.send({results :{ is_email_verified : 1 } });
                    }else{
                        return res.status(400).json({errors : [ { message : 'Unable to verify user'}]});
                    }
                
                }else{
                    return res.status(400).json({errors : [ { message : 'User dosenot exist'}]});
                }
        } catch (error) {
            console.error(error);
            res.status(401).json({msg: 'token is not valid or expired'});
        }
        
    });

    /**
     * Login
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} /api/users/login login for all the Users
     * @apiName 		Login a Mypulse User[ALL Users]
     * @apiGroup 		Login
     * @apiDescription  Login with user_email/mobile and password and get a JWT token
     * @apiPermission 	auth,JWT
     * @apiHeader       {String} Content-Type application/json
     * @apiHeader       {String} x-auth-token JWT token from login API
     * 
     * @apiParam        {String} user_email Email/Phone Number
     * @apiParam        {String} user_password Password
     * @apiParamExample {json} Request-Example:
     * {
        "user_email": "sabarish3012@gmail.com",
        "user_password" : "123456"
        }         
     * @access Public
     * */

    router.post('/login',[
        check('user_email' , 'Please include a valid email').not().isEmpty(),
        check('user_password' , 'Please enter a password').isLength({ min: 6 })
    ], async (req,res) =>{ 
        // Validate error which takes a req object 
        const errors= validationResult(req);

        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }

        const {user_email, user_password} =req.body;
        try {
            let sql= pool.format(`
            SELECT 
                u.id, user_role, ur.role_id, r.role, r.role_code,u.status, u.is_mobile_verified, u.is_email_verified
            FROM
                users u
                    INNER JOIN
                user_role ur ON ur.user_id = u.id
                    INNER JOIN
                roles r ON r.id = ur.role_id
            WHERE
            (user_email=? or user_mobile=?) and user_password=? limit 1`,
            [ user_email, user_email, md5(user_password + config.get('passwordHash'))]);

            //console.log(sql);

            let [rows ] = await pool.query(sql);

                if(rows.length > 0){

                    // validations as per USER_ROLE
                    switch (rows[0].user_role ) {
                        case 'MYPULSE_USER': 
                            if(rows[0].is_mobile_verified == 0){
                                return res.status(400).json({errors : [ { message : 'Please verfiy your mobile number.'}]});
                            }
                        break;
                        default:
                            if(rows[0].is_email_verified == 0){
                                return res.status(400).json({errors : [ { message : 'Please verfiy your email id.'}]});
                            }
                        break;
                    }

                    const payload = {
                        user : rows[0]
                    }
                    //get from config "10h" | 360000
                    jwt.sign(
                        payload, 
                        config.get('jwtSecret'),
                        {expiresIn: "1h"},
                        (err,token) => {
                            if (err) throw err;
                            res.json({token});
                        }
                        );
                
                }else{
                    return res.status(400).json({errors : [ { message : 'User dosen`t exist'}]});
                }
        } catch (error) {
            console.error(error);
            res.status(401).json({msg: error});
        }
    }); 

    /**
     * Get User by id
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{get} /api/users/byid User By Id
     * @apiName 		Get Current User details
     * @apiGroup 		User
     * @apiDescription  Get User Details 
     * @apiPermission 	auth,JWT
     * @apiHeader       {String} Content-Type application/json
     * @apiHeader       {String} x-auth-token JWT token from login API
     * 
     * @access Private
     * */

    router.get('/byid', auth ,async (req,res) =>{ 
        // Validate error which takes a req object 
        try {
            let [rows ] = await poolReplica.query(`SELECT * from vw_users WHERE id=? limit 1`,[ req.user.id]);
                if(rows.length > 0){
                    res.send(rows[0]);
                }else{
                    return res.status(400).json({errors : [ { message : 'User dosen`t exist'}]});
                }
        } catch (error) {
            res.status(401).json({msg: error});
        }
    });

    /**
     * Create Mypulse User Basic Info
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} /api/users/basicinfo My pulse user Basic info
     * @apiName 		Mypulse User Basic info 
     * @apiGroup 		User
     * @apiDescription  Mypulse User Basic info insert or Update
     * @apiPermission 	auth,JWT
     * @apiHeader       {String} Content-Type application/json
     * @apiHeader       {String} x-auth-token JWT token from login API
     * 
     * @apiParam        {String} first_name Mandatory 
     * @apiParam        {String} last_name
     * @apiParam        {String} description
     * @apiParamExample {json} Request-Example:
     * {
            "first_name": "sabarish",
            "last_name":"K",
            "description":"mypukse users"
        }         
     *
     * @access Private
     * */
    router.post('/basicinfo',auth,[
        check('first_name' , 'Please fill in first name').not().isEmpty(),
    ], async (req,res) =>{ 
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
        let {first_name,last_name,description } = req.body;
        try {
             // Check if user exist
             let sql= pool.format(`
             SELECT  id 
             FROM
                 users_info
             WHERE
             user_id=? limit 1`,
             [ req.user.id]);
 
             let [rows ] = await pool.query(sql);
 
                 if(rows.length > 0){
                     // Update User Data
                     [ rows ] = await pool.query(`update users_info SET
                     first_name=?,
                     last_name=?,
                     description=?,
                     modified_by=? ,
                     modified_at=now() 
                     where user_id=? `, 
                     [ first_name,last_name,description,req.user.id, req.user.id
                     ]);

                     if(rows){
                         res.send({results : 'User basic info Updated'});
                     }else{
                         return res.status(400).json({errors : [ { message : 'Unable to Update'}]});
                     }
                }else{
                    let values= {
                        user_id : req.user.id,
                        first_name : first_name ,
                        last_name : last_name ? last_name : null ,
                        description : description ? description : null,
                        created_by :  req.user.id
                    }
                    let sql= pool.format(`insert into users_info SET ? `, values);
                //console.log(sql);
                    [rows]= await pool.query(sql);
                    if(rows){
                        res.send({results :{ status : 'User Basic info updated.' } });
                    }else{
                        return res.status(400).json({errors : [ { message : 'Unable to Update'}]});
                    }
                }
        } catch (error) {
                console.error(error);
                res.status(401).json({msg: error});
        }
    });


    /**
     * Mypulse User Genaral Info api
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} /api/users/generalinfo My pulse user Genaral info
     * @apiName 		Mypulse User Genaral info 
     * @apiGroup 		User
     * @apiDescription  Mypulse User Genaral info insert or Update
     * @apiPermission 	auth,JWT
     * @apiHeader       {String} Content-Type application/json
     * @apiHeader       {String} x-auth-token JWT token from login API
     * 
     * @apiParam        {String} user_gender ['M', 'F','O']
     * @apiParam        {String} user_dob
     * @apiParam        {String} address
     * @apiParam        {String} user_profile_picture
     * @apiParam        {Number} country_id
     * @apiParam        {Number} state_id
     * @apiParam        {Number} district_id
     * @apiParam        {Number} city_id
     * @apiParamExample {json} Request-Example:
     * {
            "gender":"M",
            "dob":"1992-12-30",
            "address":"72 angavarpalaya",
            "user_profile_picture":"test",
            "country_id":1,
            "state_id":1,
            "district_id":1,
            "city_id":1
        }
     * @access Private
     * */
    router.post('/generalinfo',auth,[
        check('dob').toDate(),
        check('gender').isIn(['M', 'F','O'])
    ], async (req,res) =>{ 
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
        let {
            gender,
            dob,
            address,
            user_profile_picture,
            country_id,
            state_id,
            district_id,
            city_id,
         } = req.body;
         

        gender = gender ? gender: null;
        dob = dob ? dob: null;
        address = address ? address : null;
        user_profile_picture = user_profile_picture ? user_profile_picture : null;
        country_id = country_id ? country_id : null; 
        state_id = state_id ? state_id : null; 
        district_id = district_id ? district_id : null; 
        city_id = city_id ? city_id : null;

        try {
             // Check if user exist
             let sql= pool.format(`
             SELECT  user_id 
             FROM
                 users_info
             WHERE
             user_id=? limit 1`,
             [ req.user.id]);
            
             let [rows ] = await pool.query(sql);
             console.log(rows);
                 if(rows.length > 0){
                     // Update User Data
                     let sql = pool.format(`update users_info SET
                     gender =?,
                     dob =?,
                     address =?,
                     user_profile_picture=?,
                     country_id =?,
                     state_id =?,
                     district_id =?,
                     city_id =?,
                     modified_by=? ,
                     modified_at=now() 
                     where user_id=? `, 
                     [ 
                        gender,
                        dob,
                        address,
                        user_profile_picture,
                        country_id,
                        state_id,
                        district_id,
                        city_id,
                        req.user.id,
                        req.user.id
                     ]);
                     [ rows ] = await pool.query(sql);
                      console.log(sql);
                     if(rows){
                         res.send({results : 'User general info Updated'});
                     }else{
                         return res.status(400).json({errors : [ { message : 'Unable to verify user'}]});
                     }
                 }else{
                     return res.status(400).json({errors : [ { message : 'User dosen`t exist'}]});
                 }
        } catch (error) {
            console.error(error);
            res.status(401).json({msg: error});
        }
    });


    /**
     * Mypulse User medicalinfo  api
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} /api/users/medicalinfo My pulse user medicalinfo info
     * @apiName 		Mypulse User medicalinfo
     * @apiGroup 		User
     * @apiDescription  Mypulse User medicalinfo insert or Update
     * @apiHeader       {String} Content-Type application/json
     * @apiHeader       {String} x-auth-token JWT token from login API
     * 
     * @apiParam        {String} patient_type
     * @apiParam        {String} blood_group
     * @apiParam        {String} in_time
     * @apiParam        {Float} height
     * @apiParam        {Float} weight
     * @apiParam        {Float} blood_pressure
     * @apiParam        {Float} sugar_level
     * @apiParam        {Number} health_insurance_provider
     * @apiParam        {Number} family_history
     * @apiParam        {Number} past_medical_history
     * @apiParamExample {json} Request-Example:
     * {
            "patient_type":"",
            "blood_group":"",
            "in_time":"",
            "height":"",
            "weight":"",
            "blood_pressure":"",
            "sugar_level":"",
            "health_insurance_provider":"",
            "health_insurance_id":"",
            "family_history":"",
            "past_medical_history":""
        }
     * @access Private
     * */
    router.post('/medicalinfo',auth
    , async (req,res) =>{ 
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
        let {
            patient_type,
            blood_group,
            in_time,
            height,
            weight,
            blood_pressure,
            sugar_level,
            health_insurance_provider,
            health_insurance_id,
            family_history,
            past_medical_history
         } = req.body;

         patient_type = patient_type ? patient_type : null;
         blood_group = blood_group ? blood_group : null;
         in_time = in_time ? in_time : null;
         height = height ? height : null;
         weight = weight ? weight : null;
         blood_pressure = blood_pressure ? blood_pressure : null;
         sugar_level = sugar_level ? sugar_level : null;
         health_insurance_provider = health_insurance_provider ? health_insurance_provider : null;
         health_insurance_id = health_insurance_id ? health_insurance_id : null;
         family_history = family_history ? family_history : null;
         past_medical_history= past_medical_history ? past_medical_history : null;

        try {
             // Check if user exist
             let sql= pool.format(`
             SELECT  id , user_id
             FROM
                 users_info
             WHERE
             user_id=? limit 1`,
             [ req.user.id]);
 
             let [rows ] = await pool.query(sql);
                //  console.log(rows);
                 if(rows.length > 0){
                     // Update User Data
                     let sql = pool.format(`update users_info SET
                     user_id=?,
                     patient_type=?,
                     blood_group=?,
                     in_time=?,
                     height=?,
                     weight=?,
                     blood_pressure=?,
                     sugar_level=?,
                     health_insurance_provider=?,
                     health_insurance_id=?,
                     family_history=?,
                     past_medical_history=?,
                     modified_by=?,
                     modified_at=now()
                     where user_id=? `, 
                     [ 
                        req.user.id,
                        patient_type,
                        blood_group,
                        in_time,
                        height,
                        weight,
                        blood_pressure,
                        sugar_level,
                        health_insurance_provider,
                        health_insurance_id,
                        family_history,
                        past_medical_history,
                        req.user.id,
                        req.user.id,
                     ]);
                     [ rows ] = await pool.query(sql);
                     if(rows){
                         res.send({results : 'User medical info Updated'});
                     }else{
                         return res.status(400).json({errors : [ { message : 'Unable to verify user'}]});
                     }
                 }else{
                     return res.status(400).json({errors : [ { message : 'User dosen`t exist'}]});
                 }
        } catch (error) {
            console.error(error);
            res.status(401).json({msg: error});
        }
    });




// Export the router

module.exports = router;