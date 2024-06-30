import { useDispatch, useSelector } from 'react-redux';
import { IoCamera } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { updateProfileRoute } from '../components/ApiRoutes';
import { updateUserSuccess } from '../redux/userSlice';

const ProfilePageScreen = () => {
  const { user } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);

  const [inputs, setInputs] = useState({
    email: user?.user?.email,
    firstName: user?.user?.firstName,
    lastName: user?.user?.lastName,
    userName: user?.user?.userName,
  });

  const inputsValue = [
    { label: 'User Name', value: 'userName' },
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'User Email', value: 'email', readOnly: true },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImage(reader.result);
      };

      reader.readAsDataURL(file);
      setNewImage(file);
    } else {
      toast.error('File format not supported');
      return;
    }
  };

  const handleRef = () => {
    fileRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('userName', inputs.userName);
      formData.append('firstName', inputs.firstName);
      formData.append('lastName', inputs.lastName);
      formData.append('image', newImage);
      formData.append('email', inputs.email);

      console.log(formData);

      const { data } = await axios.post(updateProfileRoute, formData);

      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success(data.message);
        dispatch(updateUserSuccess(data.user));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <form onSubmit={handleSubmit} className="flex flex-col items-center py-10">
    //   <p className="font-bold italic uppercase text-3xl underline pb-8">
    //     My Profile
    //   </p>
    //   <div className="relative solid 2 h-[200px] w-[200px] ml-auto mr-auto">
    //     <input
    //       hidden
    //       ref={fileRef}
    //       type="file"
    //       accept="image/*"
    //       onChange={handleImageChange}
    //     />
    //     <img
    //       className="border-4 border-gray-900 rounded-full h-[150px] w-[150px] item-center mr-auto ml-auto"
    //       src={displayImage || user?.user?.image?.url}
    //       alt="profile picture"
    //     />
    //     <button type="button" className="" onClick={handleRef}>
    //       <IoCamera className="text-5xl z-50 text-red-600 absolute top-[100px] right-[25px]" />
    //     </button>
    //   </div>

    //   <div className="flex flex-col md:w-full max-w-md">
    //     <div className="flex items-center mb-4">
    //       <label className="text-xs md:text-base font-bold uppercase w-1/3">
    //         User Name:
    //       </label>
    //       <input
    //         className="w-full border-2 border-gray-400 p-1 rounded-lg outline-none"
    //         type="text"
    //         onChange={(e) => setInputs({ ...inputs, userName: e.target.value })}
    //         defaultValue={inputs.userName}
    //       />
    //     </div>

    //     <div className="flex items-center mb-4">
    //       <label className="text-xs md:text-base font-bold uppercase w-1/3">
    //         First Name:
    //       </label>
    //       <input
    //         className="w-full border-2 border-gray-400 p-1 rounded-lg outline-none"
    //         type="text"
    //         onChange={(e) =>
    //           setInputs({ ...inputs, firstName: e.target.value })
    //         }
    //         defaultValue={inputs.firstName}
    //       />
    //     </div>

    //     <div className="flex items-center mb-4">
    //       <label className="text-xs md:text-base font-bold uppercase w-1/3">
    //         Last Name:
    //       </label>
    //       <input
    //         className="w-full border-2 border-gray-400 p-1 rounded-lg outline-none"
    //         type="text"
    //         onChange={(e) => setInputs({ ...inputs, lastName: e.target.value })}
    //         defaultValue={inputs.lastName}
    //       />
    //     </div>

    //     <div className="flex items-center mb-4">
    //       <label className="text-xs md:text-base font-bold uppercase w-1/3">
    //         User Email:
    //       </label>
    //       <input
    //         className="w-full border-2 border-gray-400 p-1 rounded-lg outline-none"
    //         readOnly
    //         type="email"
    //         value={inputs.email}
    //       />
    //     </div>

    //     <button
    //       type="submit"
    //       className=" mt-4 bg-green-500 p-2 rounded-md text-white italic mr-auto ml-auto"
    //     >
    //       {loading ? 'Loading...' : 'Update Profile'}
    //     </button>
    //   </div>
    // </form>

    <form onSubmit={handleSubmit} className="flex flex-col items-center py-10">
      <p className="font-bold italic uppercase text-3xl underline pb-8">
        My Profile
      </p>
      <div className="relative solid 2 h-[200px] w-[200px] ml-auto mr-auto">
        <input
          hidden
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <img
          className="border-4 border-gray-900 rounded-full h-[150px] w-[150px] mx-auto"
          // className="border-4 border-gray-900 rounded-full h-[150px] w-[150px] item-center mr-auto ml-auto"
          src={displayImage || user?.user?.image?.url}
          alt="profile picture"
        />
        <button type="button" className="" onClick={handleRef}>
          <IoCamera className="text-5xl z-50 text-red-600 absolute top-[100px] right-[25px]" />
        </button>
      </div>

      <div className="flex flex-col w-full max-w-md px-4">
        {inputsValue.map((input, index) => (
          <div key={index} className="flex items-center mb-4 w-full">
            <label
              htmlFor={input}
              // className="text-xs md:text-base font-bold uppercase w-1/3"
              className="text-xs md:text-base font-bold uppercase w-1/3 "
            >
              {input.label}
            </label>

            <input
              // className="w-full border-2 border-gray-400 p-1 rounded-lg outline-none"
              // className="w-full border-2 border-gray-400 p-1 rounded-lg outline-none"
              className="flex-grow border-2 border-gray-400 p-1 rounded-lg outline-none"
              onChange={(e) =>
                setInputs({ ...inputs, [input.value]: e.target.value })
              }
              defaultValue={inputs[input.value]}
              readOnly={input.readOnly}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          // className=" mt-4 bg-green-500 p-2 rounded-md text-white italic"
          className={[
            loading ? 'bg-gray-500' : 'bg-green-500',
            'w-[130px] mt-4 p-2 rounded-md text-white italic mr-auto ml-auto',
          ].join(' ')}
        >
          {loading ? 'Loading...' : 'Update Profile'}
        </button>
      </div>
    </form>
  );
};

export default ProfilePageScreen;
