const express = require('express');
const mongoose = require('mongoose');

const app = express();

const users = require('./routes/users');
const profile = require('./routes/profile');
const posts = require('./routes/posts');


//DB Config

const db = require('./config/keys').mongoURI;

//Connect to mongodb

mongoose.connect(db).then(() => console.log('mongodb connected')).catch(err => console.log(err));

app.get('/', (req, res) => res.send('hello world'));

app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server running on port: " + port ));