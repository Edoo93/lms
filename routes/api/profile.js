const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Validation
const validateProfileInput = require('../../validation/profile');


//Load profile model
const Profile = require('../../models/Profile');

//Load user model
const User = require('../../models/User');

// @route GET   api/profile/test
// @desc        Test profile route
// @access      public
router.get('/test', (req, res) => res.json({msg: "profile works!"}));

// @route GET   api/profile
// @desc        profile route
// @access      private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) =>{
    const errors = {};
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route       POST api/profile
// @desc        create user profile route
// @access      private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>{


    //THIS IS THE VALIDATOR THAT HAS BEEN CREATED, DO THIS IN THE BEGINNING OF A ROUTE TO CHECK THE RESPONSE
    //IF IT IS VALID OR NOT, ELSE RETURN A STATUS 400 WITH THE ERROR MESSAGE


    //Get fields
    const profileFields = {};

    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.github) profileFields.github = req.body.github;

    //Skills split into an array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }

    //Social split into an array
    profileFields.social = {};

    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id}).then(profile => {
        if(profile){
            //Update profile
            Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true}).then(profile => res.json(profile));
        }else{
            //Create profile

            //Check if handle exist
            Profile.findOne({handle: profileFields.handle}).then(profile => {
                if(profile){
                    errors.handle = 'That handle already exists';
                    res.status(400).json(errors);
                }

                //Save profile
                new Profile(profileFields).save().then(profile => res.json(profile));
            })
        }
    });
});


module.exports = router;