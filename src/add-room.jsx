import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const API_ROOM = "http://localhost:8084/room-app/rooms";
const API_DOCTOR = "http://localhost:8083/doctor-app/doctors";

function AddRoom() {
  const [form, setForm] = useState({
    doctorId: "",
    roomNo: "",
    roomType: "",
    floor: "",
    status: "FREE"
  });

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState("");
  const [allRooms, setAllRooms] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
  try {
    const res = await axios.get(API_ROOM);
    setAllRooms(res.data);
  } catch (err) {
    toast.error("Failed to load existing rooms!");
  }
};

  const fetchDoctors = async () => {
  try {
    const response = await axios.get(API_DOCTOR);
    const cleanedDoctors = response.data.map(doc => ({
      ...doc,
      specialization: doc.specialization.trim()
    }));

    setDoctors(cleanedDoctors);

    // Extract unique specializations (case-insensitive)
    const uniqueSpecsSet = new Set();
    const uniqueSpecs = [];

    cleanedDoctors.forEach(doc => {
      const normalized = doc.specialization.toLowerCase();
      if (!uniqueSpecsSet.has(normalized)) {
        uniqueSpecsSet.add(normalized);
        uniqueSpecs.push(doc.specialization); // original casing, trimmed
      }
    });

    setSpecializations(uniqueSpecs);
  } catch (error) {
    toast.error("Failed to load doctors!");
  }
};


  const handleSpecializationChange = (e) => {
  const spec = e.target.value;
  setSelectedSpec(spec);

  const filtered = doctors.filter(
    doc => doc.specialization.trim().toLowerCase() === spec.trim().toLowerCase()
  );
  setFilteredDoctors(filtered);
  setForm({ ...form, doctorId: "" });
};


  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleAddRoom = async () => {
  const payload = {
    doctorId: form.doctorId ? parseInt(form.doctorId) : null,
    roomNo: parseInt(form.roomNo),
    roomType: form.roomType,
    floor: parseInt(form.floor),
    status: form.doctorId ? "ASSIGNED" : "FREE"
  };

  // Basic validation
  if (isNaN(payload.roomNo) || !payload.roomType || isNaN(payload.floor)) {
    toast.error("Please fill all required fields correctly!");
    return;
  }

  // ✅ Check if the same doctor is already assigned to a room
  if (payload.doctorId) {
    const doctorAssigned = allRooms.some(
      room => room.doctorId === payload.doctorId
    );

    if (doctorAssigned) {
      const doctor = doctors.find(doc => doc.id === payload.doctorId);
      toast.error(`Doctor ${doctor?.name || ""} is already assigned to a room.`);
      return;
    }
  }

  // ✅ Check for duplicate room number on the same floor
  const isDuplicate = allRooms.some(
    room => parseInt(room.roomNo) === payload.roomNo && parseInt(room.floor) === payload.floor
  );

  if (isDuplicate) {
    toast.error(`Room No ${payload.roomNo} already exists on Floor ${payload.floor}`);
    return;
  }

  try {
    await axios.post(API_ROOM, payload);
    toast.success("Room added successfully!");

    setTimeout(() => {
      navigate("/room");
    }, 1000);
  } catch (error) {
    toast.error("Failed to add room!");
  }
};




  return (
    <div style={{
      display: "flex", justifyContent: "center",
      alignItems: "center", minHeight: "100vh", backgroundColor: "#f8f9fa"
    }}>
      <style>
        {`
        .form-container {
          background-color: #ffffff;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
          width: 100%;
          max-width: 450px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }

        .form-container h1 {
          text-align: center;
          margin-bottom: 25px;
          font-weight: 700;
          color: #222;
        }

        .form-container input,
        .form-container select {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 18px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          background-color: #fff;
          transition: border-color 0.3s ease;
        }

        .form-container input:focus,
        .form-container select:focus {
          border-color: #0d6efd;
          outline: none;
        }

        .button-group {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 10px;
        }

        .form-container button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        .form-container button:first-of-type {
          background-color: #0d6efd;
          color: white;
        }

        .form-container button:first-of-type:hover {
          background-color: #084298;
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
        <h1>Add Room</h1>

        <select value={selectedSpec} onChange={handleSpecializationChange}>
          <option value="">Select Specialization (Optional)</option>
          {specializations.map((spec, index) => (
            <option key={index} value={spec}>{spec}</option>
          ))}
        </select>

        <select
          name="doctorId"
          value={form.doctorId}
          onChange={handleInputChange}
          disabled={!selectedSpec}
        >
          <option value="">Select Doctor (Optional)</option>
          {filteredDoctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="roomNo"
          placeholder="Room Number"
          value={form.roomNo}
          onChange={handleInputChange}
        />

        <select
          name="roomType"
          value={form.roomType}
          onChange={handleInputChange}
        >
          <option value="">Select Room Type</option>
          <option value="Consultation Room">Consultation Room</option>
          <option value="Operation Theater">Operation Theater</option>
          <option value="ICU">ICU</option>
          <option value="General Ward">General Ward</option>
          <option value="Private Room">Private Room</option>
        </select>

        <input
          type="number"
          name="floor"
          placeholder="Floor"
          value={form.floor}
          onChange={handleInputChange}
        />

        <div className="button-group">
          <button onClick={handleAddRoom}>Add Room</button>
          <button onClick={() => navigate("/room")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddRoom;
