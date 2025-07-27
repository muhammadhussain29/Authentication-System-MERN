import React, { useEffect, useState, useContext } from 'react'
import { MdAlternateEmail } from "react-icons/md";
import { FaFacebook, FaInstagram, FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { gsap } from "gsap";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppContext from "../../context/AppContext";
import { toast } from 'react-toastify';

const Auth = () => {

  const { isLoggedIn, setIsLoggedIn, fetchData, serverURL } = useContext(AppContext);

  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);


  const [loginState, setLogin] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      if (loginState) {
        // code for login
        setIsLoading(true)
        const response = await axios.post(`${serverURL}/api/auth/login`, { email, password });
        if (response.data.success) {
          setIsLoggedIn(true)
          fetchData()
          setIsLoading(false)
          navigate("/")
        } else {
          setIsLoading(false)
          toast.error(response.data.msg)
        }
      } else {
        // code for register
        setIsLoading(true)
        const response = await axios.post(`${serverURL}/api/auth/register`, { name, email, password });
        if (response.data.success) {
          setIsLoggedIn(true)
          fetchData()
          setIsLoading(false)
          navigate("/")
        } else {
          setIsLoading(false)
          toast.error(response.data.msg)
        }
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message)
    }
  }

  let toggleLogin = () => {
    setTimeout(() => {
      setLogin(!loginState);
      setEmail('');
      setPassword('');
      setName('');
    }, 600);

    if (loginState) {


      const mm = gsap.matchMedia();

      mm.add({
        isSmall: "(max-width: 640px)",
        isMobile: "(min-width: 640px) and (max-width: 767px)",
        isTablet: "(min-width: 768px)",
      }, (context) => {
        const { isSmall, isMobile, isTablet } = context.conditions;

        // Create a timeline for the rest of the animation
        const tl = gsap.timeline();

        tl.to(['#info', '#form'], {
          opacity: 0,
          duration: 0.2,
        })
          .to('#animationDiv', {
            duration: 0.8,
            x: isSmall ? 0 : isMobile ? -320 : -370,
            y: 300,
          })
          .to('#info', {
            x: isSmall ? 0 : isMobile ? -300 : -360,
            duration: 0.2,
          }, "-=0.3")
          .to('#form', {
            x: isSmall ? 0 : isMobile ? 300 : 360,
            duration: 0.2,
          }, "-=0.2")
          .to(['#info', '#form'], {
            opacity: 1,
            duration: 0.2,
          });
      });

    } else {
      gsap.timeline()
        .to(['#info', '#form'], {
          opacity: 0,
          duration: 0.2,
        })
        .to('#animationDiv', {
          duration: 0.8,
          x: 65,
          y: 300,
        })
        .to(['#info', '#form'], {
          x: 0,
          duration: 0.2,
        }, "-=0.3")
        .to(['#info', '#form'], {
          opacity: 1,
          duration: 0.2,
        });
    }
  };


  const [isLoading, setIsLoading] = useState(false)

  return (
    <section className='roboto text-zinc-300 flex justify-between relative overflow-hidden mx-auto my-12 md:w-[750px] sm:w-[600px] w-[280px] h-[450px] rounded-2xl shadow-[0_0px_35px_rgba(0,0,0,0.25)] shadow-red-600 border-2 border-red-600 md:p-5 p-3'>

      {isLoading && (
        <div className="fixed top-0 left-0 bg-red-600/20 w-screen h-screen flex justify-center items-center">
          <div style={{ animationDuration: "3s" }} className="md:w-24 md:h-24 w-10 h-10 border-4 border-red-600 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* moving animation div */}
      <div id='animationDiv' className='absolute sm:block hidden -bottom-10 -right-5 -rotate-12 bg-red-600 md:w-[420px] sm:w-[340px] h-[900px] -z-10'></div>

      {/* form box */}
      <div id='form' className={`sm:w-1/2 w-full h-full flex flex-col justify-center items-center`}>
        <form onSubmit={(e) => handleForm(e)} className='flex flex-col justify-center items-center'>
          <h3 className='md:text-4xl text-2xl md:mb-5 mb-2 font-bold' >{loginState ? "Login" : "Register"}</h3>
          <div className={`${loginState ? "hidden" : "flex"} justify-between items-center md:text-base text-sm border-b-2 my-4`}>
            <input value={name} onChange={handleChangeName} type="text" name='name' placeholder='Enter Name' className='md:w-[250px] w-[200px] focus:outline-0' />
            <FaUser className='text-xl' />
          </div>
          <div className='flex justify-between items-center md:text-base text-sm border-b-2 my-4'>
            <input value={email} onChange={handleChangeEmail} type="email" name='email' placeholder='Enter Email' className='md:w-[250px] w-[200px] focus:outline-0' />
            <MdAlternateEmail className='text-xl' />
          </div>
          <div className='flex justify-between items-center md:text-base text-sm border-b-2 my-4'>
            <input value={password} onChange={handleChangePassword} type="password" name='password' placeholder='Enter Password' className='md:w-[250px] w-[200px] focus:outline-0' />
            <FaLock className='text-xl' />
          </div>
          <p className={`${loginState ? "block" : "hidden"} text-sm leading-0 mb-3 self-end text-red-600 hover:text-red-700 transition cursor-pointer`}><Link to="/forget-password">Forget Password</Link></p>

          <button type='submit' className='bg-red-600 hover:bg-red-700 transition cursor-pointer md:px-6 px-2 md:py-1.5 py-1 rounded-2xl sm:w-full mt-4 w-[80%]'>{loginState ? "Login" : "Register"}</button>
        </form>

        <p className='md:text-sm text-xs mt-2' >{loginState ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleLogin} className='text-red-600 hover:text-red-700 transition cursor-pointer'>{loginState ? "Register now!" : "Log in here"}</button>
        </p>
      </div>

      {/* Message Box */}
      <div id='info' className={`sm:flex hidden w-1/2 h-full flex-col justify-center items-center px-10 text-center`}>
        <h3 className='text-4xl mb-8 font-bold' >{loginState ? "Welcome Back" : "New Here?"} </h3>
        <p>{loginState ? "We're happy to see you again. Log in to continue where you left off." : "Create your account and start your journey with us today. We're excited to have you on board!"}</p>
        <div className="flex gap-3 justify-evenly items-center mt-6 text-3xl">
          <FaFacebook className='bg-zinc-300 text-red-600 hover:text-red-700 cursor-pointer hover:scale-115 transition-all rounded-full p-1.5' />
          <FaInstagram className='bg-zinc-300 text-red-600 hover:text-red-700 cursor-pointer hover:scale-115 transition-all rounded-full p-1.5' />
          <MdEmail className='bg-zinc-300 text-red-600 hover:text-red-700 cursor-pointer hover:scale-115 transition-all rounded-full p-1.5' />
        </div>
      </div>
    </section>
  )
}

export default Auth