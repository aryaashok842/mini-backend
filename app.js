const express= require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userModel = require('./models/userModel')
const adminModel = require('./models/adminModel')
 

const hospitalModel = require('./models/hospital'); // Ensure the correct import
const doctorModel = require('./models/doctorModel')
const cdoctorModel = require('./models/cdoctorModel')
const Appointment = require('./models/appointmentModel')
const Cappointment = require('./models/cappointmentModel')
const bodyParser = require('body-parser');
const feedback = require('./models/feedback')



let app=express()   
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());


mongoose.connect("mongodb+srv://aryaashok842:radhaashok%40123@cluster0.aw45g.mongodb.net/hospitalapp?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log('Connectted')).catch(()=>console.log('Connectionn failed'))


//bookslot

//view appointment(care)

app.get('/cappointments', async (req, res) => {
    const { userId } = req.query; // Retrieve the userId from req.query
    try {
        const cappointments = await Cappointment.find({ userId }).populate('doctorId', 'name specialization');
        res.json({ status: 'success', data: cappointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

//view appointments(ktpb)


app.get('/appointments', async (req, res) => {
    const { userId } = req.query; // Retrieve the userId from req.query
    try {
        const appointments = await Appointment.find({ userId }).populate('doctorId', 'name specialization');
        res.json({ status: 'success', data: appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});



//book ktpb
app.post('/book', async (req, res) => {
    try {
        const { userId, doctorId, appointmentDate, time } = req.body; // Added time here

        // Log the incoming data for debugging
        console.log({ userId, doctorId, appointmentDate, time });

        const newAppointment = new Appointment({
            userId: userId || '', // Handle the 'undefined' case
            doctorId,
            appointmentDate,
            time, // Include time in the appointment model
            
        });

        await newAppointment.save();
        res.status(201).json({ status: 'success', message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ status: 'error', message: 'An error occurred while booking the appointment.' });
    }
});

// app.post('/book', async (req, res) => {
//     try {
//         const { userId, doctorId, appointmentDate, time } = req.body;

//         // Log incoming data for debugging
//         console.log("Received booking request:", { userId, doctorId, appointmentDate, time });

//         // Check for missing fields and respond with a 400 status if any are missing
//         if (!userId || !doctorId || !appointmentDate || !time) {
//             return res.status(400).json({ status: 'fail', message: 'Missing required fields. Ensure userId, doctorId, appointmentDate, and time are provided.' });
//         }

//         // Create a new appointment
//         const newAppointment = new Appointment({
//             userId,
//             doctorId,
//             appointmentDate,
//             time,
//         });

//         // Save to the database and respond with success
//         await newAppointment.save();
//         res.status(201).json({ status: 'success', message: 'Appointment booked successfully!' });
//     } catch (error) {
//         console.error("Error booking appointment:", error.stack); // Log error stack for trace
//         res.status(500).json({ status: 'error', message: 'An error occurred while booking the appointment.' });
//     }
// });




//carebook

app.post('/cbook', async (req, res) => {
    try {
        const { userId, doctorId, appointmentDate, time } = req.body; // Added time here

        // Log the incoming data for debugging
        console.log({ userId, doctorId, appointmentDate, time });

        const newCappointment = new Cappointment({
            userId: userId || '', // Handle the 'undefined' case
            doctorId,
            appointmentDate,
            time, // Include time in the appointment model
            
        });

        await newCappointment.save();
        res.status(201).json({ status: 'success', message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ status: 'error', message: 'An error occurred while booking the appointment.' });
    }
});


//delete booked users
// Delete appointment endpoint
app.delete('/appointments/:id', async (req, res) => {
    const { id } = req.params; // Get the appointment ID from request parameters
    try {
        await Appointment.findByIdAndDelete(id);
        res.json({ status: 'success', message: 'Appointment deleted successfully!' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ status: 'error', message: 'An error occurred while deleting the appointment.' });
    }
});








//delete user

app.post("/delete",(req,res)=>{
    let input=req.body
    userModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    ).finally()
    

})

//delete doctor

app.post("/deletedoctor",(req,res)=>{
    let input=req.body
    doctorModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    ).finally()
    

})

app.post("/deletecdoctor",(req,res)=>{
    let input=req.body
    cdoctorModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    ).finally()
    

})


//delete doctor

app.post("/deletedoctor",(req,res)=>{
    let token=req.headers["token"]
    let input=req.body
    jwt.verify(token,"hospital app",(error,decoded)=>{
        if(error)
            {
                res.json({"status":"unauthorised access"})
            }
            else{
                if(decoded){
                    doctorModel.findByIdAndDelete(input._id).then(
                    (response)=>{
                        res.json(response)
                    }
                ).catch().finally()

            }
        }
    })
   

})


//view users
app.get("/view",(req,res)=>{
    userModel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    ).finally()
})




 

app.post("/addhospital",(req,res)=>{

    let input=req.body
    let hospital=new hospitalmodel(input)
    vazhipad.save()
    res.json({"status":"success"})
})


app.get("/viewhospital",(req,res)=>{
    hospitalmodel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    ).finally()
})




app.post("/search",(req,res)=>{
    let input = req.body
    userModel.find(input).then(
        (data)=>{
            res.json(data)

        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})

//delete users


app.post("/delete",(req,res)=>{
    let input=req.body
    userModel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    ).finally()
    

})

// Update user by ID




//view users
app.get("/view",(req,res)=>{
    userModel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    ).finally()
})

//delete users

app.post("/delete",(req,res)=>{
    let token=req.headers["token"]
    let input=req.body
    jwt.verify(token,"hospital app",(error,decoded)=>{
        if(error)
            {
                res.json({"status":"unauthorised access"})
            }
            else{
                if(decoded){
                    userModel.findByIdAndDelete(input._id).then(
                    (response)=>{
                        res.json(response)
                    }
                ).catch().finally()

            }
        }
    })
   

})



// user signin
// app.post("/signIn", async (req, res) => {
//     let input = req.body;

//     userModel.find({ email: req.body.email }).then((items) => {
//         if (items.length > 0) {
//             const passwordValidator = bcrypt.compareSync(req.body.password, items[0].password);
//             if (passwordValidator) {
//                 jwt.sign({ email: req.body.email }, "hospitalapp", { expiresIn: "1d" }, (error, token) => {
//                     if (error) {
//                         res.json({ "status": "error", "errorMessage": error });
//                     } else {
//                         // Send username along with token and userId
//                         res.json({ 
//                             "status": "success", 
//                             "token": token, 
//                             "username": items[0].name // Assuming the user model has a 'name' field
//                         });
//                     }
//                 });
//             } else {
//                 res.json({ "status": "Incorrect password" });
//             }
//         } else {
//             res.json({ "status": "Invalid email id" });
//         }
//     }).catch((err) => {
//         res.json({ "status": "error", "errorMessage": err.message });
//     });
// });


// app.js (login backend)

app.post("/signIn", async (req, res) => {
    let input = req.body;

    userModel.find({ email: req.body.email }).then((items) => {
        if (items.length > 0) {
            const passwordValidator = bcrypt.compareSync(req.body.password, items[0].password);
            if (passwordValidator) {
                jwt.sign({ email: req.body.email }, "hospitalapp", { expiresIn: "1d" }, (error, token) => {
                    if (error) {
                        res.json({ "status": "error", "errorMessage": error });
                    } else {
                        // Send username, email, and token in the response
                        res.json({ 
                            "status": "success", 
                            "token": token, 
                            "username": items[0].name, 
                            "email": items[0].email // Include the email in the response
                        });
                    }
                });
            } else {
                res.json({ "status": "Incorrect password" });
            }
        } else {
            res.json({ "status": "Invalid email id" });
        }
    }).catch((err) => {
        res.json({ "status": "error", "errorMessage": err.message });
    });
});


//signup
app.post("/signUp", async (req, res) => {
    try {
        let input = req.body;
        
        // Hash the password
        let hashedPassword = bcrypt.hashSync(input.password, 10);
        input.password = hashedPassword;
        
        // Check if the email already exists
        let existingUser = await userModel.findOne({ email: input.email });
        
        if (existingUser) {
            // Email already exists
            return res.status(400).json({ "status": "email id already exists" });
        }
        
        // Save the new user
        let newUser = new userModel(input);
        await newUser.save();
        
        // Successfully created
        res.status(201).json({ "status": "success" });
    } catch (error) {
        // Error handling
        console.error("Error during signup:", error);
        res.status(500).json({ "status": "error", "message": "Internal server error" });
    }
});



app.post("/adminlogin", (req, res) => {
    let input = req.body;

    // Default admin credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    // Check if the input matches admin credentials
    if (input.email === adminEmail && input.password === adminPassword) {
        // Admin login successful
        jwt.sign({ email: input.email }, "laundryapp", { expiresIn: "1d" }, (error, token) => {
            if (error) {
                res.json({ "status": "Token credentials failed" });
            } else {
                res.json({ "status": "success", "token": token, "message": "Admin logged in successfully" });
            }
        });
    } else {
        // Check if the user exists in the database
        adminModel.find({ name: input.name }).then((response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password);
                if (validator) {
                    // User login successful
                    jwt.sign({ email: input.email}, "hospitalapp", { expiresIn: "1d" }, (error, token) => {
                        if (error) {
                            res.json({ "status": "Token credentials failed" });
                        } else {
                            res.json({ "status": "success", "token": token });
                        }
                    });
                } else {
                    res.json({ "status": "Wrong password" });
                }
            } else {
                res.json({ "status": "Username doesn't exist" });
            }
        }).catch((err) => {
            res.json({ "status": "Error occurred", "error": err.message });
        });
    }
}); 
//Add DOCTOR
app.post("/adddoctor", async (req, res) => {
    console.log("Received add doctor request");
    try {
        const { name, email, availableTime, specialization } = req.body;

        // Basic validation for required fields
        if (!name || !email || !availableTime || !specialization) {
            return res.status(400).json({ status: "error", message: "All fields are required." });
        }

        // Check if the doctor already exists (based on email)
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(409).json({ status: "error", message: "A doctor with this email already exists." });
        }

        // Save the new doctor
        const newDoctor = new doctorModel({
            name,
            email,
            availableTime,
            specialization
        });

        await newDoctor.save();
        res.status(201).json({ status: "success", message: "Doctor added successfully." });

    } catch (error) {
        console.error("Error during doctor registration:", error);
        res.status(500).json({ status: "error", message: "An internal error occurred. Please try again later." });
    }
});

//add care doctor
//Add DOCTOR
app.post("/addCdoctor", async (req, res) => {
    console.log("Received add doctor request");
    try {
        const { name, email, availableTime, specialization } = req.body;

        // Basic validation for required fields
        if (!name || !email || !availableTime || !specialization) {
            return res.status(400).json({ status: "error", message: "All fields are required." });
        }

        // Check if the doctor already exists (based on email)
        const existingDoctor = await cdoctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(409).json({ status: "error", message: "A doctor with this email already exists." });
        }

        // Save the new doctor
        const newDoctor = new cdoctorModel({
            name,
            email,
            availableTime,
            specialization
        });

        await newDoctor.save();
        res.status(201).json({ status: "success", message: "Doctor added successfully." });

    } catch (error) {
        console.error("Error during doctor registration:", error);
        res.status(500).json({ status: "error", message: "An internal error occurred. Please try again later." });
    }
});

//view doctors
app.get("/viewdoctors", async (req, res) => {
    try {
        // Fetch all doctors from the database
        const doctors = await doctorModel.find({});
        res.status(200).json({ status: "success", data: doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ status: "error", message: "An internal error occurred. Please try again later." });
    }
});



//view care 
app.get("/viewCdoctor", async (req, res) => {
    try {
        // Fetch all doctors from the database
        const doctors = await cdoctorModel.find({});
        res.status(200).json({ status: "success", data: doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ status: "error", message: "An internal error occurred. Please try again later." });
    }
});

//feedback

// // Feedback submission route
// app.post('/submitFeedback', async (req, res) => {
//     const { email, comment, rating } = req.body;
//     const loggedInEmail = req.body.loggedInEmail; // Assuming frontend sends loggedInEmail

//     // Check if the email matches the logged-in user's email
//     if (email !== loggedInEmail) {
//         return res.status(400).json({ message: 'Email does not match the logged-in user.' });
//     }

//     try {
//         const newFeedback = new Feedback({ email, comment, rating });
//         await newFeedback.save();
//         res.status(201).json({ message: 'Feedback submitted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// });

// Feedback submission route
// Feedback submission route

app.post('/submitFeedback', async (req, res) => {
    const { email, comment, rating } = req.body;
    const loggedInEmail = req.body.email; // Ideally, this should come from a session or token

    // Validate email
    if (!loggedInEmail || email !== loggedInEmail) {
        return res.status(400).json({ message: 'Email does not match the logged-in user.' });
    }

    try {
        // Create and save the feedback
        const newFeedback = new feedback({ email, comment, rating });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error('Error saving feedback:', err); // Enhanced error logging
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


//viewfeedback
app.get("/viewfeedback", async (req, res) => {
    try {
        // Fetch all doctors from the database
        const feed = await feedback.find({});
        res.status(200).json({ status: "success", data: feed });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ status: "error", message: "An internal error occurred. Please try again later." });
    }
});

 // hospital signin
app.post("/hospitalSignIn", async (req, res) => {
    console.log("hiii")
    let input = req.body;

    hospitalModel.find({ email: req.body.email }).then((items) => {
        if (items.length > 0) {
            const passwordValidator = bcrypt.compareSync(req.body.password, items[0].password);
            if (passwordValidator) {
                jwt.sign({ email: req.body.email }, "hospitalSignIn", { expiresIn: "1d" }, (error, token) => {
                    if (error) {
                        res.json({ "status": "error", "errorMessage": error });
                    } else {
                        // Send username along with token and userId
                        res.json({ 
                            "status": "success", 
                            "token": token, 
                            "username": items[0].name // Assuming the user model has a 'name' field
                        });
                    }
                });
            } else {
                res.json({ "status": "Incorrect password" });
            }
        } else {
            res.json({ "status": "Invalid email id" });
        }
    }).catch((err) => {
        res.json({ "status": "error", "errorMessage": err.message });
    });
});

//ktpb login(admin)

app.post("/ktpbLogin", (req, res) => {
    let input = req.body;

    // Default admin credentials
    const adminEmail = 'ktpb@gmail.com';
    const adminPassword = 'ktpb123';

    // Check if the input matches admin credentials
    if (input.email === adminEmail && input.password === adminPassword) {
        // Admin login successful
        jwt.sign({ email: input.email }, "hospitalapp", { expiresIn: "1d" }, (error, token) => {
            if (error) {
                res.json({ "status": "Token credentials failed" });
            } else {
                res.json({ "status": "success", "token": token, "message": "Admin logged in successfully" });
            }
        });
    } else {
        // Check if the user exists in the database
        adminModel.find({ name: input.name }).then((response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password);
                if (validator) {
                    // User login successful
                    jwt.sign({ email: input.email}, "hospitalapp", { expiresIn: "1d" }, (error, token) => {
                        if (error) {
                            res.json({ "status": "Token credentials failed" });
                        } else {
                            res.json({ "status": "success", "token": token });
                        }
                    });
                } else {
                    res.json({ "status": "Wrong password" });
                }
            } else {
                res.json({ "status": "Username doesn't exist" });
            }
        }).catch((err) => {
            res.json({ "status": "Error occurred", "error": err.message });
        });
    }
}); 
 
//care login(admin)
app.post("/carelogin", (req, res) => {
    let input = req.body;

    // Default admin credentials
    const adminEmail = 'care@gmail.com';
    const adminPassword = 'care123';

    // Check if the input matches admin credentials
    if (input.email === adminEmail && input.password === adminPassword) {
        // Admin login successful
        jwt.sign({ email: input.email }, "hospitalapp", { expiresIn: "1d" }, (error, token) => {
            if (error) {
                res.json({ "status": "Token credentials failed" });
            } else {
                res.json({ "status": "success", "token": token, "message": "Admin logged in successfully" });
            }
        });
    } else {
        // Check if the user exists in the database
        cdoctorModel.find({ name: input.name }).then((response) => {
            if (response.length > 0) {
                const validator = bcrypt.compareSync(input.password, response[0].password);
                if (validator) {
                    // User login successful
                    jwt.sign({ email: input.email}, "hospitalapp", { expiresIn: "1d" }, (error, token) => {
                        if (error) {
                            res.json({ "status": "Token credentials failed" });
                        } else {
                            res.json({ "status": "success", "token": token });
                        }
                    });
                } else {
                    res.json({ "status": "Wrong password" });
                }
            } else {
                res.json({ "status": "Username doesn't exist" });
            }
        }).catch((err) => {
            res.json({ "status": "Error occurred", "error": err.message });
        });
    }
}); 

//ktpb booking

// app.post('/appointmentbooking', async (req, res) => {
//     try {
//       const members = req.body.members;
  
//       // Validate members array
//       if (!members || !Array.isArray(members) || members.length === 0) {
//         return res.status(400).json({ status: 'error', message: 'Invalid members data' });
//       }
  
//       // Validate each member object
//       const validatedMembers = members.map(member => {
//         if (!member.name) throw new Error('Name is required.');
//         if (!member.specialization) throw new Error('Specialization is required.');
//         if (!member.doctor) throw new Error('Doctor is required.');
//         if (!member.availableTime) throw new Error('Available Time is required.');
  
//         const parsedDate = new Date(member.date);
//         if (isNaN(parsedDate)) throw new Error('Invalid Date format.');
  
//         return {
//           name: member.name,
//           specialization: member.specialization,
//           date: parsedDate,
//           doctor: new mongoose.Types.ObjectId(member.doctor),
//           availableTime: member.availableTime
//         };
//       });
  
//       // Create a new booking with the validated members
//       const newBooking = new appointmentModel({
//         members: validatedMembers
//       });
  
//       await newBooking.save();
  
//       console.log("New booking created:", newBooking);
//       res.status(201).json({ status: 'success', message: 'Booking created successfully', booking: newBooking });
//     } catch (error) {
//       console.error('Error creating booking:', error.message);
//       res.status(400).json({ status: 'error', message: `Error creating booking: ${error.message}` });
//     }
//   });
  
  
//CARE BOOKING


// app.post('/appointmentbooking', async (req, res) => {
//     try {
//       const members = req.body.members;
  
//       // Validate members array
//       if (!members || !Array.isArray(members) || members.length === 0) {
//         return res.status(400).json({ status: 'error', message: 'Invalid members data' });
//       }
  
//       // Validate each member object
//       const validatedMembers = members.map(member => {
//         if (!member.name) throw new Error('Name is required.');
//         if (!member.specialization) throw new Error('Specialization is required.');
//         if (!member.doctor) throw new Error('Doctor is required.');
//         if (!member.availableTime) throw new Error('Available Time is required.');
  
//         const parsedDate = new Date(member.date);
//         if (isNaN(parsedDate)) throw new Error('Invalid Date format.');
  
//         return {
//           name: member.name,
//           specialization: member.specialization,
//           date: parsedDate,
//           doctor: new mongoose.Types.ObjectId(member.doctor),
//           availableTime: member.availableTime
//         };
//       });
  
//       // Create a new booking with the validated members
//       const newBooking = new appointmentModel({
//         members: validatedMembers
//       });
  
//       await newBooking.save();
  
//       console.log("New booking created:", newBooking);
//       res.status(201).json({ status: 'success', message: 'Booking created successfully', booking: newBooking });
//     } catch (error) {
//       console.error('Error creating booking:', error.message);
//       res.status(400).json({ status: 'error', message: `Error creating booking: ${error.message}` });
//     }
//   });
 

app.listen(3032,()=>{
    console.log("server started")
})
