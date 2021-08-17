const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    urls: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Url'
        }],
        default: []
    }
}, {
    toJSON: {
        transform: function (doc, user, options) {
            user.uid = user._id
            delete user._id
            delete user.__v
            delete user.password
            delete user.urls
            return user
        }
    }
})

module.exports = model('User', UserSchema)