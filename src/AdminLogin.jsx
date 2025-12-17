import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/admin-app/admins/login', {
        username,
        password,
      });

      const resMsg = response.data; 
      setMessage(resMsg); 
      
      if (resMsg.startsWith("Login successful")) {
        setSuccess(true);

        // Extract username from response
        const parts = resMsg.split(" ");
        const extractedName = parts[parts.length - 1]; 

        setTimeout(() => {
          navigate('/Dashboard', { state: { adminName: extractedName } });
        }, 1500);

      } else {
        setSuccess(false);
      }

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data); 
      } else {
        setMessage("Server error");
      }
      setSuccess(false);                
    }
  };

  return (
    <div className="login-container">
      {success && <div className="success-message">{message}</div>}
      <div className="image-section"></div>
      <div className="form-section">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="logo-container">
            <img src="https://marketplace.canva.com/EAGRjfBo4m8/1/0/1600w/canva-black-and-blue-simple-medical-health-logo-yBkbRLyHF1o.jpg" alt="VaidyaMitra Logo" className="logo" />
            <h2>VAIDYA HOSPITALS</h2>
            <p className="sub-logo-text">Welcome CAS</p>
          </div>
          <div className="heading">
            <h1>Admin Login</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit">Login</button>
          <div className="message">{!success && message}</div>
          
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
