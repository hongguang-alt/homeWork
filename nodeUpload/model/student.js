const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sid: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    ctime: {
        type: Date,
        default: Date.now(),
        required: true
    },
    fileName: {
        type: String
    }
})

const Student = mongoose.model('student', studentSchema, 'student')

module.exports = Student