const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');

const app = express();

//Routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


//Body parser

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//DB Config

const db = require('./config/keys').mongoURI;

//Connect to mongodb
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => 
        console.log('mongodb connected'))    
    .catch(err => 
        console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);

app.get('/', (req, res) => res.send('hello world'));

//route to /api/routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

//Port for heroku or port 5000
const port = process.env.PORT || 5000;

//start server on this port
app.listen(port, () => console.log("Server running on port: " + port ));