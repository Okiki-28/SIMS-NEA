import React from 'react';
import './App.css';
import MainLayout from './layout/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/LoginPage';
import { Register } from './pages/RegisterPage';
import { Home } from './pages/Homepage';
import { RegisterNew } from './pages/RegisterNew';
import { RegisterExisting } from './pages/RegistserExisting';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';

import { Provider } from 'react-redux';
import { authStore } from './store/authstore';

function App() {
  return (
    <Provider store={authStore}>
      <Router>
          <Routes>
            {/* Runs through the Main Layout format */}
            <Route path='/' element={<MainLayout><Home /></MainLayout>}/>

            {/* Does not Run through the main layout format */}
            <Route path='/register' element={<Register />}/>
            <Route path='/register-new' element={<RegisterNew />}/>
            <Route path='/register-existing' element={<RegisterExisting />}/>
            <Route path='/login' element={<Login />}/> 
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/inventory' element={<Inventory/>}/>
            <Route path='*' element={<h1>Page not found !!</h1>}/>
          </Routes>
      </Router>
    </Provider>
  );
}

export default App;
