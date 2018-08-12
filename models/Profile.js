var mongoose = require ('mongoose');
var Schema = mongoose.Schema;


const ProfileSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'profile'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    github: {
        type: String
    },
    experience: [
        {
            title: {
                type: String,
                required: true,
            },
            company: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            date:{
              type: Date,  
            },
            location: {
                type: String,   
            },
            description: {
                type: String
            }
        },
    ],
    education: [
        {
            school: {
                type: String,
                required: true,
            },
            degree: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
              type: Date,  
            },
            current: {
                type: String,   
            },
            description: {
                type: String
            }
        },
    ],
    social: [
        {
            youtube: {
                type: String
            },
            twitter: {
                type: String
            },
            linkedin: {
                type: String
            },
            instagram: {
                type: String,  
            }
        },
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('profile', ProfileSchema);