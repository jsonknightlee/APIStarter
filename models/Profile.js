const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    handle: {
        type: String,
        require: true,
        max: 30
    },
    jobTitle: {
        type: String
    },
    gender: {
        type: String
    },
    dateofbirth: {
        type: String
    },
    company: {
        type: String
    },
    status: {
        type: String
    },
    location: {
        country: {
            type: String
        },
        province: {
            type: String
        },
        city: {
            type: String
        },
        zipcode: {
            type: String
        }
    },
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: String,
        default: Date.now
    },
    bio: {
        type: String,
        default: "This is my bio",
        require: true
    },
    business: {
        type: Boolean,
        default: false
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);