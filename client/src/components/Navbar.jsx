import React, { useState, useContext, useEffect, useRef } from 'react';
import logo from '/logo.png';
import AppContext from "../../context/AppContext";
import { TiThMenu } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, serverURL, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToVerifyEmail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${serverURL}/api/auth/send-verify-otp`);
      setIsLoading(false);
      if (response.data.success) {
        toast.success("OTP Sent");
        navigate('/verify-email');
        setIsOpen(false); // Close dropdown
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  // Common handler to navigate and close dropdown
  const handleMenuClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${serverURL}/api/auth/logout`);
      if (response.data.success) {
        setIsLoading(false);
        toast.success("Logged out successfully.");
        setIsLoggedIn(false)
        navigate('/');
        setIsOpen(false);
      } else {
        setIsLoading(false);
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  return (
    <nav className='flex justify-between items-center md:px-20 px-4 md:py-4 py-1 inter'>

      {isLoading && (
        <div className="fixed top-0 left-0 bg-red-600/20 w-screen h-screen flex justify-center items-center">
          <div style={{ animationDuration: "3s" }} className="md:w-24 md:h-24 w-10 h-10 border-4 border-red-600 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      <div className='flex md:gap-3 gap-1 items-center'>
        <img src={logo} className='md:w-22 sm:w-16 w-12' alt="Logo" />
        <h4 className='md:text-3xl sm:text-xl text-lg text-red-600 font-bold'><span className='sm:inline hidden'>MERN Authentication System</span></h4>
      </div>

      <div className='relative' ref={dropdownRef}>
        <TiThMenu
          className='md:text-3xl sm:text-xl text-lg text-red-600 cursor-pointer'
          onClick={toggleDropdown}
        />

        {isOpen && (
          <div className='absolute right-0 mt-3 md:w-52 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-50'>
            <ul className='flex flex-col divide-y divide-gray-200'>
              {!isLoggedIn && <>
                <li
                  onClick={() => handleMenuClick("/auth")}
                  className='md:px-5 px-2 md:py-3 py-1 hover:bg-gray-100 cursor-pointer text-gray-700'
                >
                  Login
                </li>
                <li
                  onClick={() => handleMenuClick("/auth")}
                  className='md:px-5 px-2 md:py-3 py-1 hover:bg-gray-100 cursor-pointer text-gray-700'
                >
                  Register
                </li> </>}
              {isLoggedIn &&
                <li
                  onClick={handleLogout}
                  className='md:px-5 px-2 md:py-3 py-1 hover:bg-gray-100 cursor-pointer text-gray-700'
                >
                  Logout
                </li>}
              {(isLoggedIn && !userData.isAccountVerified) &&
                <li
                  onClick={goToVerifyEmail}
                  className='md:px-5 px-2 md:py-3 py-1 hover:bg-gray-100 cursor-pointer text-gray-700'
                >
                  Verify Account
                </li>}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
