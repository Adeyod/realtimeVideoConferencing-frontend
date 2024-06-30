import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMenuSharp } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import authChecker from './authChecker';
import { InstantMeetingRoute, logoutRoute } from './ApiRoutes';
import { toast } from 'react-toastify';
import { logoutSuccess } from '../redux/userSlice';
import { meetingInfo } from '../redux/meetingSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.user);
  const [toggle, setToggle] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { meetingDetails } = useSelector((state) => state.meeting);

  const meetingId = meetingDetails?.meeting?.meetingId;
  const email = user?.user?.email;

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(logoutRoute);
      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success(data.message);
        dispatch(logoutSuccess());
        navigate('/login');
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDropDownToggle = () => {
    setDropDownOpen(!dropDownOpen);
  };

  useEffect(() => {
    if (user && token) {
      authChecker(token, dispatch);
    }
  }, [user, token, dispatch]);

  const createRoomInController = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(InstantMeetingRoute, { email });
      console.log(data);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        dispatch(meetingInfo(data.meetingDetails));
        navigate(
          `/meeting-room/${meetingId}?email=${encodeURIComponent(email)}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between p-4 items-center bg-slate-600 text-white font-bold">
      <div className="">
        <Link to="/">LOGO</Link>
      </div>
      <div className="">
        <div className="hidden md:flex gap-3">
          {user ? (
            <div className=" flex justify-center items-center gap-3">
              <Link to="/profile">
                <img
                  src={user.user.image.url}
                  alt="profile"
                  className="w-[30px] h-[30px] rounded-full"
                />
              </Link>
              <div>
                <button onClick={handleDropDownToggle}>New Meeting</button>
                {dropDownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-2 flex flex-col items-start"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <Link
                        to="/create-meeting"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Create Meeting
                      </Link>

                      {/* <button
                        onClick={createRoomInController}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Instant Meeting
                      </button> */}

                      <Link
                        to="/join-meeting"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Join Meeting
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
        <div className="">
          <button className="md:hidden" onClick={() => setToggle(!toggle)}>
            {toggle ? (
              <IoMdClose className="text-4xl" />
            ) : (
              <IoMenuSharp className="text-4xl" />
            )}
          </button>
          <div
            className={[
              toggle ? 'top-[69px]' : 'top-[-9990px]',
              'flex flex-col md:hidden absolute right-0 bg-slate-600 p-4',
            ].join(' ')}
          >
            {user ? (
              <div className="flex flex-col items-start p-4">
                <Link to="/profile">Profile</Link>
                <div className="relative">
                  <button
                    className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded mt-2"
                    onClick={handleDropDownToggle}
                  >
                    New Meeting
                  </button>
                  {dropDownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div
                        className="py-2 flex flex-col items-start"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <Link
                          to="/create-meeting"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Create Meeting
                        </Link>

                        {/* <button
                          onClick={createRoomInController}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Instant Meeting
                        </button> */}

                        <Link
                          to="/join-meeting"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Join Meeting
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div className="flex flex-col p-4">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
