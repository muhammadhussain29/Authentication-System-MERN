import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ForgetPassword from './pages/ForgetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Background from './components/background';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
     <ToastContainer autoClose={3000} />
    <Background/>
    <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App