import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Pages/Signup.jsx'
import Home from './Pages/HomePage.js'
import Login from './Pages/Login.jsx';
import ForgetPassword from'./Pages/ForgetPassword.jsx';
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/Home" element={<Home />}/>
        <Route path="/ForgetPassword" element={<ForgetPassword/>}/>
        <Route path="/"element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
