import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import {
  allowResetPasswordRoute,
  resetPasswordRoute,
} from '../components/ApiRoutes';
import { toast } from 'react-toastify';
import { BiErrorAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  const allowUser = async () => {
    try {
      const { data } = await axios.post(
        `${allowResetPasswordRoute}/${userId}/${token}`
      );

      if (data.error) {
        setIsAllowed(false);
        toast.error(data.error);
        return;
      } else {
        setIsAllowed(true);
        toast.success(data.message);
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allowUser();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${resetPasswordRoute}/${userId}/${token}`,
        formData
      );
      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success(data.message);
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    <Spinner />;
  }

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : isAllowed ? (
        <div className="mt-16 md:mt-0">
          <p className="pt-6 uppercase italic font-bold text-3xl">
            Reset Password
          </p>

          <div className="md:flex md:justify-around md:items-center md:mt-10">
            <div className="hidden md:flex">
              <img
                className="lg:w-[400px] md:w-[350px]"
                src="../../images/user.png"
                alt="placeholder image"
              />
            </div>
            <form action="">
              <div className="flex flex-col items-center gap-3 ">
                <div className="flex flex-col items-start flex-1">
                  <label htmlFor="password">Password</label>
                  <input
                    className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                    type="password"
                    id="password"
                    onChange={handleChange}
                    placeholder="Enter new password here"
                  />
                </div>

                <div className="flex flex-col items-start flex-1">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                    type="password"
                    id="confirmPassword"
                    onChange={handleChange}
                    placeholder="Confirm new password here"
                  />
                </div>
                <button
                  disabled={isLoading}
                  onClick={handleResetPassword}
                  className={[
                    loading ? 'bg-gray-400' : 'bg-green-400',
                    'px-4 text-2xl font-bold text-white uppercase italic py-2 mt-8 border rounded w-[170px]',
                  ].join(' ')}
                >
                  {isLoading ? 'loading...' : 'Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-auto h-screen p-4">
          <p className=" text-xl md:text-3xl italic uppercase font-bold text-red-500">
            You are not allowed to change the password
            <BiErrorAlt className="mr-auto ml-auto text-8xl" />
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordScreen;
