import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useLoginMutation } from "../../slices/api/userApiSlice";
import { setCredentials } from "../../slices/state/authSlices";
import { RegEx } from "../../constants/RegEx";
import toast from "react-hot-toast";
import loginImg from "../../assests/login.png";
import { Tooltip } from 'antd';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const [emailInteracted, setEmailInteracted] = useState(false);
  const [passwordInteracted, setPasswordInteracted] = useState(false);

  const [login, { isLoading, isError, data, isSuccess }] = useLoginMutation();

  useEffect(() => {
    const isEmptyFields = [email, password].some(
      (field) => field?.trim() === ""
    );
    if (!isEmptyFields && isValidEmail && isValidPassword) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [email, password, isValidEmail, isValidPassword]);

  // onChange handler
  // const handleOnChange = (value, setState, isIntracted, setIsValid, regEx) => {
  //   setState(value)
  //   if (isIntracted) {
  //     setIsValid(regEx?.test(value))
  //   }
  // }

  const handleOnChange = (value, setState, isIntracted, setIsValid, regEx) => {
    setState(value)
    if (isIntracted) {
      setIsValid(regEx.test(value))
    }
  }
  

  // focus handler
  // const handleBlur = (state, setIntracted, setIsValid, regEx) => {
  //   setIntracted(true);
  //   setIsValid(regEx.test(state));
  // }

  const handleBlur = (state, setInteracted, setValidity, regEx) => {
      setInteracted(true);
      setValidity(regEx.test(state));
  };
  

  const toggleIsPassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  //submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      const token = res?.token;
      toast.success("Logged In Successfully");
      dispatch(setCredentials({ token }));
      window.location.reload(false);
    } catch (err) {
      emailRef.current.focus;
      setEmail("");
      setPassword("");
      setIsDisabled(true);
      setEmailInteracted(false);
      setPasswordInteracted(false);
      let errMessage = err?.data?.message
        ? err?.data?.message
        : "Login Failed!";
      toast.error(errMessage);
      console.error("Error during login:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-blue-200"
    >
      <div className="h-[60%] min-h-[60%] w-[80%] md:w-[60%] bg-white flex items-center justify-center">
        <div className="hidden md:flex *:bg-blue-300 h-full flex-1  items-center justify-center overflow-hidden">
          <img src={loginImg} alt="" className="h-full object-cover" />
        </div>

        <div className="h-full flex-1 flex flex-col items-center justify-between p-1 md:p-10">
          <p className="text-4xl font-bold text-blue-400 mt-5">Login</p>

          <form className="w-[60%]" onSubmit={submitHandler}>
            <div className={!isValidEmail && emailInteracted ? `mb-1` : `mb-5`}>
              <input
                type="email"
                placeholder="email or phone"
                autoComplete="off"
                ref={emailRef}
                value={email}
                onChange={(e) => handleOnChange(e.target.value, setEmail, emailInteracted, setIsValidEmail, RegEx.email)}
                onBlur={() => handleBlur(email, setEmailInteracted, setIsValidEmail, RegEx.email)}
                className="bg-blue-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:border-blue-800 active:ring-blue-500 block w-full p-2.5 outline-none"
              />
              {!isValidEmail && emailInteracted && (
                <p className="text-xs text-red-600 mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>
            <div className={!isValidPassword && passwordInteracted ? `mb-1` : `mb-5`}>
              <div className="relative">
                <Tooltip placement="right" title="Password must contain at least 8 characters, including uppercase, lowercase, and special characters">
                  <input
                    type={`${isPasswordVisible ? "text" : "password"}`}
                    autoComplete="off"
                    placeholder="password"
                    ref={passwordRef}
                    value={password}
                    onChange={(e) => handleOnChange(e.target.value, setPassword, passwordInteracted, setIsValidPassword, RegEx.passwordRegex)}
                    onBlur={() => handleBlur(password, setPasswordInteracted, setIsValidPassword, RegEx.passwordRegex)}
                    className="bg-blue-50 border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-500 block w-full p-2.5 outline-none"
                  />
                </Tooltip>
                {!isValidPassword && passwordInteracted && (
                  <p className="text-xs text-red-600 mt-1">
                    Please enter a valid password
                  </p>
                )}
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={toggleIsPassword}
                >
                  <i
                    className={`${isPasswordVisible
                      ? "fa-regular fa-eye"
                      : "fa-regular fa-eye-slash"
                      }`}
                  ></i>
                </div>
              </div>
            </div>

            <p className={`text-xs mt-2`}>
              create a new account
              <span className="ml-1 text-blue-500">
                <Link to="/register">Sign Up</Link>
              </span>
            </p>
            <button
              type="submit"
              disabled={isDisabled}
              className={`mt-4 p-2 ${isDisabled
                ? "bg-blue-200 hover:bg-blue-200 active:bg-blue-200"
                : "bg-blue-500 hover:bg-blue-600 active:bg-blue-400"
                }   rounded-md text-white text-sm w-full`}
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-400 font-bold">
            {isLoading ? "Validating credentials" : "parking made easy!"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
