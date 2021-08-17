const { Schema, model } = require('mongoose')

const URLSchema = new Schema({
    urlCode: {
        type: String,
        unique: true,
        required: true
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform: function (doc, url, options) {
            url.uid = url._id
            delete url._id
            delete url.__v
            return url
        }
    }
})

module.exports = model('Url', URLSchema)