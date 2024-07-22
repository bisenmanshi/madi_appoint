import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img src={image} alt="hero" />
          </div>
          <div className="hero-content">
            
            <h3>Why Choose Us?</h3>
            <p>
              We are on a mission to redefine healthcare accessibility. With a
              user-friendly interface, we make it easy for you to discover,
              connect, and schedule appointments with skilled healthcare
              professionals. Whether you're looking for routine check-ups,
              specialized care, or seeking a second opinion, we've got you
              covered.
            </p>
            <h3>Our Approach</h3>
            <p>
              What sets us apart is our dedication to creating a healthcare
              experience that revolves around you. Our platform is designed to
              empower patients with information, streamline the appointment
              process, and foster a collaborative relationship between doctors
              and patients.
            </p>
            <h3>Quality Care, Just a Click Away</h3>
            <p>
              We've curated a network of reputable doctors covering various
              specialties to ensure you have options that meet your unique
              healthcare needs. Our commitment to quality care is unwavering,
              and we continually strive to enhance our platform to serve you
              better.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
