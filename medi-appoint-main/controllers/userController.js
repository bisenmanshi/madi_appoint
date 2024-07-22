const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

// get the details of a user 
const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    // console.log(user)
    return res.send(user);
  } catch (error) {
    res.status(500).send("Unable to get user");
  }
};

const getallusers = async (req, res) => {
  // get all the user exacept the user that is login
  try {
    const users = await User.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
    return res.send(users);
  } catch (error) {
    res.status(500).send("Unable to get all users");
  }
};

// const login = async (req, res) => {
//   try {
//     // verify password using bcrypt.compare 
//     const emailPresent = await User.findOne({ email: req.body.email });
//     if (!emailPresent) {
//       return res.status(400).send("Incorrect credentials");
//     }
//     const verifyPass = await bcrypt.compare(
//       req.body.password,
//       emailPresent.password
//     );
//     if (!verifyPass) {
//       return res.status(400).send("Incorrect credentials");
//     }
//     // sign the token 
//     const token = jwt.sign(
//       { userId: emailPresent._id, isAdmin: emailPresent.isAdmin , isDoctor:emailPresent.isDoctor },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "2 days",
//       }
//     );
//     return res.status(201).send({ msg: "User logged in successfully", token });
//   } catch (error) {
//     res.status(500).send("Unable to login user");
//   }
// };

const login = async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Login request body:", req.body);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    // Verify the email exists
    const emailPresent = await User.findOne({ email: req.body.email });
    if (!emailPresent) {
      console.log("User not found with email:", req.body.email);
      return res.status(400).send("Incorrect credentials");
    }
    console.log("User found:", emailPresent);

    // Verify the password
    const verifyPass = await bcrypt.compare(req.body.password, emailPresent.password);
    if (!verifyPass) {
      console.log("Password does not match for user:", req.body.email);
      return res.status(400).send("Incorrect credentials");
    }
    console.log("Password match:", verifyPass);

    // Sign the token
    const token = jwt.sign(
      { userId: emailPresent._id, isAdmin: emailPresent.isAdmin, isDoctor: emailPresent.isDoctor },
      process.env.JWT_SECRET,
      { expiresIn: '2 days' }
    );
    console.log("JWT Token created:", token);

    return res.status(201).send({ msg: "User logged in successfully", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Unable to login user");
  }
};

module.exports = login;


const register = async (req, res) => {
  try {
    // check if already exist 
    const emailPresent = await User.findOne({ email: req.body.email });
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }
    // hash password 
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = await User({ ...req.body, password: hashedPass });
    // save the password
    const result = await user.save();
    if (!result) {
      return res.status(500).send("Unable to register user");
    }
    return res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Unable to register user");
  }
};

// const updateprofile = async (req, res) => {
//   try {
//     const hashedPass = await bcrypt.hash(req.body.password, 10);
//     const result = await User.findByIdAndUpdate(
//       { _id: req.locals },
//       { ...req.body, password: hashedPass }
//     );
//     console.log("result :",result);
//     if (!result) {
//       return res.status(500).send("Unable to update user");
//     }
//     return res.status(201).send("User updated successfully");
//   } catch (error) {
//     res.status(500).send("Unable to update user");
//   }
// };

const updateprofile = async (req, res) => {
  try {
    console.log("Request received to update profile:", req.body);

    // Check if the request body contains the password
    if (!req.body.password) {
      return res.status(400).send("Password is required");
    }

    // Hash the password
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    console.log("Password hashed successfully");

    // Find the user by ID and update their profile
    const result = await User.findByIdAndUpdate(
      req.locals, // Assuming req.locals contains the userId from the auth middleware
      { ...req.body, password: hashedPass },
      { new: true } // This option returns the updated document
    );

    console.log("Update result:", result);

    if (!result) {
      return res.status(500).send("Unable to update user");
    }

    return res.status(201).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Unable to update user");
  }
};


// deleteuser from database 
const deleteuser = async (req, res) => {
  try {
    // if user deleted the delete all his records
    const result = await User.findByIdAndDelete(req.body.userId);
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
};
