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

    router.put('/password',auth,[
        check('current_password' , 'Please enter a password with 6 or more chrachters').isLength({
            min:6
        }),
        check('new_password' , 'Please enter a new password').isLength({
            min:6
        }),
        check('confirm_password' , 'Please enter a password with 6 or more chrachters for confirm password').isLength({
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
     * @apiParam        {String} user_role Role of the user [SUPER_ADMIN,RECEPTIONIST,NURSE,MYPULSE_USER,MEDICAL_STORE,MEDICAL_LAB,HOSPITAL_ADMIN,DOCTOR] 
     * @apiParam        {String} user_first_name User Name
     * @apiParam        {String} user_email Email for login in
     * @apiParam        {String} user_password Users Password
     * @apiParamExample {json} Request-Example:
     * {
            "user_first_name" :"sabkashyap",
            "user_email" : "sabarishkashyap567@gmail.com",
            "user_password": "123456",
            "user_role":"MYPULSE_USER"
        }     
     * @access Public
     * */

    router.post('/create',[
        check('user_role' , 'Role is required').not().isEmpty(),
        check('user_first_name' , 'Name is required').not().isEmpty(),
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
            [rows] =await poolReplica.query(`select id from users where user_email= ? or user_mobile= ? and user_password = ? limit 1`,[
                user_email,
                user_mobile,
                user_password
            ]) ;

            if(rows.length > 0){
                // User already exists
                return res.status(400).json({errors : [ { message : 'User already exist'}]});
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


            user_unique_id = config.get('uniqueCodePrefix')[user_role] + "_" + user_unique_id.toString()
            // Create the user

            let values = {
                user_unique_id : user_unique_id,
                user_first_name : user_first_name ? user_first_name: null,
                user_last_name : user_last_name ? user_last_name: null,
                user_gender : user_gender ? user_gender: null,
                user_dob : user_dob ? user_dob: null,
                latitude : latitude ? latitude: null,
                longitude : longitude ? longitude: null,
                user_password  : md5(user_password + config.get('passwordHash')),
                user_email : user_email,
                created_by : 99,
                address : address ? address : '',
                aadhar : aadhar ? aadhar : null,
                qualification : qualification ? qualification : null,
                profession : profession ? profession : null,
                specializations : specializations ? specializations : null,
                owner_name : owner_name ? owner_name : null,
                owner_mobile : owner_mobile ? owner_mobile : null,
                experience : experience ? experience : null,
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
                    let row = results[0];
                    // Map role to user
                    let values={
                        user_id : results.insertId, 
                        role_id : rows[0].id,
                        created_by : results.insertId
                    }

                    let sql= pool.format(`insert into user_role SET ? `, values);
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
            res.status(401).json({msg: 'token is not valid'});
        }
        
    });

    /**
     * Login
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} /api/users/login User login
     * @apiName 		Login a Mypulse User[ALL Users]
     * @apiGroup 		User
     * @apiDescription  Login with user_email , mobile and password and get a JWT token
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

        const {user_email, user_password} =req.body;
        try {
            let sql= pool.format(`
            SELECT 
                u.id, user_role, ur.role_id, r.role, r.role_code,u.status
            FROM
                users u
                    INNER JOIN
                user_role ur ON ur.user_id = u.id
                    INNER JOIN
                roles r ON r.id = ur.role_id
            WHERE
            (user_email=? or user_mobile=?) and user_password=? limit 1`,
            [ user_email, user_email, md5(user_password + config.get('passwordHash'))]);

            let [rows ] = await pool.query(sql);

                if(rows.length > 0){
                    const payload = {
                        user : rows[0]
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
     * @access Public
     * */

    router.get('/byid', auth ,async (req,res) =>{ 
        // Validate error which takes a req object 
        try {
            let [rows ] = await poolReplica.query(`SELECT * from get_mypulse_users WHERE user_id=? limit 1`,[ req.user.id]);
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
     * @apiParam        {String} user_first_name 
     * @apiParam        {String} user_last_name
     * @apiParam        {String} user_last_name
     * @apiParam        {String} user_description
     * @apiParam        {String} user_email
     * @apiParam        {String} user_mobile
     * @apiParam        {Number} status 1/0
     * @apiParamExample {json} Request-Example:
     * {
            "user_first_name": "sabarish",
            "user_last_name":"K",
            "user_description":"mypukse userds",
            "user_email":"sabarish3012@gmail.com",
            "user_mobile":"9739551587",
            "status":1
        }         
     *
     * @access Private
     * */
    router.post('/basicinfo',auth,[
        check('user_first_name' , 'Please fill in first name').not().isEmpty(),
    ], async (req,res) =>{ 
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }

        let {user_first_name,user_last_name,user_description,user_email,user_mobile,status } = req.body;

            user_first_name = user_first_name ? user_first_name: null;
            user_last_name = user_last_name ? user_last_name: null;
            user_description = user_description ? user_description : null;
            user_email = user_email ? user_email : null; 
            user_mobile = user_mobile ? user_mobile : null; 
            status = status ? status : req.user.status;


        try {
             // Check if user exist
             let sql= pool.format(`
             SELECT  id 
             FROM
                 users
             WHERE
             id=? limit 1`,
             [ req.user.id]);
 
             let [rows ] = await pool.query(sql);
 
                 if(rows.length > 0){
                     // Update User Data
                     [ rows ] = await pool.query(`update users SET
                     user_first_name=?,
                     user_last_name=?,
                     user_description=?,
                     user_email=?,
                     user_mobile=?,
                     status=?,
                     modified_by=? ,
                     modified_at=now() 
                     where id=? `, 
                     [ user_first_name,user_last_name,user_description,user_email,user_mobile,status,
                      req.user.id, req.user.id
                     ]);

                     if(rows){
                         res.send({results : 'User basic info Updated'});
                     }else{
                         return res.status(400).json({errors : [ { message : 'Unable to verify user'}]});
                     }
                }else{
                     return res.status(400).json({errors : [ { message : 'User dosen`t exist' } ]});
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
            "user_gender":"M",
            "user_dob":"1992-12-30",
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
        check('user_dob').toDate(),
        check('user_gender').isIn(['M', 'F','O'])
    ], async (req,res) =>{ 
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
        let {
            user_gender,
            user_dob,
            address,
            user_profile_picture,
            country_id,
            state_id,
            district_id,
            city_id,
         } = req.body;
         

        user_gender = user_gender ? user_gender: null;
        user_dob = user_dob ? user_dob: null;
        address = address ? address : null;
        user_profile_picture = user_profile_picture ? user_profile_picture : null;
        country_id = country_id ? country_id : null; 
        state_id = state_id ? state_id : null; 
        district_id = district_id ? district_id : null; 
        city_id = city_id ? city_id : null;


        try {
             // Check if user exist
             let sql= pool.format(`
             SELECT  id 
             FROM
                 users
             WHERE
             id=? limit 1`,
             [ req.user.id]);
 
             let [rows ] = await pool.query(sql);

                 if(rows.length > 0){
                     // Update User Data
                     [ rows ] = await pool.query(`update users SET
                     user_gender =?,
                     user_dob =?,
                     address =?,
                     user_profile_picture=?,
                     country_id =?,
                     state_id =?,
                     district_id =?,
                     city_id =?,
                     modified_by=? ,
                     modified_at=now() 
                     where id=? `, 
                     [ 
                        user_gender,
                        user_dob,
                        address,
                        user_profile_picture,
                        country_id,
                        state_id,
                        district_id,
                        city_id,
                        req.user.id,
                       req.user.id
                     ]);
                    //  console.log(rows);
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
     * @apiParam        {String} in_time
     * @apiParam        {String} account_opening_timestamp
     * @apiParam        {String} aadhar
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
            "account_opening_timestamp":"",
            "aadhar":"",
            "height":"",
            "weight":"",
            "blood_pressure":"",
            "sugar_level":"",
            "health_insurance_provider":"",
            "health_insurance_id":"",
            "family_history":"",
            "past_medical_history:""
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
            account_opening_timestamp,
            aadhar,
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
         account_opening_timestamp = account_opening_timestamp ? account_opening_timestamp : null;
         aadhar = aadhar ? aadhar : null;
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
             SELECT  id 
             FROM
                 users
             WHERE
             id=? limit 1`,
             [ req.user.id]);
 
             let [rows ] = await pool.query(sql);
                //  console.log(rows);
                 if(rows.length > 0){
                     // Update User Data
                     let sql = pool.format(`update users_medical_info SET
                     user_id=?,
                     patient_type=?,
                     blood_group=?,
                     in_time=?,
                     account_opening_timestamp=?,
                     aadhar=?,
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
                        account_opening_timestamp,
                        aadhar,
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