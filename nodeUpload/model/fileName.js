const mongoose = require('mongoose')
const fileNameSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    }
})

const fileName = mongoose.model('fileName', fileNameSchema, 'fileName')

module.exports = fileName