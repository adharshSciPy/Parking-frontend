import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import registerImage from '../../assests/register.png'
import { useRegisterMutation } from '../../slices/api/userApiSlice';
import toast from 'react-hot-toast';
import { RegEx } from '../../constants/RegEx';
import { debounce } from 'lodash';


const Register = () => {

  const navigate = useNavigate();
  const fullnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isValidEmail, setIsValidEmail] = useState(true)
  const [isValidPassword, setIsValidPassword] = useState(true)
  const [isValidConfirmpassword, setIsValidConfirmpassword] = useState(true)
  const [isDisabled, setIsDisabled] = useState(true)

  const [register, { isLoading, isError, isSuccess, data }] = useRegisterMutation();

  useEffect(() => {
    fullnameRef.current.focus();
  }, [])

  useEffect(() => {
    const isEmptyFields = [fullname, email, password, confirmPassword].some((field) => field?.trim() === "")
    if (!isEmptyFields && isValidEmail && isValidPassword && isValidConfirmpassword) {
      setIsDisabled(false)
    }
    else {
      setIsDisabled(true)
    }
  }, [fullname, email, password, confirmPassword, isValidEmail, isValidPassword, isValidConfirmpassword])

  const handleOnChange = (value, regEx, setValue, setValid, nextRef) => {
    setValue(value);
    const debouncedFunction = debounce(() => {
      setValid(regEx.test(value))
      if (regEx.test(value)) {
        nextRef?.current?.focus();
      }
    }, 800);
    debouncedFunction();
  }

  const handleClickConfirmPassword = () => {
    if (password === null || password === "" || !isValidPassword) {
      toast.error('Please enter a valid password first', { duration: 600 })
      passwordRef.current.focus();
    }
  }

  const handleChangeConfirmPassword = (value) => {
    setConfirmPassword(value)
    if (password === value) {
      setIsValidConfirmpassword(true)
    }
    else {
      setIsValidConfirmpassword(false)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await register({ fullname, email, password }).unwrap();
      toast.success(res?.message);
      navigate('/login');

    }
    catch (err) {
      console.log('err', err)
      toast.error(err?.data?.message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-blue-200'>
      <div className='h-[60%] w-[80%] md:w-[60%] bg-white flex items-center justify-center'>
        <div className='hidden md:flex bg-blue-200 h-full flex-1  items-center justify-center overflow-hidden'>
          <img src={registerImage} alt="" className='h-full object-cover' />
        </div>

        <div className='h-full flex-1 flex flex-col items-center justify-between p-1 md:p-10'>

          <div className='w-[60%]'>
            <p className='text-2xl font-extralight text-blue-400 mt-10'>Create Account</p>
            <p className='text-xs font-bold text-blue-400'>Create Your free Account</p>
          </div>

          <form className='w-[60%]' onSubmit={submitHandler}>
            <div className='mb-5'>
              <input
                ref={fullnameRef}
                type="text"
                placeholder='full name'
                autoComplete="off"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className='bg-blue-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-900 active:ring-blue-900 focus:border-blue-500 block w-full p-2.5 outline-none' />
            </div>
            <div className={!isValidEmail ? `mb-1` : `mb-5`}>
              <input
                ref={emailRef}
                type="email"
                placeholder='email or phone'
                autoComplete="off"
                value={email}
                onChange={(e) => handleOnChange(e.target.value, RegEx.email, setEmail, setIsValidEmail, passwordRef)}
                className='bg-blue-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5 outline-none' />
            </div>
            {
              !isValidEmail && <p className='text-xs text-red-600 mb-2'>Please enter valid email address</p>
            }
            <div className={!isValidPassword ? `mb-1` : `mb-5`}>
              <input
                ref={passwordRef}
                type="password"
                placeholder='password'
                autoComplete="off"
                value={password}
                onChange={(e) => handleOnChange(e.target.value, RegEx.password, setPassword, setIsValidPassword, confirmPasswordRef)}
                className='bg-blue-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-900 active:ring-blue-900 focus:border-blue-500 block w-full p-2.5 outline-none' />
            </div>
            {
              !isValidPassword && <p className='text-xs text-red-600 mb-2'>please enter a valid password</p>
            }
            <div className={!isValidConfirmpassword ? `mb-1` : `mb-5`}>
              <input
                ref={confirmPasswordRef}
                type="password"
                placeholder='confirm password'
                autoComplete="off"
                value={confirmPassword}
                onClick={() => handleClickConfirmPassword()}
                onChange={(e) => handleChangeConfirmPassword(e.target.value)}
                className='bg-blue-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-900 active:ring-blue-900 focus:border-blue-500 block w-full p-2.5 outline-none' />
            </div>
            {
              !isValidConfirmpassword && <p className='text-xs text-red-600 mb-2'>password is not matching</p>
            }
            <p className='text-xs mt-1'>already have an account?<span className='ml-1 text-blue-500'><Link to='/login'>Login</Link></span></p>
            <button
              type='submit'
              disabled={isDisabled}
              className={`mt-4 p-2 ${isDisabled ? 'bg-blue-200 hover:bg-blue-200 active:bg-blue-200' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-400'}  rounded-md text-white text-sm w-full`}>Sign Up</button>
          </form>

          <p className='text-sm text-gray-400 font-thin'>parking made easy!</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Register