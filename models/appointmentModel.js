const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    doctorId: { type: String, required: true },
    time: { type: String, required: true }, // Ensure time is included here
    appointmentDate: { type: Date, required: true },
    status: { type: String, default: 'Pending' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; // Ensure you're exporting the model correctly
