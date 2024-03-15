import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import {
  Home,
  Login,
  Register,
  Bookings,
  LandingPage,
  AdminHome,
  AdminBookings,
  AdminUsers,
  AdminSlotDesign,
} from "../scenes";
import { ForceRedirect, ProtectedRoute } from "../components";
import { setCredentials, setRole } from "../slices/state/authSlices";
import { useVerifyTokenMutation } from "../slices/api/userApiSlice";

const Router = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userRole, setUserRole] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { isLoggedIn } = useSelector((state) => state?.auth);
  const [verifyToken, { data }] = useVerifyTokenMutation();
  const token = JSON.parse(localStorage.getItem("token"));

  // verify token and saving keeping user credentials in state and localstorage
  useEffect(() => {
    const TokenVerify = async () => {
      try {
        const res = await verifyToken({ token });
        if (res) {
          setIsSuccess(true);
          let role = res?.data?.data?.role;
          let userId = res?.data?.data?._id;
          if (role && userId) {
            dispatch(setCredentials({ token }));
            dispatch(setRole({ role, userId }));
            setUserRole(role);
            localStorage.setItem("currentUserRole", role);
            return navigate(`/${role}/home`);
          }
        }
      } catch (err) {
        throw err;
      }
    };
    if (token && !isSuccess) {
      TokenVerify();
    }
  }, [token, dispatch, isSuccess, data, isLoggedIn]);

  const userRoutes = [
    {
      path: "home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "bookings",
      element: (
        <ProtectedRoute>
          <Bookings />
        </ProtectedRoute>
      ),
    },
  ];

  const adminRoutes = [
    {
      path: "home",
      element: (
        <ProtectedRoute>
          <AdminHome />
        </ProtectedRoute>
      ),
    },
    {
      path: "bookings",
      element: (
        <ProtectedRoute>
          <AdminBookings />
        </ProtectedRoute>
      ),
    },
    {
      path: "users",
      element: (
        <ProtectedRoute>
          <AdminUsers />
        </ProtectedRoute>
      ),
    },
    {
      path: "slote-design",
      element: (
        <ProtectedRoute>
          <AdminSlotDesign />
        </ProtectedRoute>
      ),
    },
  ];

  const element = useRoutes([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: (
        <ForceRedirect isLoggedIn={isLoggedIn} role={userRole}>
          {" "}
          <Login />
        </ForceRedirect>
      ),
    },
    {
      path: "/register",
      element: (
        <ForceRedirect isLoggedIn={isLoggedIn} role={userRole}>
          <Register />
        </ForceRedirect>
      ),
    },
    {
      path: "/admin",
      children: [...adminRoutes],
    },
    {
      path: "/user",
      children: [...userRoutes],
    },
  ]);

  const location = useLocation();
  if (!element) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
};

export default Router;
