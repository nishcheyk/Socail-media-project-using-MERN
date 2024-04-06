import {useState} from 'react'
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup.jsx'

import Login from './Login.jsx';
import React from 'react';

import { BrowserRouter as Router, Routes, Route,Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
