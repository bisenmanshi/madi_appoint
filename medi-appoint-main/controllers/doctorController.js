const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getalldoctors = async (req, res) => {
  try {
    let docs;
    if (!req.locals) {
      docs = await Doctor.find({ isDoctor: true }).populate("userId");
    } else {
      docs = await Doctor.find({ isDoctor: true })
        .find({
          _id: { $ne: req.locals },
        })
        .populate("userId");
    }

    return res.send(docs);
  } catch (error) {
    res.status(500).send("Unable to get doctors");
  }
};

const getnotdoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({ isDoctor: false })
      .find({
        _id: { $ne: req.locals },
      })
      .populate("userId");

    return res.send(docs);
  } catch (error) {
    res.status(500).send("Unable to get non doctors");
  }
};

// const applyfordoctor = async (req, res) => {
//   try {
//     // check if already a doctor 
//     const alreadyFound = await Doctor.findOne({ userId: req.locals });
//     if (alreadyFound) {
//       return res.status(400).send("Application already exists");
//     }
//     // if not add new doctor 
//     const doctor = Doctor({ ...req.body.formDetails, userId: req.locals });
//     const result = await doctor.save();

//     return res.status(201).send("Application submitted successfully");
//   } catch (error) {
//     res.status(500).send("Unable to submit application");
//   }
// };

const applyfordoctor = async (req, res) => {
  try {
    console.log("Request received to apply for doctor:", req.body);

    // Check if already a doctor
    const alreadyFound = await Doctor.findOne({ userId: req.locals });
    console.log("Doctor application search result:", alreadyFound);

    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }

    // If not, add new doctor
    const doctor = new Doctor({ ...req.body.formDetails, userId: req.locals });
    console.log("New doctor application data:", doctor);

    const result = await doctor.save();
    console.log("Doctor application save result:", result);

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).send("Unable to submit application");
  }
};

// admin accepts the doctor 
const acceptdoctor = async (req, res) => {
  try {
    // make isDoctor true in user 
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: true, status: "accepted" }
    );
    // make doctor isDoctor true 
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.id },
      { isDoctor: true }
    );

    // add notification 
    const notification = await Notification({
      userId: req.body.id,
      content: `Congratulations, Your application has been accepted.`,
    });

    await notification.save();

    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    res.status(500).send("Error while sending notification");
  }
};

// reject the application 
const rejectdoctor = async (req, res) => {
  try {
    const details = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: false, status: "rejected" }
    );
    // delete the doctor if rejected 
    const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });

    // add notification 
    const notification = await Notification({
      userId: req.body.id,
      content: `Sorry, Your application has been rejected.`,
    });

    await notification.save();

    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    res.status(500).send("Error while rejecting application");
  }
};

// delete any doctor 
const deletedoctor = async (req, res) => {
  try {
    // update the user first 
    const result = await User.findByIdAndUpdate(req.body.userId, {
      isDoctor: false,
    });
    // remove from doctor schema 
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    // remove from appointment 
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("Doctor deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to delete doctor");
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
};
