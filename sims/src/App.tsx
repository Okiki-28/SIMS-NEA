import React from 'react';
import './App.css';
import MainLayout from './layout/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/LoginPage';
import { Register } from './pages/RegisterPage';
import { Home } from './pages/Homepage';
import { RegisterNew } from './pages/RegisterNew';
import { RegisterExisting } from './pages/RegistserExisting';

function App() {
  return (
    <Router>
        <Routes>
          {/* Runs through the Main Layout format */}
          <Route path='/home' element={<MainLayout><Home /></MainLayout>}/>

          {/* Does not Run through the main layout format */}
          <Route path='/register' element={<Register />}/>
          <Route path='/register-new' element={<RegisterNew />}/>
          <Route path='/register-existing' element={<RegisterExisting />}/>
          <Route path='/login' element={<Login />}/> 
          <Route path='*' element={<h1>Page not found !!</h1>}/>
        </Routes>
    </Router>
  );
}

export default App;
