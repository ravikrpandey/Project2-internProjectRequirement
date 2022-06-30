const mongoose = require("mongoose")

const collegeSchema = new mongoose.Schema({
    name: {                                      //example iith
        type: String,
        unique: true,
        required: 'College name is required',
        trim: true,
        lowercase:true
    },
    fullName: {                               //`Indian Institute of Technology, Hyderabad`
        type: String,
        require: 'Fullname is required',
        trim: true,
        lowercase:true
    },
    logoLink: {
        type: String,
        required: 'Logolink is required',
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('college', collegeSchema)