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
     * @apiParam        {String} user_first_name Hospital Name mapped from here ex: Apollo
     * @apiParam        {String} user_email
     * @apiParam        {String} address
     * @apiParam        {String} description
     * @apiParam        {String} owner_name
     * @apiParam        {String} owner_mobile
     * @apiParam        {Number} country_id
     * @apiParam        {Number} state_id
     * @apiParam        {Number} district_id
     * @apiParam        {Number} city_id
     * @apiParamExample {json} Request-Example:
     * {
            "user_first_name":"Appolo Cradle",
            "user_email":"sabarish30121@gmail.com",
            "user_mobile":"233223223",
            "address":"2323",
            "description":"232332323 desc",
            "owner_name":"Sabarish",
            "owner_mobile":"98989989898",
            "city_id":"1",
            "state_id":"1",
            "district_id":"1",
            "country_id":"1",
            "user_role" :"HOSPITAL"
        }
     * @access Private
     * */

    router.post('/create',auth,[
        check('user_role' , 'Role is required').not().isEmpty(),
        check('user_first_name' , 'Name is required').not().isEmpty(),
        check('user_email' , 'Please include a valid email').isEmail(),
        check('user_mobile' , 'user_mobile is required').not().isEmpty(),
        check('address' , 'address is required').not().isEmpty(),
        check('description' , 'description is required').not().isEmpty(),
        check('owner_name' , 'owner_name is required').not().isEmpty(),
        check('owner_mobile' , 'owner_mobile is required').not().isEmpty(),
        check('city_id' , 'city_id is required').not().isEmpty(),
        check('state_id' , 'state_id is required').not().isEmpty(),
        check('district_id' , 'district_id is required').not().isEmpty(),
        check('country_id' , 'country_id is required').not().isEmpty(),
        check('license' , 'license is required').not().isEmpty(),
        check('license_status' , 'license_status is required').not().isEmpty(),
        check('hospital_from_date' , 'hospital_from_date is required').not().isEmpty().toDate(),
        check('hospital_till_date' , 'hospital_till_date is required').not().isEmpty().toDate()
    ], async (req,res) =>{ 

        const errors= validationResult(req);

        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
    
        let {user_role,user_unique_id,user_first_name,user_password,user_mobile,user_email,address,description,owner_name,owner_mobile,city_id,state_id,district_id,country_id,
          license,
           license_status,
           hospital_from_date,
           hospital_till_date,
        } = req.body;
        try {
            // Check user already exists
            let rows, user_unique_id = null;
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

            user_unique_id = config.get('uniqueCodePrefix')[user_role] + "_" + user_unique_id.toString();

            //console.log(user_unique_id);

            // Create the user

            let values = {
                user_unique_id : user_unique_id,
                user_first_name : user_first_name ? user_first_name: null,
                user_role : user_role,
                user_password: null, // For Hospital Creation no need for Password
                user_mobile : user_mobile ? user_mobile : null,
                user_email : user_email ? user_email : null,
                address : address ? address : null,
                description : description ? description : null,
                owner_name : owner_name ,
                owner_mobile : owner_mobile ,
                city_id :city_id ,
                state_id : state_id ,
                district_id : district_id ,
                country_id : country_id,
                created_by: req.user.id
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
                        created_by : req.user.id
                    }
                    let sql= pool.format(`insert into user_role SET ? `, values);
                    [rows]= await pool.query(sql);
                    if(rows){
                        // Map License to Hospital 

                        let values = {
                            user_id : results.insertId ,
                            hospital_name : user_first_name,
                            user_email : user_email,
                            hospital_description : description,
                            license : license,
                            license_status : license_status,
                            hospital_from_date : hospital_from_date,
                            hospital_till_date : hospital_till_date,
                            created_by: req.user.id
                        };
            
                        let sql= pool.format(`insert into hospitals SET ? `, values);
                        [rows]= await pool.query(sql);
                        if(rows){
                            res.send({results :{ user_id : results.insertId , status : 'Hospital Created'} });
                        }
                    }else{
                        return res.status(400).json({errors : 'Unable to create hospital'});
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
    }
    );

    /**
     * Branch Create
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} / Create Branch
     * @apiName 		Create branch
     * @apiGroup 		Hospital
     * @apiDescription  Create and Map Branches to hospital , Roles ex: Super Admin
     *                  
     *
     * @apiPermission 	Nones
     * @access Private
     * */

    router.post('/createadmin',auth,[
        check('user_role' , 'Role is required').not().isEmpty(),
        check('user_first_name' , 'Name is required').not().isEmpty(),
        check('user_email' , 'Please include a valid email').isEmail(),
        check('user_mobile' , 'user_mobile is required').not().isEmpty(),
        check('address' , 'address is required').not().isEmpty(),
        check('description' , 'description is required').not().isEmpty(),
        check('owner_name' , 'owner_name is required').not().isEmpty(),
        check('owner_mobile' , 'owner_mobile is required').not().isEmpty(),
        check('city_id' , 'city_id is required').not().isEmpty(),
        check('state_id' , 'state_id is required').not().isEmpty(),
        check('district_id' , 'district_id is required').not().isEmpty(),
        check('country_id' , 'country_id is required').not().isEmpty(),
        check('license' , 'license is required').not().isEmpty(),
        check('license_status' , 'license_status is required').not().isEmpty(),
        check('hospital_from_date' , 'hospital_from_date is required').not().isEmpty().toDate(),
        check('hospital_till_date' , 'hospital_till_date is required').not().isEmpty().toDate()
    ], async (req,res) =>{ 

        const errors= validationResult(req);

        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
    
        let {user_role,user_unique_id,user_first_name,user_password,user_mobile,user_email,address,description,owner_name,owner_mobile,city_id,state_id,district_id,country_id,
          license,
           license_status,
           hospital_from_date,
           hospital_till_date,
        } = req.body;
        try {
            // Check user already exists
            let rows, user_unique_id = null;
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

            user_unique_id = config.get('uniqueCodePrefix')[user_role] + "_" + user_unique_id.toString();

            //console.log(user_unique_id);

            // Create the user

            let values = {
                user_unique_id : user_unique_id,
                user_first_name : user_first_name ? user_first_name: null,
                user_role : user_role,
                user_password: null, // For Hospital Creation no need for Password
                user_mobile : user_mobile ? user_mobile : null,
                user_email : user_email ? user_email : null,
                address : address ? address : null,
                description : description ? description : null,
                owner_name : owner_name ,
                owner_mobile : owner_mobile ,
                city_id :city_id ,
                state_id : state_id ,
                district_id : district_id ,
                country_id : country_id,
                created_by: req.user.id
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
                        created_by : req.user.id
                    }
                    let sql= pool.format(`insert into user_role SET ? `, values);
                    [rows]= await pool.query(sql);
                    if(rows){
                        // Map License to Hospital 

                        let values = {
                            user_id : results.insertId ,
                            hospital_name : user_first_name,
                            user_email : user_email,
                            hospital_description : description,
                            license : license,
                            license_status : license_status,
                            hospital_from_date : hospital_from_date,
                            hospital_till_date : hospital_till_date,
                            created_by: req.user.id
                        };
            
                        let sql= pool.format(`insert into hospitals SET ? `, values);
                        [rows]= await pool.query(sql);
                        if(rows){
                            res.send({results :{ user_id : results.insertId , status : 'Hospital Created'} });
                        }
                    }else{
                        return res.status(400).json({errors : 'Unable to create hospital'});
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
    }
    );

    /**
     * Hospital Admin Creation
     * 
     * @param {object} req The request object
     * @param {object} res The response object
     * @author Sabarish <sabarish3012@gmail.com>
     * 
     * @api 			{post} / Create or Register a Hospital admin
     * @apiName 		Register a Hospital ADMIN
     * @apiGroup 		Hospital
     * @apiDescription  Create or Register a Hospital for all the Mypulse Roles ex: Super Admin
     *                  
     *
     * @apiPermission 	None
     * @access Public
     * */

    router.post('/createadmin',auth,[
        check('user_role' , 'Role is required').not().isEmpty(),
        check('user_first_name' , 'Name is required').not().isEmpty(),
        check('user_email' , 'Please include a valid email').isEmail(),
        check('user_mobile' , 'user_mobile is required').not().isEmpty(),
        check('address' , 'address is required').not().isEmpty(),
        check('description' , 'description is required').not().isEmpty(),
        check('owner_name' , 'owner_name is required').not().isEmpty(),
        check('owner_mobile' , 'owner_mobile is required').not().isEmpty(),
        check('city_id' , 'city_id is required').not().isEmpty(),
        check('state_id' , 'state_id is required').not().isEmpty(),
        check('district_id' , 'district_id is required').not().isEmpty(),
        check('country_id' , 'country_id is required').not().isEmpty(),
        check('license' , 'license is required').not().isEmpty(),
        check('license_status' , 'license_status is required').not().isEmpty(),
        check('hospital_from_date' , 'hospital_from_date is required').not().isEmpty().toDate(),
        check('hospital_till_date' , 'hospital_till_date is required').not().isEmpty().toDate()
    ], async (req,res) =>{ 

        const errors= validationResult(req);

        if(!errors.isEmpty()){
            console.error(errors);
            return res.status(400).json({errors : errors.array()});
        }
    
        let {user_role,user_unique_id,user_first_name,user_password,user_mobile,user_email,address,description,owner_name,owner_mobile,city_id,state_id,district_id,country_id,
          license,
           license_status,
           hospital_from_date,
           hospital_till_date,
        } = req.body;
        try {
            // Check user already exists
            let rows, user_unique_id = null;
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

            user_unique_id = config.get('uniqueCodePrefix')[user_role] + "_" + user_unique_id.toString();

            //console.log(user_unique_id);

            // Create the user

            let values = {
                user_unique_id : user_unique_id,
                user_first_name : user_first_name ? user_first_name: null,
                user_role : user_role,
                user_password: null, // For Hospital Creation no need for Password
                user_mobile : user_mobile ? user_mobile : null,
                user_email : user_email ? user_email : null,
                address : address ? address : null,
                description : description ? description : null,
                owner_name : owner_name ,
                owner_mobile : owner_mobile ,
                city_id :city_id ,
                state_id : state_id ,
                district_id : district_id ,
                country_id : country_id,
                created_by: req.user.id
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
                        created_by : req.user.id
                    }
                    let sql= pool.format(`insert into user_role SET ? `, values);
                    [rows]= await pool.query(sql);
                    if(rows){
                        // Map License to Hospital 

                        let values = {
                            user_id : results.insertId ,
                            hospital_name : user_first_name,
                            user_email : user_email,
                            hospital_description : description,
                            license : license,
                            license_status : license_status,
                            hospital_from_date : hospital_from_date,
                            hospital_till_date : hospital_till_date,
                            created_by: req.user.id
                        };
            
                        let sql= pool.format(`insert into hospitals SET ? `, values);
                        [rows]= await pool.query(sql);
                        if(rows){
                            res.send({results :{ user_id : results.insertId , status : 'Hospital Created'} });
                        }
                    }else{
                        return res.status(400).json({errors : 'Unable to create hospital'});
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
    }
    );



    module.exports = router;