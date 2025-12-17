import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { MdDashboard } from "react-icons/md";

const API_URL = "http://localhost:8083/doctor-app/doctors";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(API_URL);
      setDoctors(res.data);
    } catch (error) {
      toast.error("Error fetching doctors");
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${API_URL}/search?q=${searchQuery}`);
      setDoctors(res.data);
    } catch (error) {
      toast.error("Search Failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Doctor deleted successfully!");
        fetchDoctors();
      } catch (error) {
        toast.error("Error deleting doctor!");
      }
    }
  };

  const handleEditClick = (doctor) => {
    setEditingId(doctor.id);
    setEditForm({ ...doctor });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${editingId}`, editForm);
      toast.success("Doctor updated successfully!");
      setEditingId(null);
      fetchDoctors();
    } catch (error) {
      toast.error("Error updating doctor!");
    }
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

          <h2 style={{ margin: 0 }}>Doctors Management</h2>
        </div>
        <button style={addButtonStyle} onClick={() => navigate("/add-doctor")}>
          + Add Doctor
        </button>
      </div>

      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSearch} style={buttonStyle}>
          Search
        </button>
        <button onClick={fetchDoctors} style={resetButtonStyle}>
          Clear
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Specialization</th>
            <th style={thStyle}>Available Days</th>
            <th style={thStyle}>Time Slots</th>
            <th style={thStyle}>Fee</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td style={tdStyle}>{doc.id}</td>
              {editingId === doc.id ? (
                <>
                  <td style={tdStyle}>
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditInputChange}
                      style={inlineInputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      name="email"
                      value={editForm.email}
                      onChange={handleEditInputChange}
                      style={inlineInputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      name="specialization"
                      value={editForm.specialization}
                      onChange={handleEditInputChange}
                      style={inlineInputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      name="availableDays"
                      value={editForm.availableDays}
                      onChange={handleEditInputChange}
                      style={inlineInputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      name="timeSlots"
                      value={editForm.timeSlots}
                      onChange={handleEditInputChange}
                      style={inlineInputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      name="doctorFee"
                      value={editForm.doctorFee}
                      onChange={handleEditInputChange}
                      type="number"
                      style={inlineInputStyle}
                    />
                  </td>
                  <td style={actionsTdStyle}>
                    <button onClick={handleUpdate} style={resetButtonStyle}>Save</button>
                    <button onClick={handleCancelEdit} style={backButtonStyle}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={tdStyle}>{doc.name}</td>
                  <td style={tdStyle}>{doc.email}</td>
                  <td style={tdStyle}>{doc.specialization}</td>
                  <td style={tdStyle}>{doc.availableDays}</td>
                  <td style={tdStyle}>{doc.timeSlots}</td>
                  <td style={tdStyle}>Rs.{Number(doc.doctorFee).toFixed(2)}</td>
                  <td style={actionsTdStyle}>
                    <FaEdit
                      style={{ ...iconStyle, color: "#198754" }}
                      onClick={() => handleEditClick(doc)}
                      title="Edit"
                    />
                    <FaTrash
                      style={{ ...iconStyle, color: "#dc3545" }}
                      onClick={() => handleDelete(doc.id)}
                      title="Delete"
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
          {doctors.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                No doctors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// === Styles ===

const containerStyle = {
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "24px 30px",
  border: "1px solid #e1e4e8",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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

const backButtonStyle = {
  backgroundColor: "#6c757d",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
};

const addButtonStyle = {
  backgroundColor: "#198754",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  marginLeft: "auto",
};

const filterContainerStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const inputStyle = {
  padding: "8px 12px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minWidth: "400px",
};

const inlineInputStyle = {
  padding: "6px 10px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
  height: "32px",
  overflow: "hidden",
};

const buttonStyle = {
  backgroundColor: "#0d6efd",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

const resetButtonStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
  fontSize: "14px",
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
};

const actionsTdStyle = {
  ...tdStyle,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
};

const iconStyle = {
  cursor: "pointer",
  fontSize: "18px",
};



