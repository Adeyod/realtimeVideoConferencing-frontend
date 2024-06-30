import axios from 'axios';
import { useState } from 'react';
import { registerRoute } from '../components/ApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginStop } from '../redux/userSlice';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginStart());
      const { data } = await axios.post(registerRoute, formData);
      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success(data.message);
        navigate('/');
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(loginStop());
    }
  };
  return (
    <div>
      <p className="pt-2 uppercase italic font-bold text-2xl">Register</p>

      <div className="md:flex md:justify-around md:items-center md:mt-10">
        <div className="hidden md:flex">
          <img
            className="lg:w-[400px] md:w-[350px]"
            src="../../images/user.png"
            alt="placeholder image"
          />
        </div>
        <form action="" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-1 ">
            <div className="flex flex-col items-start flex-1">
              <label>Username</label>
              <input
                className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                placeholder="Enter your username"
                name="userName"
                id="userName"
                required
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col items-start flex-1">
              <label>First name</label>
              <input
                className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                placeholder="Enter your first name"
                name="firstName"
                id="firstName"
                required
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col items-start flex-1">
              <label>Last name</label>
              <input
                className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                placeholder="Enter your last name"
                name="lastName"
                id="lastName"
                required
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col items-start flex-1">
              <label>Email</label>
              <input
                className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                placeholder="Enter your email"
                name="email"
                id="email"
                type="email"
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

            <div className="flex flex-col items-start flex-1">
              <label>Confirm Password</label>
              <input
                className="border p-2 rounded border-gray-600 outline-none w-[60vw] md:w-[40vw]"
                placeholder="Confirm password"
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            disabled={loading}
            className={[
              loading ? 'bg-gray-400' : 'bg-green-400',
              'px-4 pb-5 text-2xl font-bold text-white uppercase italic py-2 mt-4 border rounded w-[170px]',
            ].join(' ')}
          >
            {loading ? 'loading...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
