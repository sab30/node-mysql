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
     * Hospital Registration
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} /api/hospital/create Create or Register a Hospital
     * @apiName 		Register a Hospital
     * @apiGroup 		Hospital
     * @apiDescription  Create or Register a Hospital for all the Mypulse Roles ex: Super Admin
     * @apiPermission 	auth,JWT
     * @apiHeader       {String} Content-Type application/json
     * @apiHeader       {String} x-auth-token JWT token from login API
     * @apiParam        {String} user_role
     * @apiParam        {String} first_name
     * @apiParam        {String} last_name
     * @apiParam        {String} user_email
     * @apiParam        {String} user_mobile
     * @apiParam        {String} hospital_id
     * @apiParam        {String} status [1- Active. 0 - Inactive]
     * @apiParam        {String} address
     * @apiParamExample {json} Request-Example:
     * {
	    "user_role":"HOSPITAL_ADMIN",
        "first_name":"sabarish",
        "last_name":"K",
        "description":"test",
        "user_email":"sabairh3012@gmail.com",
        "user_mobile":"9797907098",
        "hospital_id":"1", 
        "status" : 1,
        "address" : "213213"
}
     * @access Private
     * */

    router.post('/create',auth,[
        check('user_role' , 'Role is required').not().isEmpty(),
        check('name' , 'name is required').not().isEmpty(),
        check('email' , 'email is required').not().isEmpty(),
        check('contact_number' , 'contact_number is required').not().isEmpty(),
        check('address' , 'address is required').not().isEmpty(),
        check('description' , 'description is required').not().isEmpty(),
        check('md_name' , 'owner_name is required').not().isEmpty(),
        check('md_contact_number' , 'owner_mobile is required').not().isEmpty(),
        check('city_id' , 'city_id is required').not().isEmpty(),
        check('state_id' , 'state_id is required').not().isEmpty(),
        check('district_id' , 'district_id is required').not().isEmpty(),
        check('country_id' , 'country_id is required').not().isEmpty(),
        check('license' , 'license is required').not().isEmpty(),
        check('license_status' , 'license_status is required').not().isEmpty(),
        check('from_date' , 'from_date is required').not().isEmpty().toDate(),
        check('till_date' , 'till_date is required').not().isEmpty().toDate()
    ], async (req,res) =>{ 
        const errors= validationResult(req);

        if(!errors.isEmpty()){
            console.error('errors');
            return res.status(400).json({errors : errors.array()});
        }
        let {
            user_role,
            name,
            email,
            contact_number,
            address,
            description,
            md_name,
            md_contact_number,
            city_id,
            state_id,
            district_id,
            country_id,
            license,
            license_status,
            from_date,
            till_date
        } = req.body;
        try {
            // Get Last Hospital Unique ID
            let rows, user_unique_id = null;
            [rows] =await poolReplica.query(`select id,user_unique_id from hospitals order by id desc limit 1`) ;
            if(rows.length > 0){
                user_unique_id=  parseInt(rows[0].user_unique_id.split('_')[1]) + 1;
            }else{
                user_unique_id=  config.get('uniqueStartNumber') + 1;
            }
            const UtilsService = require('./services/UtilsService');
            let year = moment().format('YY');
            let nextUniqueId = UtilsService.getNextUniqueId(user_unique_id);
            user_unique_id = config.get('uniqueCodePrefix')[user_role] + year +"_" + nextUniqueId;
            // Create hospital
            let values = {
                user_unique_id : user_unique_id,
                name : name,
                email : email,
                contact_number : contact_number,
                address : address,
                description : description,
                md_name : md_name,
                md_contact_number : md_contact_number,
                license : license,
                license_status : license_status,
                from_date : from_date,
                till_date : till_date,
                city_id :city_id ,
                state_id : state_id ,
                district_id : district_id ,
                country_id : country_id,
                created_by: req.user.id
            };
            let sql= pool.format(`insert into hospitals SET ? `, values);
            [rows]= await pool.query(sql);
            if(rows){
                res.send({rows :{ id : rows.insertId , status : 'Hospital Created'} });
            }
            else{
                return res.status(400).json({errors : 'Unable to create hospital'});
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json({errors : error});
        }
    });

  

    router.post('/create/admin',auth,[
        check('user_role' , 'Role is required').not().isEmpty(),
        check('first_name' , 'Name is required').not().isEmpty(),
        check('user_email' , 'Please include a valid email').isEmail(),
        check('user_mobile' , 'user_mobile is required').not().isEmpty(),
        check('address' , 'address is required').not().isEmpty(),
        check('description' , 'description is required').not().isEmpty(),
        check('hospital_id' , 'hospital_id is required').not().isEmpty(),
        check('status' , 'status is required').not().isEmpty(),
    ], async (req,res) =>{ 

        const errors= validationResult(req);

        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }

        let {
            user_role,
            user_unique_id,
            first_name,
            last_name,
            description,
            user_email,
            user_mobile,
            hospital_id, 
            address,
            status
        } = req.body;
        try {

            // Check hospital Exists;

            let rows, user_unique_id = null;
            [rows] =await poolReplica.query(`select id from hospitals where id=? limit 1`,[
                hospital_id
            ]) ;

            if(rows.length <= 0){
                // User already exists
                return res.status(400).json({errors : [ { message : 'Hospital dosent exist'}]});
            }

            // Check user already exists
            [rows] =await poolReplica.query(`select id from users where user_email=? limit 1`,[
                user_email
            ]) ;

            if(rows.length > 0){
                // User already exists
                return res.status(400).json({errors : [ { message : 'Email already taken'}]});
            }

            [rows] = await poolReplica.query(`select user_unique_id from users 
            where user_role=? order by id desc limit 1`,
            [ user_role ]);
            
            if(rows.length > 0){
                user_unique_id=  parseInt(rows[0].user_unique_id.split('_')[1]) + 1;
            }else{
                user_unique_id=  config.get('uniqueStartNumber') + 1;
            }

            const UtilsService = require('./services/UtilsService');
            let year = moment().format('YY');
            let nextUniqueId = UtilsService.getNextUniqueId(user_unique_id);
            user_unique_id = config.get('uniqueCodePrefix')[user_role] + year +"_" + nextUniqueId;

            // Create the user
            let values = {
                user_unique_id : user_unique_id,
                user_role : user_role,
                user_mobile : user_mobile ? user_mobile : null,
                user_email : user_email ? user_email : null,
                created_by: req.user.id
            };

            let sql= pool.format(`insert into users SET ? `, values);
            //console.log(sql);
            [rows]= await pool.query(sql);
            if(rows){
                let user_id = rows.insertId;
                [rows] = await poolReplica.query(`select id from roles where
                role_code=? limit 1`,
                [ config.get('uniqueCodePrefix')[user_role] ]);

                if(rows.length > 0){
                    // Map role to user
                    let values={
                        user_id : rows[0].insertId,
                        role_id : user_id,
                        created_by : req.user.id
                    }
                    let sql= pool.format(`insert into user_role SET ? `, values);
                    [rows]= await pool.query(sql);
                    if(rows){
                        // Map HA
                        let values = {
                            user_id : user_id ,
                            first_name : first_name ? first_name : null,
                            last_name : last_name ? last_name : null,
                            description : description ? description : null,
                            hospital_id : hospital_id ? hospital_id : null,
                            address: address,
                            status : status,
                            created_by: req.user.id
                        };
            
                        let sql= pool.format(`insert into hospital_admins SET ? `, values);
                        [rows]= await pool.query(sql);
                        if(rows){
                            //Send Email 
                        let nodemailer = require('nodemailer');
                        let smtpTransport = require('nodemailer-smtp-transport');

                        let transporter = nodemailer.createTransport(smtpTransport(config.get('smtp')));

                        const payload = {
                            id : user_id
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
                                        res.send({results :{ msg : 'HA Created' } });
                                    }
                                });  
                            });
                        }
                    }else{
                        return res.status(400).json({errors : 'Unable to create hospital'});
                    }
                }
                // Send SMS,
            }else{
                return res.status(400).json({errors : 'Unable to create user'});
            }
        } catch (errors) {
            console.error(errors);
            return res.status(400).json({errors : errors});
        }
    }
    );



    module.exports = router;