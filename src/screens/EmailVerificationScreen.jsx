import axios from 'axios';
import { useEffect, useState } from 'react';
import { emailVerificationRoute } from '../components/ApiRoutes';
import { toast } from 'react-toastify';
import { MdDomainVerification } from 'react-icons/md';
import { BiErrorAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import Spinner from '../components/Spinner';

const EmailVerificationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login');
  };

  const verifyUser = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);

      const userId = searchParams.get('userId');
      const token = searchParams.get('token');
      const { data } = await axios.post(
        `${emailVerificationRoute}/${userId}/${token}`
      );
      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success(data.message);
        setIsVerified(true);
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <div>
      {loading ? (
        <div>
          <Spinner />
        </div>
      ) : isVerified ? (
        <div className="flex flex-col justify-center items-center mt-auto h-screen p-4">
          <p className=" text-xl md:text-3xl italic uppercase font-bold text-green-500">
            You are verified. Click the login button to login
            <MdDomainVerification className="mr-auto ml-auto text-8xl" />
          </p>
          <div className="ml-auto mr-auto">
            <button
              className="bg-slate-600 px-4 text-2xl font-bold text-white uppercase italic py-2 mt-4 border rounded flex justify-center items-center"
              onClick={handleNavigate}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-auto h-screen p-4">
          <p className=" text-xl md:text-3xl italic uppercase font-bold text-red-500">
            Unable to verify user
            <BiErrorAlt className="mr-auto ml-auto text-8xl" />
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationScreen;
