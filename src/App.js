import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const [loginStatus, setLoginStatus] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              registerStatus={registerStatus}
              setRegisterStatus={setRegisterStatus}
            />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
