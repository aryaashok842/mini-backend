const mongoose = require('mongoose');

// Define the schema for a hospital
const hospitalSchema = new mongoose.Schema({
  hospitalname: { 
    type: String, 
    required: true 
  },
  hphone: { 
    type: String, 
    required: true 
  },
  hplace: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Ensure email is unique
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 // Minimum length for password security
  }
});

// Use the 'hospitals' collection to store hospital data
const hospitalModel = mongoose.model("hospitals", hospitalSchema);

module.exports = { hospitalModel };
