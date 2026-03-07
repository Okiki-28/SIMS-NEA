import React from 'react';
import './App.css';
import MainLayout from './layout/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/LoginPage';
import { Logout } from './pages/Logout';
import { Register } from './pages/RegisterPage';
import { Home } from './pages/Homepage';
import { RegisterNew } from './pages/RegisterNew';
import { RegisterExisting } from './pages/RegistserExisting';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { CounterSale } from './pages/CounterSale';

function App() {
  return (
    <Provider store={store}>
      <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            {/* Runs through the Main Layout format */}
            <Route path='/' element={<MainLayout><Home /></MainLayout>}/>
            <Route path='/home' element={<MainLayout><Home /></MainLayout>}/>
            <Route path='/dashboard' element={<MainLayout><Dashboard /></MainLayout>}/>
            <Route path='/inventory' element={<MainLayout><Inventory /></MainLayout>}/>
            <Route path='/counter-sale' element={<MainLayout><CounterSale /></MainLayout>}/>
            <Route path='/settings' element={<MainLayout><Settings /></MainLayout>}/>
            <Route path='/reports' element={<MainLayout><Reports /></MainLayout>}/>

            {/* Does not Run through the main layout format */}
            <Route path='/register' element={<Register />}/>
            <Route path='/register-new' element={<RegisterNew />}/>
            <Route path='/register-existing' element={<RegisterExisting />}/>
            <Route path='/login' element={<Login />}/> 
            <Route path='/logout' element={<Logout />}/> 
            <Route path='*' element={<h1>Page not found !!</h1>}/>
          </Routes>
      </Router>
    </Provider>
  );
}

export default App;
