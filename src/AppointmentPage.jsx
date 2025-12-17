import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_DOCTOR = "http://localhost:8083/doctor-app/doctors";
const API_APPOINTMENT = "http://localhost:8086/appointment-app/appointments";
const API_PATIENT = "http://localhost:8082/patient-app";
const API_ROOM = "http://localhost:8084/room-app/rooms";

export default function AppointmentForm() {
  const navigate = useNavigate();

  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorFee, setDoctorFee] = useState(0);
  const hospitalFee = 1000;
  const [totalFee, setTotalFee] = useState(hospitalFee);
  const [availableDays, setAvailableDays] = useState([]);
  const [allDoctorSlots, setAllDoctorSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctorRoomNo, setDoctorRoomNo] = useState("");

  const [appointmentData, setAppointmentData] = useState({
  patientName: "",
  patientContact: "",
  patientId: null, 
  appDate: "",
  appTime: "",
  status: "PENDING",
  
});

  const dayToIndex = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const isAvailableDate = (date) => {
    const dayIndex = date.getDay();
    return availableDays.some((day) => dayToIndex[day] === dayIndex);
  };

  const fetchPatientByContact = async () => {
  try {
    const response = await axios.get(`${API_PATIENT}/patients`, {
      params: {
        name: "",
        contact: appointmentData.patientContact,
      },
    });

    if (response.data && response.data.length > 0) {
      setAppointmentData((prev) => ({
        ...prev,
        patientName: response.data[0].name,
        patientId: response.data[0].id, 
      }));
      toast.success("Patient found!");
    } else {
      toast.info("No patient found with this contact number.");
    }
  } catch (error) {
    console.error("Error fetching patient", error);
    toast.error("Failed to fetch patient data");
  }
};


  useEffect(() => {
    axios
      .get(`${API_DOCTOR}/specializations`)
      .then((res) => setSpecializations(res.data))
      .catch((err) => {
        console.error("Failed to load specializations", err);
        toast.error("Failed to load specializations");
      });
  }, []);

  useEffect(() => {
    if (selectedSpec) {
      axios
        .get(`${API_DOCTOR}/by-specialization/${selectedSpec}`)
        .then((res) => {
          setDoctors(res.data);
          resetForm();
        })
        .catch((err) => {
          console.error("Failed to load doctors", err);
          toast.error("Failed to load doctors");
        });
    } else {
      setDoctors([]);
      resetForm();
    }
  }, [selectedSpec]);

  useEffect(() => {
    const doctor = doctors.find((doc) => doc.id.toString() === selectedDoctorId);
    if (doctor) {
      setDoctorFee(doctor.doctorFee);
      setTotalFee(doctor.doctorFee + hospitalFee);
      setAppointmentData((prev) => ({ ...prev, appDate: "", appTime: "" }));
      setAvailableSlots([]);

      axios
        .get(`${API_DOCTOR}/${selectedDoctorId}/available-days`)
        .then((res) => {
          const days = typeof res.data === "string" ? res.data.split(",") : res.data;
          setAvailableDays(days.map((day) => day.trim().toLowerCase()));
        })
        .catch((err) => {
          console.error("Error fetching available days", err);
          setAvailableDays([]);
          toast.error("Failed to fetch available days");
        });

      axios
        .get(`${API_DOCTOR}/${selectedDoctorId}/time-slots`)
        .then((res) => {
          const slots = res.data.split(",").map((s) => s.trim());
          setAllDoctorSlots(slots);
        })
        .catch((err) => {
          console.error("Error fetching time slots", err);
          setAllDoctorSlots([]);
          toast.error("Failed to fetch time slots");
        });

      axios
        .get(`${API_ROOM}/doctors/${selectedDoctorId}`)
        .then((res) => {
          if (res.data && res.data.roomNo !== undefined) {
            setDoctorRoomNo(res.data.roomNo.toString());
          } else {
            setDoctorRoomNo("Not Assigned");
          }
        })
        .catch((err) => {
          console.error("Error fetching doctor room", err);
          setDoctorRoomNo("Not Assigned");
        });
    } else {
      setDoctorFee(0);
      setTotalFee(hospitalFee);
      setAvailableDays([]);
      setAllDoctorSlots([]);
      setAvailableSlots([]);
      setDoctorRoomNo("");
    }
  }, [selectedDoctorId, doctors]);

  useEffect(() => {
    if (selectedDoctorId && appointmentData.appDate && allDoctorSlots.length > 0) {
      axios
        .get(`${API_APPOINTMENT}/available-slots`, {
          params: {
            doctorId: parseInt(selectedDoctorId),
            date: appointmentData.appDate,
          },
        })
        .then((res) => {
          const bookedSlots = Array.isArray(res.data)
            ? res.data.map((slot) => slot.trim())
            : res.data.split(",").map((s) => s.trim());

          if (allDoctorSlots.length === 1 && allDoctorSlots[0].includes("-")) {
            setAvailableSlots(allDoctorSlots);
          } else {
            const freeSlots = allDoctorSlots.filter(
              (slot) => !bookedSlots.includes(slot.trim())
            );
            setAvailableSlots(freeSlots);

            if (!freeSlots.includes(appointmentData.appTime)) {
              setAppointmentData((prev) => ({ ...prev, appTime: "" }));
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch available slots", err);
          setAvailableSlots(allDoctorSlots);
          setAppointmentData((prev) => ({ ...prev, appTime: "" }));
          toast.error("Failed to fetch available slots");
        });
    } else {
      setAvailableSlots([]);
      setAppointmentData((prev) => ({ ...prev, appTime: "" }));
    }
  }, [selectedDoctorId, appointmentData.appDate, appointmentData.appTime, allDoctorSlots]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
  setSelectedDoctorId("");
  setDoctorFee(0);
  setTotalFee(hospitalFee);
  setAvailableDays([]);
  setAllDoctorSlots([]);
  setAvailableSlots([]);
  setDoctorRoomNo("");
  setAppointmentData({
    patientName: "",
    patientContact: "",
    patientId: null, 
    appDate: "",
    appTime: "",
    status: "PENDING",
  });
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  const { patientName, patientContact, appDate, appTime, patientId } = appointmentData;

  if (!patientName || !patientContact || !appDate || !appTime || !selectedDoctorId || !patientId) {
    toast.warn("Please fill in all fields and fetch patient details");
    return;
  }

  try {
    const res = await axios.get(`${API_APPOINTMENT}/next-app-number`, {
      params: { doctorId: selectedDoctorId, date: appDate },
    });

    const payload = {
      ...appointmentData,
      doctorId: parseInt(selectedDoctorId),
      appFee: totalFee,
      appNumber: res.data,
      patientId: patientId, 
      roomNo: doctorRoomNo
    };

    await axios.post(API_APPOINTMENT, payload);

    toast.success("Appointment booked successfully! Redirecting...");

    setSelectedSpec("");
    setDoctors([]);
    resetForm();

    setTimeout(() => {
      navigate("/appointments");
    }, 2000);
  } catch (err) {
    console.error("Error booking appointment", err);
    toast.error("Failed to create appointment");
  }
};


  return (
    <>
      <style>{`
        form {
          max-width: 500px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          background-color: #fafafa;
        }
        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 24px;
        }
        label {
          display: block;
          margin-bottom: 16px;
          font-weight: 600;
          color: #555;
        }
        label select,
        label input {
          margin-top: 6px;
          width: 100%;
          padding: 8px 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .fee-display {
          font-size: 16px;
          margin-bottom: 12px;
          color: #222;
          font-weight: 600;
        }
        button[type="submit"], .view-appointments-btn {
          width: 40%;
          padding: 10px;
          margin-top: 24px;
          margin-left: 40px;
          background-color: #007BFF;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button[type="cancel"], .cancel-btn {
          width: 40%;
          padding: 10px;
          margin-left: 30px;
          margin-top: 24px;
          background-color: #5a6268;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button[type="submit"]:hover, .view-appointments-btn:hover {
          background-color: #0056b3;
        }

        button[type="submit"]:hover, .cancel-btn:hover {
          background-color:rgb(64, 70, 74);
        }
      `}</style>
      
      <form onSubmit={handleSubmit}>
        <h2>Book Appointment</h2>

        <label>
          Specialization:
          <select value={selectedSpec} onChange={(e) => setSelectedSpec(e.target.value)} required>
            <option value="">Select specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </label>

        <label>
          Doctor:
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            disabled={!selectedSpec}
            required
          >
            <option value="">Select doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
        </label>

        <div className="fee-display">Doctor Fee: <strong>{doctorFee.toFixed(2)}</strong></div>
        <div className="fee-display">Hospital Fee: <strong>{hospitalFee.toFixed(2)}</strong></div>
        <div className="fee-display">Total Fee: <strong>{totalFee.toFixed(2)}</strong></div>
        <div className="fee-display">Assigned Room: <strong>{doctorRoomNo || "Not Assigned"}</strong></div>

        <label>
          Patient Name:
          <input type="text" name="patientName" value={appointmentData.patientName} onChange={handleChange} required />
        </label>

        <label>
          Contact Number:
          <input type="text" name="patientContact" value={appointmentData.patientContact} onChange={handleChange} required />
          <button type="submit" onClick={fetchPatientByContact}>Find Patient</button>
        </label>

        <label>
          Appointment Date:
          <DatePicker
            selected={appointmentData.appDate ? new Date(appointmentData.appDate) : null}
            onChange={(date) => {
              const formatted = date.toISOString().split("T")[0];
              setAppointmentData((prev) => ({ ...prev, appDate: formatted }));
            }}
            filterDate={isAvailableDate}
            placeholderText="Select available date"
            dateFormat="yyyy-MM-dd"
            disabled={!selectedDoctorId}
            required
          />
        </label>

        <label>
          Time Slot:
          <select
            name="appTime"
            value={appointmentData.appTime}
            onChange={handleChange}
            disabled={availableSlots.length === 0}
            required
          >
            <option value="">Select time</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </label>

        <div className="button-row">
          <button type="submit">Book Appointment</button>
          <button type="submit" onClick={() => navigate("/appointments")}>Cancel</button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}