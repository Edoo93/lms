const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load profile model
const Profile = require('../../models/Profile');

//Load user model
const User = require('../../models/User');

//Load Validation
const validateProfileInput = require('../../validation/profile');


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


// @route       POST /profile/handle/:handle
// @desc        get profile by handle
// @access      public
router.get('/handle/:handle', (req, res) =>{
    //Take the handle from the URL :handle and then use the mongoose findOne() function to 
    //Find the user by the handle
    //populate() method is used for retrieving user information from the USERS database collection
    //then() is used on asynchronous tasks, so when a profile is found that matches the handle
    //it returns found handle, 
    Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'email'])
    .then(profile =>{
        if(!profile){
            errors.noprofile = 'There is no profile with this handle';
            res.status(404).json(errors);
        }
        res.json(profile);
    }).catch(err => res.status(404).json(err));
});


router.get('asd/:pelle', (req, res) => {
    res.json(req.params.pelle);
});

// @route       POST /profile/user/:userid
// @desc        get profile by user:id
// @access      public
router.get('/user/:user_id', (req, res) =>{
    const errors = {};

    Profile.findOne({user: req.params.user_id})
    .populate('user', 'name')
    .then(profile =>{
        if(!profile){
            errors.noprofile = 'There is no profile with this id';
            res.status(404).json(errors);
        }
        res.json(profile);
    }).catch(err => res.status(404).json(err));
});

// @route       POST /profile/user/:userid
// @desc        get profile by user:id
// @access      public
router.get('/all', (req, res) =>{
    const errors = {};

    Profile.find()
    .populate('user', ['name', 'email'])
    .then(profile =>{
        if(!profile){
            errors.noprofile = 'There are no profiles';
            res.status(404).json(errors);
        }
        res.json(profile);
    }).catch(err => res.status(404).json(err));
});



// @route       POST api/profile
// @desc        create user profile route
// @access      private

//Passport is used to secure routes, so the route is only accessed with a jwt token
//
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) =>{

    const {errors, isValid} = validateProfileInput(req.body);


    //Check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    //Get fields
    //create a variable that will will have objects so we can then populate the database collection
    //profile with the fields
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

    //Experience split into an array
    profileFields.experience = {};

    if(req.body.title) profileFields.experience.title = req.body.title;
    if(req.body.company) profileFields.experience.company = req.body.company;
    if(req.body.from) profileFields.experience.from = req.body.from;
    if(req.body.location) profileFields.experience.location = req.body.location;
    if(req.body.description) profileFields.experience.description = req.body.description;

    //Must match database collection field of education (array) else it won't work
    profileFields.education = {};
    if(req.body.school) profileFields.education.school = req.body.school;
    if(req.body.degree) profileFields.education.degree = req.body.degree;
    if(req.body.fromm) profileFields.education.fromm = req.body.fromm;
    if(req.body.to) profileFields.education.to = req.body.to;
    if(req.body.descr) profileFields.education.descr = req.body.descr;
    if(req.body.current) profileFields.education.current = req.body.current;


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