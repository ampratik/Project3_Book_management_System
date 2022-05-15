const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({

    title: { type: String, required: true, enum: ['Mr', 'Mrs', 'Miss'] },

    name: { type: String, required: true },

    phone: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, minlength: 8, maxlength: 15 },

   // isDeleted:{type:Boolean,default:false},
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String }
    }


}, { timestamps: true })



module.exports = mongoose.model('user', UserSchema)