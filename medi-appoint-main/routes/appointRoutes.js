const express = require("express");
const auth = require("../middleware/auth");
const appointmentController = require("../controllers/appointmentController");

const appointRouter = express.Router();
// appointment route to get all appoinment 
appointRouter.get(
  "/getallappointments",
  auth,
  appointmentController.getallappointments
);

// route for booking an appoinment 
appointRouter.post(
  "/bookappointment",
  auth,
  appointmentController.bookappointment
);
// route when doctor accept the appoinment 
appointRouter.put("/completed", auth, appointmentController.completed);
appointRouter.put("/reject", auth, appointmentController.reject);
module.exports = appointRouter;
