// Updated RoomsPage.js with doctor uniqueness check during edit

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDashboard } from "react-icons/md";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_ROOM = "http://localhost:8084/room-app/rooms";
const API_DOCTOR = "http://localhost:8083/doctor-app/doctors";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchRoomType, setSearchRoomType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    fetchDoctors();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(API_ROOM);
      setRooms(res.data);
    } catch (error) {
      toast.error("Error fetching rooms");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(API_DOCTOR);
      setDoctors(res.data);
    } catch (error) {
      toast.error("Error fetching doctors");
    }
  };

  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d.id === id);
    return doc ? doc.name : "Not Assigned";
  };

  const handleSearchByRoomType = async () => {
    if (!searchRoomType.trim()) {
      toast.warning("Enter Room Type to search");
      return;
    }

    try {
      const res = await axios.get(`${API_ROOM}?roomType=${searchRoomType}`);
      setRooms(res.data);
    } catch (error) {
      toast.error("Search by Room Type failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`${API_ROOM}/${id}`);
        toast.success("Room Deleted successfully!");
        setRooms(rooms.filter((room) => room.id !== id));
      } catch (error) {
        toast.error("Error deleting room!");
      }
    }
  };

  const handleEditClick = (room) => {
    setEditingId(room.id);
    setEditForm({ ...room });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const payload = {
      doctorId: editForm.doctorId ? parseInt(editForm.doctorId) : null,
      roomNo: parseInt(editForm.roomNo),
      roomType: editForm.roomType,
      floor: parseInt(editForm.floor),
      status: editForm.doctorId ? "ASSIGNED" : "FREE",
    };

    if (isNaN(payload.roomNo) || !payload.roomType || isNaN(payload.floor)) {
      toast.error("Please fill all required fields!");
      return;
    }

    // ✅ Prevent assigning same doctor to multiple rooms (excluding current)
    if (payload.doctorId) {
      const doctorAssignedElsewhere = rooms.some(
        (room) =>
          room.doctorId === payload.doctorId && room.id !== editingId
      );
      if (doctorAssignedElsewhere) {
        const doctor = doctors.find((doc) => doc.id === payload.doctorId);
        toast.error(`Doctor ${doctor?.name || ""} is already assigned to another room.`);
        return;
      }
    }

    try {
      await axios.put(`${API_ROOM}/${editingId}`, payload);
      setRooms(rooms.map((room) => room.id === editingId ? { ...room, ...payload } : room));
      toast.success("Room updated successfully!");
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      toast.error("Error updating room!");
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
          <h2 style={{ margin: 0 }}>Room Management</h2>
        </div>
        <button style={addButtonStyle} onClick={() => navigate("/add-room")}>
          + Add Room
        </button>
      </div>

      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="Search by Room Type"
          value={searchRoomType}
          onChange={(e) => setSearchRoomType(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSearchByRoomType} style={buttonStyle}>
          Search
        </button>
        <button onClick={fetchRooms} style={resetButtonStyle}>
          Reset
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Room Type</th>
            <th style={thStyle}>Room No</th>
            <th style={thStyle}>Floor</th>
            <th style={thStyle}>Doctor</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td style={tdStyle}>{room.id}</td>
              {editingId === room.id ? (
                <>
                  <td>{room.roomType}</td>
                  <td>{room.roomNo}</td>
                  <td>{room.floor}</td>
                  <td style={tdStyle}>
                    <select
                      name="doctorId"
                      value={editForm.doctorId}
                      onChange={handleEditInputChange}
                      style={inlineInputStyle}
                    >
                      <option value="">Unassigned</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditInputChange}
                      style={inlineInputStyle}
                    >
                      <option value="FREE">FREE</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                    </select>
                  </td>
                  <td style={actionsTdStyle}>
                    <button onClick={handleUpdate} style={resetButtonStyle}>
                      Save
                    </button>
                    <button onClick={handleCancelEdit} style={backButtonStyle}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td style={tdStyle}>{room.roomType}</td>
                  <td style={tdStyle}>{room.roomNo}</td>
                  <td style={tdStyle}>{room.floor}</td>
                  <td style={tdStyle}>{getDoctorName(room.doctorId)}</td>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "600",
                      color:
                        room.status === "ASSIGNED"
                          ? "red"
                          : room.status === "FREE"
                          ? "green"
                          : "#212529",
                    }}
                  >
                    {room.status}
                  </td>
                  <td style={actionsTdStyle}>
                    <FaEdit
                      onClick={() => handleEditClick(room)}
                      style={{ ...actionIconStyle, color: "#198754" }}
                      title="Edit"
                    />
                    <FaTrash
                      onClick={() => handleDelete(room.id)}
                      style={{ ...actionIconStyle, color: "#dc3545" }}
                      title="Delete"
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
          {rooms.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                No rooms found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RoomsPage;

// === Styles (same as your original post) ===
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

const addButtonStyle = {
  backgroundColor: "#198754",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
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
  minWidth: "300px",
};

const inlineInputStyle = {
  padding: "6px 10px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
  height: "32px",
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

const actionIconStyle = {
  cursor: "pointer",
  fontSize: "20px",
  transition: "color 0.3s ease",
};
