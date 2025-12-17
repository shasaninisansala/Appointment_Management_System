
import './App.css';
import LoginForm from './AdminLogin';
import AdminDashboard from './Dashboard';
import { Routes, Route } from 'react-router-dom';
import PatientPage from './Patient';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddPatientPage from './add-patient'
import DoctorsPage from './DoctorsPage'
import AddDoctorPage from './AddDoctorPage'
import AppointmentForm from './AppointmentPage';
import ViewAppointments from './ViewAppointments';
import ViewSingleAppointment from './ViewSingleAppointment';
import AddRoom from './add-room';
import RoomsPage from './Room';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/Dashboard" element={<AdminDashboard />} />
      <Route path="/Patient" element={<PatientPage />} />
      <Route path="/add-patient" element={<AddPatientPage />} />
      <Route path="/doctor" element={<DoctorsPage />} />
      <Route path="/add-doctor" element={<AddDoctorPage />} />
      <Route path="/appointment" element={<AppointmentForm />} />
      <Route path="/appointments/:id" element={<ViewSingleAppointment />} /> 
      <Route path="/room" element={<RoomsPage />} />
      <Route path="/add-room" element={<AddRoom />} />
      <Route path="/appointments" element={<ViewAppointments />} />
      
      
    </Routes>
    {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
    </>
  );
}

export default App;
