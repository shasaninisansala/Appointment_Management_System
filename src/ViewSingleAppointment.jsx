
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_APPOINTMENT = "http://localhost:8086/appointment-app/appointments";
const API_DOCTOR = "http://localhost:8083/doctor-app/doctors"; 
const API_ROOM = "http://localhost:8084/room-app/rooms";

export default function ViewSingleAppointment() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [roomNo, setRoomNo] = useState("Not Assigned");


  useEffect(() => {
  const fetchAppointment = async () => {
    try {
      const res = await axios.get(`${API_APPOINTMENT}/${id}`);
      setAppointment(res.data);

      const doctorRes = await axios.get(`${API_DOCTOR}/${res.data.doctorId}`);
      setDoctor(doctorRes.data);

      // Fetch room for the doctor
      const roomRes = await axios.get(`${API_ROOM}/doctors/${res.data.doctorId}`);
      setRoomNo(roomRes.data?.roomNo || "Not Assigned");
    } catch (err) {
      toast.error("Failed to load appointment, doctor or room data");
    } finally {
      setLoading(false);
    }
  };
  fetchAppointment();
}, [id]);


  

  const normalizedStatus = appointment?.status
    ? appointment.status.toLowerCase()
    : "pending";

  const updateStatus = async (newStatus) => {
    if (!appointment) return;
    setUpdating(true);
    try {
      const updatedAppointment = { ...appointment, status: newStatus };
      await axios.put(`${API_APPOINTMENT}/${id}`, updatedAppointment);
      setAppointment(updatedAppointment);
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading appointment details...
      </p>
    );

  if (!appointment)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Appointment not found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );

  return (
    <>
      <style>{`
        .view-appointment-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px 40px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }
        .view-appointment-container h2 {
          text-align: center;
          margin-bottom: 25px;
          font-weight: 700;
          color: #222;
          letter-spacing: 0.04em;
        }
        .appointment-detail {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
          font-size: 17px;
          line-height: 1.4;
        }
        .appointment-label {
          font-weight: 600;
          color: #555;
          min-width: 160px;
          user-select: none;
        }
        .appointment-value {
          color: #111;
          font-weight: 500;
          text-align: right;
          max-width: 380px;
          word-wrap: break-word;
        }
        .back-button {
          display: block;
          width: 160px;
          margin: 40px auto 0;
          padding: 12px 0;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,123,255,0.4);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
          user-select: none;
        }
        .back-button:hover {
          background-color: #0056b3;
          box-shadow: 0 6px 20px rgba(0,86,179,0.6);
        }
        .status-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 30px;
        }
        .status-button {
          padding: 12px 30px;
          font-weight: 600;
          font-size: 16px;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
          color: white;
          user-select: none;
        }
        .paid-button {
          background-color: #28a745;
        }
        .paid-button:hover {
          background-color: #1e7e34;
        }
        .unpaid-button {
          background-color: #dc3545;
        }
        .unpaid-button:hover {
          background-color: #a71d2a;
        }
      `}</style>

      <div
        className="view-appointment-container"
        role="main"
        aria-label="Appointment Details"
      >
        <h2>Appointment Details</h2>

        <div className="appointment-detail">
          <span className="appointment-label">Appointment No:</span>
          <span className="appointment-value">{appointment.appNumber}</span>
        </div>

        <div className="appointment-detail">
          <span className="appointment-label">Doctor:</span>
          <span className="appointment-value">
            {doctor ? doctor.name : `Doctor ID ${appointment.doctorId}`}
          </span>
        </div>

        <div className="appointment-detail">
          <span className="appointment-label">Patient Name:</span>
          <span className="appointment-value">{appointment.patientName}</span>
        </div>

        <div className="appointment-detail">
          <span className="appointment-label">Patient Contact:</span>
          <span className="appointment-value">{appointment.patientContact}</span>
        </div>

        <div className="appointment-detail">
          <span className="appointment-label">Date:</span>
          <span className="appointment-value">{appointment.appDate}</span>
        </div>

        <div className="appointment-detail">
          <span className="appointment-label">Time:</span>
          <span className="appointment-value">{appointment.appTime}</span>
        </div>

        <div className="appointment-detail">
          <span className="appointment-label">Room No:</span>
          <span className="appointment-value">{roomNo}</span>
        </div>

        <div className="appointment-detail">
          <span className="appointment-label">Fee:</span>
          <span className="appointment-value">
            Rs. {Number(appointment.appFee).toFixed(2)}
          </span>
        </div>

        <div
          className="appointment-detail"
          style={{
            textTransform: "capitalize",
            fontWeight: "600",
            color:
              normalizedStatus === "paid"
                ? "green"
                : normalizedStatus === "unpaid"
                ? "red"
                : "orange",
          }}
        >
          <span className="appointment-label">Status:</span>
          <span className="appointment-value">{normalizedStatus}</span>
        </div>

        {normalizedStatus === "pending" && (
          <div className="status-buttons">
            <button
              className="status-button paid-button"
              onClick={() => updateStatus("PAID")}
              disabled={updating}
            >
              Mark as Paid
            </button>
            <button
              className="status-button unpaid-button"
              onClick={() => updateStatus("UNPAID")}
              disabled={updating}
            >
              Mark as Unpaid
            </button>
          </div>
        )}

        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Back to appointment list"
          type="button"
        >
         Back to List
        </button>
      </div>
    </>
  );
}
