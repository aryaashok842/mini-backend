const mongoose = require('mongoose');

// Define the doctor schema
const cdoctorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, // Ensure email is unique
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'] // Email validation pattern
    },
    availableTime: { 
        type: String, // Use String to store time in a readable format
        required: true 
    },
    specialization: { 
        type: String, 
        required: true // Making it required, but you can change this as needed
    }
});

// Create the doctor model from the schema
var cdoctorModel = mongoose.model("CDoctor", cdoctorSchema);

// Export the model
module.exports = cdoctorModel;