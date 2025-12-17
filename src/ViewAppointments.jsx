import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { MdDashboard } from "react-icons/md";

const API_DOCTOR = "http://localhost:8083/doctor-app/doctors";
const API_APPOINTMENT = "http://localhost:8086/appointment-app/appointments";
const API_ROOM = "http://localhost:8084/room-app/rooms";

export default function ViewAppointments() {
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  const [doctorRooms, setDoctorRooms] = useState({});


  
  const formatDateLocal = (date) => {
    if (!date) return null;
    return date.toLocaleDateString("en-CA");
  };

  
  const fetchAppointments = useCallback(async () => {
    try {
      const params = {};
      if (selectedDoctorId) params.doctorId = selectedDoctorId;
      if (selectedDate) params.date = formatDateLocal(selectedDate);
      const res = await axios.get(API_APPOINTMENT, { params });
      setAppointments(res.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    }
  }, [selectedDoctorId, selectedDate]);

  // Load all specializations on mount
  useEffect(() => {
    axios
      .get(`${API_DOCTOR}/specializations`)
      .then((res) => setSpecializations(res.data))
      .catch(() => toast.error("Failed to load specializations"));
  }, []);

  // Load all doctors
  useEffect(() => {
    axios
      .get(API_DOCTOR)
      .then((res) => setDoctors(res.data))
      .catch(() => toast.error("Failed to load doctors"));
  }, []);

  // Load doctors by specialization
  useEffect(() => {
    if (selectedSpec) {
      axios
        .get(`${API_DOCTOR}/by-specialization/${selectedSpec}`)
        .then((res) => setDoctors(res.data))
        .catch(() => toast.error("Failed to load doctors for specialization"));
    } else {
      axios
        .get(API_DOCTOR)
        .then((res) => setDoctors(res.data))
        .catch(() => toast.error("Failed to load doctors"));
      setSelectedDoctorId("");
    }
  }, [selectedSpec]);

  
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
  if (doctors.length > 0) {
    const fetchRooms = async () => {
      const roomMap = {};
      await Promise.all(
        doctors.map(async (doc) => {
          try {
            const res = await axios.get(`${API_ROOM}/doctors/${doc.id}`);//
            roomMap[doc.id] = res.data?.roomNo ?? "Not Assigned";
          } catch (err) {
            roomMap[doc.id] = "Not Assigned";
          }
        })
      );
      setDoctorRooms(roomMap);
    };

    fetchRooms();
  }
}, [doctors]);


  const doctorMap = useMemo(() => {
    const map = {};
    doctors.forEach((doc) => {
      map[doc.id] = doc.name;
    });
    return map;
  }, [doctors]);

  const handleEdit = (app) => {
    setEditingId(app.id);
    setEditForm({ ...app });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_APPOINTMENT}/${editingId}`, editForm);
      toast.success("Appointment updated successfully");
      setEditingId(null);
      fetchAppointments();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`${API_APPOINTMENT}/${id}`);
        toast.success("Appointment deleted");
        fetchAppointments();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const handleView = (app) => {
    navigate(`/appointments/${app.id}`);
  };

  const handleClear = () => {
    setSelectedSpec("");
    setSelectedDoctorId("");
    setSelectedDate(null);
    fetchAppointments();
  };

    const containerStyle = {
      width: "100%",
      overflowX: "auto",
      padding: "24px 30px",
      margin: "40px auto",
      border: "1px solid #e1e4e8",
      borderRadius: "10px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    };

    const dateInputStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "180px",
    cursor: "pointer",
  };


  const headerBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "8px",
  };

  const headerLeftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

 

  const filterContainerStyle = {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap",
  };

  

  const selectStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "180px",
    cursor: "pointer",
  };

  const filterButtonStyle = {
    backgroundColor: "#0d6efd",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const clearButtonStyle = {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const tableStyle = {
  width: "120%",
  minWidth: "1400px",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
  fontSize: "13px",
  tableLayout: "fixed", 
};



  const thStyle = {
    textAlign: "left",
    padding: "12px 15px",
    backgroundColor: "#f8f9fa",
    color: "#495057",
    fontWeight: "700",
    borderBottom: "2px solid #dee2e6",
  };

  const tdStyle = {
    padding: "12px 15px",
    backgroundColor: "#fff",
    color: "#212529",
    verticalAlign: "middle",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    wordWrap: "break-word", // handles long content gracefully
    overflowWrap: "break-word",
  };


  const inputStyle = {
    padding: "6px 10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
    minWidth: "120px", // prevents inputs from being too squished
  };


  const actionsTdStyle = {
    ...tdStyle,
    width: "140px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: "15px",
  };

  const actionIconStyle = {
    cursor: "pointer",
    fontSize: "22px",
    flexShrink: 0,
    transition: "color 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={headerBarStyle}>
        <div style={headerLeftStyle}>
         <button
          style={{
            backgroundColor: "#0d6efd",
            color: "white",
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <MdDashboard style={{ fontSize: "16px" }} />
          Dashboard
        </button>

          <h2 style={{ margin: 0 }}>View Appointments</h2>
        </div>
        <button
          onClick={() => navigate("/appointment")}
          style={{
            backgroundColor: "#198754",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          + Add Appointment
        </button>
      </div>

      <div style={filterContainerStyle}>
        <select
          style={selectStyle}
          value={selectedSpec}
          onChange={(e) => setSelectedSpec(e.target.value)}
        >
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <select
          style={selectStyle}
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          disabled={!selectedSpec}
        >
          <option value="">All Doctors</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Filter by date"
          dateFormat="yyyy-MM-dd"
          isClearable
          customInput={<input style={dateInputStyle} />}
        />

        <button onClick={fetchAppointments} style={filterButtonStyle}>
          Filter
        </button>

        <button onClick={handleClear} style={clearButtonStyle}>
          Clear
        </button>
      </div>

      {appointments.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>App No</th>
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Room No</th>
              <th style={thStyle}>Fee</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, width: "140px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app, index) => (
              <tr key={app.id}>
                <td style={tdStyle}>{index + 1}</td>
                {editingId === app.id ? (
                  <>
                    <td style={tdStyle}>{app.appNumber}</td>
                    <td style={tdStyle}>{doctorMap[app.doctorId] || app.doctorId}</td>
                    <td style={tdStyle}>
                      <input
                        name="patientName"
                        value={editForm.patientName}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        name="patientContact"
                        value={editForm.patientContact}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        name="appDate"
                        value={editForm.appDate}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    </td>
                    <td style={tdStyle}>
                    <input
                      name="appTime"
                      value={editForm.appTime}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    {doctorRooms[app.doctorId] || "Not Assigned"}
                  </td>

                    <td style={tdStyle}>
                      <input
                        name="appFee"
                        value={editForm.appFee}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                    </td>
                    <td style={tdStyle}>
                      <select
                        name="status"
                        value={editForm.status || "pending"}
                        onChange={handleInputChange}
                        style={{ ...inputStyle, padding: "6px 8px" }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                      </select>
                    </td>
                    <td style={actionsTdStyle}>
                      <button
                        onClick={handleUpdate}
                        style={{
                          backgroundColor: "#198754",
                          color: "white",
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "6px",
                          fontWeight: "600",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        style={{
                          backgroundColor: "#6c757d",
                          color: "white",
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={tdStyle}>{app.appNumber}</td>
                    <td style={tdStyle}>{doctorMap[app.doctorId] || app.doctorId}</td>
                    <td style={tdStyle}>{app.patientName}</td>
                    <td style={tdStyle}>{app.patientContact}</td>
                    <td style={tdStyle}>{app.appDate}</td>
                    <td style={tdStyle}>{app.appTime}</td>
                    <td style={tdStyle}>
                      {doctorRooms[app.doctorId] || "Not Assigned"}
                    </td>
                    <td style={tdStyle}>{app.appFee}</td>
                    <td
                        style={{
                          ...tdStyle,
                          fontWeight: "600",
                          color:
                            app.status?.toLowerCase() === "paid"
                              ? "green"
                              : app.status?.toLowerCase() === "unpaid"
                              ? "red"
                              : "orange",
                        }}
                      >
                        {(app.status || "pending").toUpperCase()}
                      </td>

                    <td style={actionsTdStyle}>
                      <FaEye
                        onClick={() => handleView(app)}
                        style={{ ...actionIconStyle, color: "#0d6efd" }}
                        title="View"
                      />
                      <FaEdit
                        onClick={() => handleEdit(app)}
                        style={{ ...actionIconStyle, color: "#198754" }}
                        title="Edit"
                      />
                      <FaTrash
                        onClick={() => handleDelete(app.id)}
                        style={{ ...actionIconStyle, color: "#dc3545" }}
                        title="Delete"
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#6c757d", fontStyle: "italic" }}>
          No appointments found.
        </p>
      )}
    </div>
  );
}
