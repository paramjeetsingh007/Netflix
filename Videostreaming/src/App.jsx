import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Corrected import
import Login from './components/login/Login';
import Register from './components/register/Register';
import Homepage from './components/homepage/Homepage';

function App() {
  const [user, setLoginUser] = useState({});

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              user && user._id ? (
                <Homepage setLoginUser={setLoginUser} user={user} />
              ) : (
                <Login setLoginUser={setLoginUser} />
              )
            }
          />
          <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
