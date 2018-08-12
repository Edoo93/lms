var mongoose = require ('mongoose');
var Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    },
});

module.exports = User = mongoose.model('users', userSchema);