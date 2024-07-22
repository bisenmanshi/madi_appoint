import React, { useState } from "react";
import "../styles/contact.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const ApplyDoctor = () => {
  const navigate = useNavigate();

  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    fees: "",
    day: "",        // New state for day
    startTime: "",  // New state for start time
    endTime: "",    // New state for end time
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const btnClick = async (e) => {
    e.preventDefault();

    let daysPresent = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    let days = formDetails.day.toLowerCase().split(" ");
    let hasError = false;
    days.forEach((value) => {
      if (!daysPresent.includes(value)) {
        hasError = true;
      }
    });
    
    if (hasError) {
      return toast.error("Enter day in the specified format");
    }
    
    const start = formDetails.startTime;
    const end = formDetails.endTime;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    
    if (startTime >= endTime) {
      return toast.error("Please enter correct time");
    }
    
    try {
      await toast.promise(
        axios.post(
          "/api/doctor/applyfordoctor",
          {
            formDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Doctor application sent successfully",
          error: "Unable to send Doctor application",
          loading: "Sending doctor application...",
        }
      );

      navigate("/");
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Navbar />
      <section
        className="register-section flex-center apply-doctor"
        id="contact"
      >
        <div className="register-container flex-center contact">
          <h2 className="form-heading">Apply for Doctor</h2>
          <form className="register-form ">
            <input
              type="text"
              name="specialization"
              className="form-input"
              placeholder="Enter your specialization"
              value={formDetails.specialization}
              onChange={inputChange}
              required
            />
            <input
              type="number"
              name="experience"
              className="form-input"
              placeholder="Enter your experience (in years)"
              value={formDetails.experience}
              onChange={inputChange}
              required
            />
            <input
              type="number"
              name="fees"
              className="form-input"
              placeholder="Enter your fees (in Rupees)"
              value={formDetails.fees}
              onChange={inputChange}
              required
            />
            <input
              type="text"
              name="day"
              className="form-input"
              placeholder="Enter day in Formate:monday tuesday"
              value={formDetails.day}
              onChange={inputChange}
              required
            />
            <label> start Time</label>
            <input
              type="time"
              name="startTime"
              className="form-input"
              required
              value={formDetails.startTime}
              onChange={inputChange}
            />
            <label> End Time</label>
            <input
              type="time"
              name="endTime"
              className="form-input"
              required
              value={formDetails.endTime}
              onChange={inputChange}
            />
            <button
              type="submit"
              className="btn form-btn"
              onClick={btnClick}
            >
              Apply
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ApplyDoctor;
