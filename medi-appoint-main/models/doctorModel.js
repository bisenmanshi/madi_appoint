const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    day: {
      type: String, // Assuming day is a string, adjust the type as needed
      required: true,
    },
    startTime: {
      type: String, // Assuming startTime is a string, adjust the type as needed
      required: true,
    },
    endTime: {
      type: String, // Assuming endTime is a string, adjust the type as needed
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", schema);

module.exports = Doctor;
