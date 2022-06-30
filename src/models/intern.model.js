const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Intern name is required',
        trim:true,
        lowercase:true
    },
    email: {
        type:String,
        required: 'Email is required',
        unique: true,
        trim:true,
        lowercase:true
    },
    mobile: {
        type:Number,
        required: 'Mobile number is required',
        unique: true,
        trim:true
    },
    collegeId: {
        type: ObjectId,
        ref: "college",
        trim:true
    },
    isDeleted: {
        type:Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("intern", internSchema)