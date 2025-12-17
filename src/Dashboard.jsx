import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  // const adminName = location.state?.adminName || "Admin";
const [adminName, setAdminName] = useState(() =>
    location.state?.adminName || localStorage.getItem("adminName") || "Admin"
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("calendarNotes");
    return savedNotes ? JSON.parse(savedNotes) : {};
  });
  const [noteInput, setNoteInput] = useState('');

  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

  // ✅ Save adminName to localStorage if passed from login
  useEffect(() => {
    if (location.state?.adminName) {
      localStorage.setItem("adminName", location.state.adminName);
      setAdminName(location.state.adminName);
    }
  }, [location.state?.adminName]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8082/patient-app/patients")
      .then(res => setPatientCount(res.data.length))
      .catch(() => toast.error("Failed to load patient count"));

    axios.get("http://localhost:8083/doctor-app/doctors")
      .then(res => setDoctorCount(res.data.length))
      .catch(() => toast.error("Failed to load doctor count"));

    axios.get("http://localhost:8086/appointment-app/appointments")
      .then(res => setAppointmentCount(res.data.length))
      .catch(() => toast.error("Failed to load appointment count"));
  }, []);

  const saveNote = () => {
    const dateKey = selectedDate.toDateString();
    const updatedNotes = { ...notes, [dateKey]: noteInput };
    setNotes(updatedNotes);
    localStorage.setItem("calendarNotes", JSON.stringify(updatedNotes));
    setNoteInput('');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-left">
          <MdDashboard size={28} color="#fff" />
          <h1>Dashboard</h1>
        </div>

        <div className="nav-links">
          <div className="datetime">
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut style={{ marginRight: '5px' }} />
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h2>Welcome, {adminName} 👋</h2>
          <p>You are now logged into the admin panel. Use the options below to manage the system.</p>
        </section>

        <section className="summary-cards">
          <div className="summary-card patient">
            <h4>Total Patients</h4>
            <p>{patientCount}</p>
          </div>
          <div className="summary-card doctor">
            <h4>Total Doctors</h4>
            <p>{doctorCount}</p>
          </div>
          <div className="summary-card appointment">
            <h4>Total Appointments</h4>
            <p>{appointmentCount}</p>
          </div>
        </section>

        <section className="info-cards">
          <Link to="/patient" className="card">
            <img src="https://img.freepik.com/free-photo/doctor-talking-patient-medium-shot_23-2149856214.jpg?semt=ais_hybrid&w=740" alt="Patients" className="card-icon" />
            <h3>Manage Patients</h3>
          </Link>

          <Link to="/doctor" className="card">
            <img src="https://www.future-doctor.de/wp-content/uploads/2024/08/shutterstock_2480850611.jpg" alt="Doctors" className="card-icon" />
            <h3>Manage Doctors</h3>
          </Link>

          <Link to="/appointments" className="card">
            <img src="https://www.tritonhospital.com/images/appointment/book-appointment.jpeg" alt="Appointments" className="card-icon" />
            <h3>Manage Appointments</h3>
          </Link>

          <Link to="/room" className="card">
            <img src="https://i.dailymail.co.uk/1s/2024/04/03/13/78365235-0-image-m-23_1712147097691.jpg" alt="Rooms" className="card-icon" />
            <h3>Manage Rooms</h3>
          </Link>
        </section>

        <section className="calendar-section">
          <h3>Calendar Notes</h3>
          <Calendar onChange={setSelectedDate} value={selectedDate} />

          <div className="note-section">
            <h4>Notes for: {selectedDate.toDateString()}</h4>
            <textarea
              rows="3"
              placeholder="Write your note here..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <button onClick={saveNote} className="save-note-btn">Save Note</button>

            {notes[selectedDate.toDateString()] && (
              <div className="saved-note">
                <strong>Saved Note:</strong>
                <p>{notes[selectedDate.toDateString()]}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
