import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

// to get user appointment time and date 
const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    // validate 
    if(!formDetails.date) 
    return toast.error("enter correct date");
    if(!formDetails.time) 
    return toast.error("enter correct date");

    const selectedDate = new Date(`${formDetails.date}`);
    const dayOfWeekNumber = selectedDate.getDay();
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayOfWeekName = daysOfWeek[dayOfWeekNumber];
    let days = ele?.day.toLowerCase().split(" ");
    
    if (!days.includes(dayOfWeekName)) {
      return toast.error("doctor is not available on selected date"); 
    }
    const currentTime = new Date(`2000-01-01T${formDetails.time}`);
    const startTime = new Date(`2000-01-01T${ele?.startTime}`);
    const endTime = new Date(`2000-01-01T${ele?.endTime}`);
    
    console.log(startTime.getTime())
    console.log(endTime.getTime())
    console.log(currentTime.getTime())
    const isBetween = currentTime.getTime() >= startTime.getTime() && currentTime.getTime() <= endTime.getTime();
      
    if (!isBetween) {
      return toast.error("selected time is not between start time and end time.");
    }
    // send the time and date in backend
    try {
      await toast.promise(
        axios.post(
          "/api/appointment/bookappointment",
          {
            doctorId: ele?.userId?._id,
            date: formDetails.date,
            time: formDetails.time,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment request made successfully",
          error: "Unable to make appointment request",
          loading: "Booking appointment...",
        }
      );
      setModalOpen(false);
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <div className="modal flex-center">
        <div className="modal__content">
          <h2 className="page-heading">Book Appointment</h2>
          <IoMdClose
            onClick={() => {
              setModalOpen(false);
            }}
            className="close-btn"
          />
          <div className="register-container flex-center book">
            <form className="register-form">
              <input
                type="date"
                name="date"
                className="form-input"
                value={formDetails.date}
                onChange={inputChange}
              />
              <input
                type="time"
                name="time"
                className="form-input"
                value={formDetails.time}
                onChange={inputChange}
              />
              <button
                type="submit"
                className="btn form-btn"
                onClick={bookAppointment}
              >
                book
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
