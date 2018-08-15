const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load configs
const Keys = require('../../config/keys');
//Load user model
const User = require('../../models/User');

//Load input validation
const validateRegisterInput = require('../../validation/register');

// @route GET   api/users/test
// @desc        Test users route
// @access      public
router.get('/test', (req, res) => res.json({msg: "users works!"}));


// @route       POIST api/users/registration
// @desc        register users
// @access      public
router.post('/register', (req, res) =>{

    const {errors, isValid} = validateRegisterInput(req.body);


    //Check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }).then(user =>{
        if(user){
            errors.email = 'Email already exists';
            return res.status(400).json(errors);
        }else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
             bcrypt.genSalt(10, (err, salt) =>{
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err)); 
                })
             });
        }
    })
});

// @route GET   api/users/login
// @desc        login users / returning token
// @access      public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
        //Check if user exists
        if(!user){
            res.status(404).json({email: 'User not found'});
        }

        //Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            //If User matched
            if(isMatch){
                const payload = { id: user.id, name: user.name  } //Create JWT payload

                jwt.sign(payload, Keys.secret, { expiresIn: 7200 }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
            }else{
                return res.status(400).json({password: 'Password incorrect'});
            }
        })
    })
});

// @route GET   api/users/current
// @desc        return current token/user
// @access      private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;