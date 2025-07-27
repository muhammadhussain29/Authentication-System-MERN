import React, { useContext, useRef, useState, useEffect } from 'react'
import { MdAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from "gsap";
import axios from 'axios';
import { toast } from 'react-toastify';
import AppContext from '../../context/AppContext';

const ForgetPassword = () => {

  const navigate = useNavigate();

  const { serverURL, isLoggedIn } = useContext(AppContext); 

    useEffect(() => {
      if (isLoggedIn) {
        navigate("/")
      }
    }, [])

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [otpValue, setOtpValue] = useState("")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const inputsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false)

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };
  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const [state, setState] = useState("email") // email, otp, new-password

  const handleAnimation = (currentState, targetState) => {

    gsap.to(currentState, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        const nextState = targetState.replace("#", "");
        setState(nextState);

        // Add small delay to ensure DOM is ready
        requestAnimationFrame(() => {
          setTimeout(() => {
            gsap.from(
              targetState,
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.inOut" }
            );
          }, 50);
        });
      }
    })

    gsap.from('#animationDiv', {
      x: 450,
      y: -1200,
      duration: 0.8,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "email") {
        setIsLoading(true)
        const response = await axios.post(`${serverURL}/api/auth/send-reset-otp`, { email });
        setIsLoading(false)
        if (response.data.success) {
          toast.success(response.data.msg)
          handleAnimation("#email", "#otp");
        } else {
          toast.error(response.data.msg)
          return 0;
        }
      }

      if (state === "otp") {
        const otpJoin = otp.join('');
        if (otpJoin.length < 6) {
          toast.info("Please enter the complete OTP")
          return;
        }
        setOtpValue(otpJoin)
        handleAnimation("#otp", "#newPassword");
      }

      if (state === "newPassword") {
        setIsLoading(true)
        const response = await axios.post(`${serverURL}/api/auth/reset-password`, { email, otp: otpValue, newPassword });
        if (response.data.success) {
          setEmail("")
          setOtp(new Array(6).fill(''))
          setOtpValue("")
          setNewPassword("")
          setIsLoading(false)
          toast.success("Password Reset Successful")
          navigate('/auth');
        }
        else if (!response.data.success && (response.data.msg == "invalid otp" || response.data.msg == "OTP expired")) {
          toast.error(response.data.msg)
          setOtp(new Array(6).fill(''))
          setOtpValue("")
          handleAnimation("#newPassword", "#otp");
          setNewPassword("")
          setIsLoading(false)
          return
        }
        else {
          setIsLoading(false)
          handleAnimation("#newPassword", "#otp");
          toast.error(response.data.msg)
          return 0;
        }
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(response.data.msg)
    }
  };

  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);

  const handleResendOtp = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post('http://localhost:4000/api/auth/send-reset-otp', { email });
      setIsLoading(false)
      if (response.data.success) {
        toast.info("OTP sent");
        setResendDisabled(true);
        setTimer(60); // Start from 60 seconds

        const countdown = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              setResendDisabled(false);
              return 60;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Something went wrong while resending OTP");
      setIsLoading(false)
    }
  };


  return (
    <section className='roboto text-zinc-300 flex justify-between text-center overflow-hidden relative mx-auto my-12 md:w-[450px] w-[270px] h-[450px] rounded-2xl shadow-[0_0px_35px_rgba(0,0,0,0.25)] shadow-red-600 border-2 border-red-600 md:p-5 p-3'>

      {isLoading && (
        <div className="fixed top-0 left-0 bg-red-600/20 w-screen h-screen flex justify-center items-center">
          <div style={{ animationDuration: "3s" }} className="md:w-24 md:h-24 w-10 h-10 border-4 border-red-600 border-dashed rounded-full animate-spin"></div>
        </div>
      )}


      {/* moving animation div */}
      <div id='animationDiv' className='absolute top-72 right-72 -rotate-45 bg-red-600 w-[450px] h-[1000px] -z-10'></div>

      {/* Email form to send password reset otp */}
      {state == "email" &&
        <form id='email' onSubmit={(e) => handleSubmit(e)} className='w-full h-full flex flex-col justify-center items-center'>
          <h3 className='md:text-4xl text-2xl md:mb-5 mb-2 font-bold text-red-600' >Forgot password!</h3>
          <p className='md:text-base text-xs text-center leading-tight'>Enter your email address and we’ll send you a OTP to reset your password.</p>

          <div className='flex justify-between items-center md:text-base text-sm border-b-2 my-7'>
            <input value={email} onChange={handleChangeEmail} type="email" name='email' placeholder='Enter Email' className='md:w-[250px] w-[200px] focus:outline-0' />
            <MdAlternateEmail className='text-xl' />
          </div>

          <button type='submit' className='bg-red-600 hover:bg-red-700 transition cursor-pointer md:px-6 px-2 md:py-1.5 py-1 rounded-2xl w-[80%]'>Send OTP</button>
          <p className="md:text-sm text-xs pt-4">Remembered your password? <Link to="/auth" className='text-red-600 hover:text-red-700 transition cursor-pointer'>Login Here!</Link></p>

        </form>}

      {/* enter otp form */}
      {state == "otp" &&
        <form id='otp' onSubmit={(e) => handleSubmit(e)} className='w-full h-full flex flex-col justify-center items-center'>
          <h3 className='md:text-4xl text-2xl md:mb-5 mb-2 font-bold text-red-600' >Reset Password</h3>
          <p className='md:text-base text-xs text-center leading-tight'>Enter six digit OTP sent to your email.</p>

          <div className="flex justify-center gap-2 my-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="md:w-12 w-8 md:h-12 h-8 md:text-xl text-base text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button type='submit' className='bg-red-600 hover:bg-red-700 transition cursor-pointer md:px-6 px-2 md:py-1.5 py-1 rounded-2xl w-[80%]'>Reset Password</button>
          <p className='md:text-sm text-xs mt-2' >Didn’t receive the OTP? <span
            onClick={!resendDisabled ? handleResendOtp : null}
            className={`transition cursor-pointer ${resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-700"
              }`}
          >
            {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
          </span>
          </p>
        </form>}

      {/* enter new password*/}
      {state == "newPassword" &&
        <form id='newPassword' onSubmit={(e) => handleSubmit(e)} className='w-full h-full flex flex-col justify-center items-center'>
          <h3 className='md:text-4xl text-2xl md:mb-5 mb-2 font-bold text-red-600' >New Password</h3>
          <p className='md:text-base text-xs text-center leading-tight'>Enter your new password below.</p>

          <div className='flex justify-between items-center md:text-base text-sm border-b-2 my-7'>
            <input value={newPassword} onChange={handleChangeNewPassword} type="password" name='password' placeholder='Enter New Password' className='md:w-[250px] w-[200px] focus:outline-0' />
            <FaLock className='text-xl' />
          </div>

          <button type='submit' className='bg-red-600 hover:bg-red-700 transition cursor-pointer md:px-6 px-2 md:py-1.5 py-1 rounded-2xl w-[80%]'>Reset Password</button>

        </form>}


    </section>
  )
}

export default ForgetPassword
