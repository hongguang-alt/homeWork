const mongoose = require('mongoose')
const fileNameSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: false
    }
})

const fileName = mongoose.model('fileName', fileNameSchema, 'fileName')

module.exports = fileName