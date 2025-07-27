import React, { useRef, useState, useContext, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from "../../context/AppContext";
import { toast } from 'react-toastify';

const VerifyEmail = () => {

  const { isLoggedIn, serverURL } = useContext(AppContext);
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [])

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false)
  const inputsRef = useRef([]);

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
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpJoin = otp.join('');
    if (otpJoin.length < 6) {
      toast.info('Please enter the complete OTP');
      return;
    }

    try {
      setIsLoading(true)
      const response = await axios.post(`${serverURL}/api/auth/verify-account`, { otp: otpJoin });
      if (response.data.success) {
        setOtp(new Array(6).fill(''))
        setIsLoading(false)
        toast.success("Email Verifaction Successful")
        navigate('/');
      }
      else if (!response.data.success && (response.data.msg == "invalid otp" || response.data.msg == "OTP expired")) {
        toast.error(response.data.msg)
        setOtp(new Array(6).fill(''))
        setIsLoading(false)
        navigate("/verify-email")
      }
      else {
        setIsLoading(false)
        toast.error(response.data.msg)
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message)
    }

  };

  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);

  const handleResendOtp = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${serverURL}/api/auth/send-verify-otp`);
      setIsLoading(false)
      if (response.data.success) {
        toast.success("OTP sent")
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
      toast.error(error.message)
      setIsLoading(false)
    }
  };


  return (
    <section className='roboto text-zinc-300 flex justify-between relative text-center overflow-hidden mx-auto my-12 md:w-[450px] w-[270px] h-[450px] rounded-2xl shadow-[0_0px_35px_rgba(0,0,0,0.25)] shadow-red-600 border-2 border-red-600 md:p-5 p-3'>

      {isLoading && (
        <div className="fixed top-0 left-0 bg-red-600/20 w-screen h-screen flex justify-center items-center">
          <div style={{ animationDuration: "3s" }} className="md:w-24 md:h-24 w-10 h-10 border-4 border-red-600 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* enter otp form */}
      <form onSubmit={(e) => handleSubmit(e)} className='w-full h-full flex flex-col justify-center items-center'>
        <h3 className='md:text-4xl text-2xl md:mb-5 mb-2 font-bold text-red-600' >Email Verification</h3>
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

        <button type='submit' className='bg-red-600 hover:bg-red-700 transition cursor-pointer md:px-6 px-2 md:py-1.5 py-1 rounded-2xl w-[80%]'>Verify Email</button>
        <p className='md:text-sm text-xs mt-2' >Didn’t receive the OTP? <span
          onClick={!resendDisabled ? handleResendOtp : null}
          className={`transition cursor-pointer ${resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-700"
            }`}
        >
          {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
        </span>
        </p>
      </form>

    </section>
  )
}

export default VerifyEmail