import React, { useRef } from "react";
import { toast } from "react-toastify";
import "./Contact.css";

import Footer from "../Page-Components/Footer";
import Navbar from "../Page-Components/Navbar";
import axios from 'axios';
import useThrottle from "../Hooks/useThrottle";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";




const ContactUs = () => {
  const formRef = useRef();
   const dispatch = useDispatch()
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbzCFn9Lm5wQNLldsTlD90y3268-hcK03-SHW-BfaxVYT3R4OM7OOT4drQajjqpeQdQB/exec";



  
  const handleSubmit = async (e) => {
    e.preventDefault();
       dispatch(showLoader())
    try {
      const formData = new FormData(formRef.current);
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.msg);
      formRef.current.reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }finally{
      dispatch(hideLoader())
    }
  };
 
  return (
    <>
      <Navbar />
      <form ref={formRef} onSubmit={  handleSubmit} className="contact-form">
        <h2 className="title-contactus">Contact Us</h2>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            name="Name"
            required
            id="name"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            name="Email"
            required
            id="email"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="message">
            Message:
          </label>
          <textarea
            name="Message"
            required
            id="message"
            className="form-input"
          ></textarea>
        </div>
        <button type="submit"  className="form-submit">
          Send
        </button>
      </form>
      <Footer />
    </>
  );
};

export default ContactUs;
