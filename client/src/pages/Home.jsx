import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const home = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedIn, userData, serverURL } = useContext(AppContext);

  const goToAuth = () => {
    navigate('/auth')
  }
  const goToVerifyEmail = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${serverURL}/api/auth/send-verify-otp`);
      if (response.data.success) {
        setIsLoading(false)
        toast.success("Otp Sent")
        navigate('/verify-email')
      } else {
        toast.error(response.data.msg)
        setIsLoading(false)
      }
    } catch (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  return (
    <section className='text-zinc-300 md:px-20 px-4 md:py-4 py-1 flex flex-col items-center justify-center text-center lg:my-24 md:my-16 sm:my-10 my-4 roboto'>

      {isLoading && (
        <div className="fixed top-0 left-0 bg-red-600/20 w-screen h-screen flex justify-center items-center">
          <div style={{ animationDuration: "3s" }} className="md:w-24 md:h-24 w-10 h-10 border-4 border-red-600 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      <h1 className='xl:text-7xl lg:text-6xl sm:text-5xl text-3xl py-0 my-0 text-red-600 bitcount text-center'>Welcome {isLoggedIn ? userData.name : "to Auth"}</h1>
      <p className='md:text-sm text-xs py-0 my-0 text-zinc-400 leading-tighter tracking-widest'>Shielding your world with intelligent security.</p>
      <p className='md:w-2/3 w-full text-center md:text-lg text-sm my-4'>Our security app is designed to keep you safe in a digital world that’s always on. With advanced encryption, real-time threat detection, and seamless user experience, it offers a powerful shield against unauthorized access, data breaches, and cyber threats. Whether you're securing your personal information or protecting your devices, our app ensures peace of mind with every click.</p>

      <button
        onClick={() => {
          if (isLoggedIn) {
            if (!userData.isAccountVerified) {
              goToVerifyEmail();
            }
          } else {
            goToAuth();
          }
        }}
        className="bg-red-600 md:px-8 px-4 md:py-2 py-1 md:text-base text-sm rounded-2xl"
      >
        {isLoggedIn
          ? userData.isAccountVerified
            ? "Learn More"
            : "Verify Email"
          : "Get Started"}
      </button>

    </section>
  )
}

export default home