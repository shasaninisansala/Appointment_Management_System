import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const API_URL = "http://localhost:8082/patient-app/patients";

export default function AddPatientPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    contactNumber: "",
    email: ""
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPatient = async () => {
  const { name, age, gender, contactNumber, email } = form;

  if (!name.trim()) return toast.error("Name is required");
  if (!age || Number(age) <= 0) return toast.error("Valid age is required");
  if (!gender) return toast.error("Gender is required");
  if (!contactNumber.trim()) return toast.error("Contact number is required");
  if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
    return toast.error("Valid email is required");

  try {
    // Check for duplicate contact number
    const res = await axios.get(API_URL);
    const existing = res.data.find(
      (p) => p.contactNumber.trim() === contactNumber.trim()
    );
    if (existing) {
      toast.error("A patient with this contact number already exists.");
      return;
    }

    // Add patient if no duplicate
    await axios.post(API_URL, form);
    toast.success("Patient added successfully!");
    navigate("/patient");
  } catch (error) {
    toast.error("Failed to add patient!");
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

          .form-container input,
          .form-container select {
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
        <h1>Add Patient</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleInputChange}
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleInputChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
        />

        <div className="button-group">
          <button onClick={handleAddPatient}>Add Patient</button>
          <button onClick={() => navigate("/patient")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
