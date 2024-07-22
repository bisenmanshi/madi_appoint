import React from "react";
import "../styles/contact.css";
import { useForm, ValidationError } from "@formspree/react";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom"
// Contact form using Formspree
const Contact = () => {
  const navigate = useNavigate();
  const [state, handleSubmit] = useForm("mpzgeeyn");

  if (state.succeeded) {
    toast.success("from submitted successfully ");
    // window.reload();
    return (
      <section className="register-section flex-center" id="contact">
      <div className="contact-container flex-center contact">
        <h2 className="form-heading">Contact Us</h2>
        <form
          onSubmit={handleSubmit}
          className="register-form"
        >
          <input
            id="name"
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
          />
          <ValidationError
            prefix="name"
            field="name"
            errors={state.errors}
          />
          <input
            id="email"
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
          />

          <textarea
            id="message"
            name="message"
            className="form-input"
            placeholder="Enter your message"
            rows="8"
            cols="12"
          ></textarea>
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />

          <button
            type="submit"
            className="btn form-btn"
            disabled={state.submitting}
          >
            Send
          </button>
        </form>
      </div>
    </section>
    )
  }

  return (
    <section className="register-section flex-center" id="contact">
      <div className="contact-container flex-center contact">
        <h2 className="form-heading">Contact Us</h2>
        <form
          onSubmit={handleSubmit}
          className="register-form"
        >
          <input
            id="name"
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
          />
          <ValidationError
            prefix="name"
            field="name"
            errors={state.errors}
          />
          <input
            id="email"
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
          />

          <textarea
            id="message"
            name="message"
            className="form-input"
            placeholder="Enter your message"
            rows="8"
            cols="12"
          ></textarea>
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />

          <button
            type="submit"
            className="btn form-btn"
            disabled={state.submitting}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
