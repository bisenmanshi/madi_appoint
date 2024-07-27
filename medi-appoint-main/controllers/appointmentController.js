const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const nodemailer=require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // Your email
    pass: process.env.MAIL_PASS, // Your email password
  },
});

const getallappointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [{ userId: req.query.search }, { doctorId: req.query.search }],
        }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("doctorId")
      .populate("userId");
      // console.log(appointments);
    return res.send(appointments);
  } catch (error) {
    res.status(500).send("Unable to get apponintments");
  }
};


const bookappointment = async (req, res) => {
  try {
    const appointment = new Appointment({
      date: req.body.date,
      time: req.body.time,
      doctorId: req.body.doctorId,
      userId: req.locals,
    });

    const user = await User.findById(req.locals);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const userNotification = new Notification({
      userId: req.locals,
      content: `You booked an appointment with Dr. ${req.body.doctorname} for ${req.body.date} ${req.body.time}`,
    });
    await userNotification.save();

    const mailOptions = {
      from: process.env.MAIL_USER, // Sender's email address
      to: user.email, // Recipient's email address
      subject: "Medi-Appoint !! Request sent",
      text: `Hello, ${user.firstname} ${user.lastname}. Thank you for booking an appointment.`,
      html: `<p>Hello, ${user.firstname} ${user.lastname}. Thank you for booking an appointment. Your request has been sent to the doctor and you will be notified once it is accepted.</p>`
    };

    try {
      const emailResponse = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + emailResponse.response);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    const doctorNotification = new Notification({
      userId: req.body.doctorId,
      content: `You have an appointment request from ${user.firstname} ${user.lastname} on ${req.body.date} at ${req.body.time}`,
    });
    await doctorNotification.save();

    const result = await appointment.save();
    return res.status(201).send(result);
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).send("Unable to book appointment");
  }
};

module.exports = bookappointment;




const completed = async (req, res) => {
 
  try {
    console.log("Request Body:", req.body);
    const alreadyFound = await Appointment.findOneAndUpdate(
      { _id: req.body.appointid },
      { status: "Completed" }
    );
    if (!alreadyFound) {
      return res.status(404).send("Appointment not found");
    }
    const appoint = await Appointment.findById(req.body.appointid);
    const patient = await User.findById(appoint.userId);

    const usernotification = Notification({
      userId: patient._id,
      content: `Your appointment with ${req.body.doctorname} has been Completed`,
    });
    await usernotification.save();

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: patient.email,
      subject: "Medi-Appoint: Appointment Completed",
      text: `Hello, ${patient.firstname} ${patient.lastname}. Your appointment has been completed.`,
      html: `<p>Hello, ${patient.firstname} ${patient.lastname}. Your appointment has been completed.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    const user = await User.findById(req.locals);
    const doctornotification = Notification({
      userId: req.body.doctorId,
      content: `You completed appointment of ${patient.firstname} ${patient.lastname}`,
    });
    await doctornotification.save();

    return res.status(201).send("Appointment completed");
  } catch (error) {
    console.error("Error completing appointment:", error);
    return res.status(500).send("Unable to complete appointment");
  }
};

const reject = async (req, res) => {
  try {
    console.log("reject");
    const alreadyFound = await Appointment.findOneAndUpdate(
      { _id: req.body.appointid },
      { status: "Rejected" }
    );
    const appoint=await Appointment.findById(req.body.appointid);
    // console.log(appoint)
    const patient=await User.findById(appoint.userId);
    // console.log(req.body.doctorname);
    const usernotification = Notification({
      userId: patient._id,
      content: `Your appointment with ${req.body.doctorname} has been Rejected`,
    });

    // console.log(req.body.appointid);
    await usernotification.save();
    
    const mailOptions = {
      from: process.env.MAIL_USER, // Sender's email address
      to: patient.email, // Recipient's email address
      subject: "Medi-Appoint !! Request Rejected ",
      html: `<p>Hello, ${patient.firstname} ${patient.lastname} Sorry to inform you that your request has been rejected by doctor due to his unavailability ! please try booking again at some other date. Thank you using our service </p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });


    const user = await User.findById(req.locals);
    const doctornotification = Notification({
      userId: req.body.doctorId,
      content: `You Rejected appointment of ${patient.firstname} ${patient.lastname}`,
    });

    await doctornotification.save();

    return res.status(201).send("Appointment completed");
  } catch (error) {
    res.status(500).send("Unable to complete appointment");
  }
};

module.exports = {
  getallappointments,
  bookappointment,
  completed,
  reject
};
