import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

// component of home page 
const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Your Health, <br />
          Our Responsibility
        </h1>
        <p>
        Welcome to <b>Medi_Appoint</b>, where Your Health is Our Responsibility. Our mission is to simplify healthcare access for everyone. We understand the importance of timely and convenient medical care, and we're here to make the process of scheduling doctor appointments hassle-free. With our user-friendly platform, you can easily browse through available doctors, check their specialties, and book appointments at your convenience. Our dedicated team ensures that your journey to wellness is seamless, from finding the right doctor to confirming your appointment. Your health is at the heart of our commitment, and we take pride in being your trusted partner on the path to better well-being. Experience the ease of managing your health with <b>Medi_Appoint</b> ."
        </p>
      </div>
      <div className="hero-img">
        <img
          src={image}
          alt="hero"
        />
      </div>
    </section>
  );
  
};

export default Hero;
