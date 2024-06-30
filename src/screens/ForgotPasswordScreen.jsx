import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { forgotPasswordRoute } from '../components/ApiRoutes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState('');
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(forgotPasswordRoute, formData);
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
    }
  };
  return (
    <div>
      <p className="pt-6 uppercase italic font-bold text-3xl">
        Forgot Password
      </p>

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
                placeholder="Enter your email address here"
                name="email"
                id="email"
                type="email"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className={[
              loading ? 'bg-gray-400' : 'bg-green-400',
              'px-4 text-2xl font-bold text-white uppercase italic py-2 mt-8 border rounded w-[170px]',
            ].join(' ')}
          >
            {loading ? 'loading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
