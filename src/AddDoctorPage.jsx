

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8083/doctor-app/doctors";

export default function AddDoctorPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    availableDays: "",
    timeSlots: "",
    doctorFee: "",
  });

  const navigate = useNavigate();

  // Allowed days for validation
  const validDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const isValidAvailableDays = (daysStr) => {
    const days = daysStr.split(",").map((d) => d.trim().toLowerCase());
    if (days.length === 0) return false;
    return days.every((day) => validDays.includes(day));
  };

  const isValidTimeSlots = (timeStr) => {
  // Only digits, commas, hyphens, spaces, and periods allowed
  return /^[0-9,\-\s.]+$/.test(timeStr);
};


  const isValidEmail = (email) => {
    // Simple email regex
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async () => {
  const trimmedName = form.name.trim();

  if (!trimmedName) {
    toast.error("Name is required");
    return;
  }

  // Automatically add 'Dr.' prefix if not already present
  const nameWithPrefix = trimmedName.toLowerCase().startsWith("dr.")
    ? trimmedName
    : `Dr. ${trimmedName}`;

  if (!form.email.trim()) {
    toast.error("Email is required");
    return;
  }

  if (!isValidEmail(form.email.trim())) {
    toast.error("Please enter a valid email address");
    return;
  }

  if (!form.specialization.trim()) {
    toast.error("Specialization is required");
    return;
  }

  if (!form.availableDays.trim()) {
    toast.error("Available Days is required");
    return;
  }

  if (!isValidAvailableDays(form.availableDays.trim())) {
    toast.error("Available Days must be comma-separated days like Monday, Tuesday");
    return;
  }

  if (!form.timeSlots.trim()) {
    toast.error("Time Slots is required");
    return;
  }

  if (!isValidTimeSlots(form.timeSlots.trim())) {
    toast.error("Time Slots must contain only numbers, commas, hyphens, full-stops and spaces");
    return;
  }

  if (form.doctorFee === "" || Number(form.doctorFee) <= 0) {
    toast.error("Doctor Fee must be a positive number");
    return;
  }

  try {
    // Send the new object with prefixed name
    const doctorData = {
      ...form,
      name: nameWithPrefix,
    };

    await axios.post(API_URL, doctorData);
    toast.success("Doctor added successfully!");
    navigate("/doctor");
  } catch (error) {
    toast.error("Failed to add doctor!");
  }
};


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <style>
        {`
          .form-container {
            background-color: #fff;
            padding: 30px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
          }

          
          .form-container h1 {
            text-align: center;
            margin-bottom: 25px;
            color: #333;
          }

          .form-container input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
          }

          .button-group {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
          }

          .form-container button {
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
          }

          .form-container button:first-of-type {
            background-color: rgb(51, 122, 197);
            color: white;
          }

          .form-container button:first-of-type:hover {
            background-color: rgb(17, 84, 166);
          }

          .form-container button:last-of-type {
            background-color: #6c757d;
            color: white;
          }

          .form-container button:last-of-type:hover {
            background-color: #5a6268;
          }
        `}
      </style>

      <div className="form-container">
        <h1>Add Doctor</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={form.specialization}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="availableDays"
          placeholder="Available Days (e.g., Monday, Tuesday)"
          value={form.availableDays}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="timeSlots"
          placeholder="Time Slots (e.g., 09:00-12:00, 13:00-15:00)"
          value={form.timeSlots}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="doctorFee"
          placeholder="Doctor Fee"
          step="0.01"
          value={form.doctorFee}
          onChange={handleInputChange}
        />
        <div className="button-group">
          <button onClick={handleAddDoctor}>Add Doctor</button>
          <button onClick={() => navigate("/doctor")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
