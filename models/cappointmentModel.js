// const mongoose = require('mongoose');

// // Define the member schema for each booking
// const memberSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required.']
//   },
//   date: {
//     type: Date,
//     required: [true, 'Date is required.']
//   },
//   specialization: {
//     type: String,
//     required: [true, 'Specialization is required.']
//   },
//   doctor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'doctors',  // Refers to the 'doctors' collection/model
//     required: [true, 'Doctor is required.']
//   },
//   availableTime: {
//     type: String,
//     required: [true, 'Available Time is required.']
//   }
// });

// // Define the appointment booking schema
// const appointmentSchema = new mongoose.Schema({
//   members: [memberSchema]  // Array of members in a single booking
// });

// // Create the appointment booking model
// const appointmentModel = mongoose.model('AppointmentBooking', appointmentSchema);

// module.exports = { appointmentModel };
const mongoose = require('mongoose');

const cappointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    doctorId: { type: String, required: true },
    time: { type: String, required: true }, // Ensure time is included here
    appointmentDate: { type: Date, required: true },
    status: { type: String, default: 'Pending' }
});

const Cappointment = mongoose.model('CAppointment', cappointmentSchema);

module.exports = Cappointment; // Ensure you're exporting the model correctly
