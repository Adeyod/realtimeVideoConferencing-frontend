import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import { loginRoute } from '../components/ApiRoutes';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginFailure,
  loginStop,
  loginSuccess,
} from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const { data } = await axios.post(loginRoute, formData);
      if (data.error) {
        toast.error(data.error);
        dispatch(loginFailure(data));
        return;
      } else {
        toast.success(data.message);
        const currentUser = {
          user: data.user,
          token: data.token,
        };
        dispatch(loginSuccess(currentUser));
        navigate('/profile');
        return;
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message);
      console.log(error);
    } finally {
      dispatch(loginStop());
    }
  };
  return (
    <div>
      <p className="pt-6 uppercase italic font-bold text-3xl">Login</p>

      <div className="md:flex md:justify-around md:items-center mt-14 md:mt-10">
        <div className="hidden md:flex">
          <img
            className="lg:w-[400px] md:w-[350px]"
            src="../../public/images/user.png"
            alt="placeholder image"
          />
        </div>
        <form action="" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-3 ">
            <div className="flex flex-col items-start flex-1">
              <label>Email</label>
              <input
                className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                placeholder="Username or email address here"
                name="userNameOrEmail"
                id="userNameOrEmail"
                required
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col items-start flex-1">
              <label>Password</label>
              <input
                className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                onChange={handleChange}
              />
            </div>
            <p className="italic  text-gray-700">
              Forgot password?
              <Link
                to="/forgot-password"
                className="pl-2 text-blue-700 font-bold"
              >
                Click Here
              </Link>
            </p>
          </div>

          <button
            disabled={loading}
            className={[
              loading ? 'bg-gray-400' : 'bg-green-400',
              'px-4 text-2xl font-bold text-white uppercase italic py-2 mt-8 border rounded w-[170px]',
            ].join(' ')}
          >
            {loading ? 'loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
