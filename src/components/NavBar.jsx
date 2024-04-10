import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Navlink from './Navlink';
import { setLogout } from '../slices/state/authSlices';
import { useLogoutMutation } from '../slices/api/userApiSlice';
import { Badge } from 'antd'
import { setNotifications } from '../slices/state/notificationSlice'

const userNavLinks = [
  { url: '/user/home', title: 'Home' },
  { url: '/user/bookings', title: 'Bookings' }
]

const adminNavLinks = [
  { url: '/admin/home', title: 'Home' },
  { url: '/admin/bookings', title: 'Bookings' },
  { url: '/admin/users', title: 'Users' }
]

const authLinks = [
  { url: '/', title: 'Home' },
  { url: '/register', title: 'Register' },
  { url: '/login', title: 'Login' }
]


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [links, setLinks] = useState(authLinks)
  const [isBadge, setIsBadge] = useState(true)
  const [isShow, setIsShow] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const notifyRef = useRef();

  const { isLoggedIn, userRole } = useSelector((state) => state?.auth);
  const { notifications } = useSelector((state) => state?.notification);
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (isLoggedIn && userRole === 'admin') {
      setLinks(adminNavLinks)
    }
    else if (isLoggedIn && userRole === 'user') {
      setLinks(userNavLinks)
    }
    else {
      setLinks([])
    }
  }, [isLoggedIn, userRole])

  useEffect(() => {
    if (isShow) {
      document.body.style.overflow = "hidden";
    }
    else {
      document.body.style.overflow = "scroll";
    }
  }, [isShow])

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res) {
        dispatch(setLogout());
        navigate('/login', { replace: true })
        toast.success('Logout Succesfully');
        window.location.reload()
      }
    }
    catch (err) {
      toast.error('Logout Failed')
      console.log(err)
    }
  }

  const handleClear = () => {
    dispatch(setNotifications(null))
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setIsShow(false)
      }
    };

    const handleEscapeKeyPress = (event) => {
      if (event.key === 'Escape') {
        setIsShow(false)
      }
    };

    if (isShow) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKeyPress);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [isShow]);


  return (
    <div className={`${isLoggedIn && 'shadow-sm'} z-10 mb-0 min-h-100 h-20 w-screen bg-white sticky top-0  flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 xl:text-xl`}>

      {/* logo */}
      <div onClick={() => navigate('/')} className='flex w-1/4'>
        <Link className='rounded-md p-1 text-sm font-semibold flex items-center justify-center md:text-lg text-zinc-500 hover:text-blue-500'>
          Parking
        </Link>
      </div>


      <div className='hidden md:flex items-center justify-center gap-4 w-1/4 text-md hover:text-opacity-20'>
        {
          links.map((item, index) => {
            return (
              <Navlink link={item} key={index} />
            )
          })
        }
      </div>
      {
        isLoggedIn ?
          <div className='hidden w-1/4 md:flex justify-end gap-8'>
            <button className='flex items-center justify-between outline-none' onClick={() => setIsShow((prev) => !prev)}>
              <Badge count={notifications?.length} color="red" offset={[1, 3]}>
                {
                  isShow ?
                    <i className="fa-solid fa-bell text-xl text-blue-900"></i>
                    :
                    <i class="fa-regular fa-bell text-xl text-blue-900"></i>
                }
              </Badge>
            </button>

            <button type='submit' onClick={() => handleLogout()} className='bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md px-4 py-2 flex items-center justify-center'>
              Logout
            </button>
          </div>
          :
          <div className='hidden w-1/4 md:flex justify-end'>
            <button type='submit' onClick={() => navigate('/login')} className='bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md px-4 py-2 flex items-center justify-center'>
              Get Started
            </button>
          </div>
      }


      {/* md handburger and menu list */}
      {
        isLoggedIn &&
        <div className='md:hidden'>
          <button className='w-7 md:w-8 h-7 flex flex-col justify-between z-50 relative' onClick={() => setIsOpen((prev) => !prev)}>
            <div className={`w-6 h-1 ${isOpen ? 'bg-white' : 'bg-black'} rounded`}></div>
            <div className={`w-8 h-1 ${isOpen ? 'bg-white' : 'bg-black'} rounded`}></div>
            <div className={`w-7 h-1 ${isOpen ? 'bg-white' : 'bg-black'} rounded`}></div>
          </button>

          {/* mobile menu list */}
          {
            isOpen &&
            <div className='absolute top-0 left-0 w-screen h-screen bg-black text-white flex flex-col items-center justify-center gap-8 text-2xl'>
              {
                links.map((item, index) => {
                  return (
                    <Link href={item.url} key={index}><p className='hover:text-opacity-50'>{item.title}</p></Link>
                  )
                })
              }
            </div>
          }
        </div>
      }

      {
        isShow &&

        <div ref={notifyRef} className="absolute h-[30rem] bg-white shadow-xl top-[5rem] w-[20rem] right-[10rem] rounded-xl">
          <div className='px-3 shadow-sm bg-blue-100 flex items-center justify-between h-100 gap-2 static mb-2'>
            <div className='flex items-center justify-start gap-3'>
              <i class="fa-regular fa-bell text-sm text-blue-400"></i>
              <p className='text-sm text-blue-900'>Notifications</p>
            </div>
            <button onClick={() => handleClear()} className='border-solid border-[1px] rounded-lg px-2 border-blue-400'>
              <div className="flex items-center justify-between gap-1">
                <p className='text-xs text-blue-400'>clear all</p>
                <i class="fa-solid fa-xmark text-sm text-blue-400"></i>
              </div>
            </button>
          </div>

          <div className="overflow-scroll min-h-100 w-100">
            <ul>
              {
                notifications?.map((item, index) => {
                  return (
                    <li className='h-12 py-2  px-3 flex items-center justify-between border-b hover:bg-blue-50' key={index}>
                      <div className='flex items-center justify-between'>
                        <div>
                          <div class="h-7 w-7 bg-blue-500 rounded-full flex items-center justify-center text-white">{index + 1}</div>
                        </div>
                        <p className='text-xs ml-3'>{item}</p>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      }

    </div>
  )
}

export default Navbar
