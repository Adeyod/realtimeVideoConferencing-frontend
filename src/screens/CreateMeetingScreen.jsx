import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { createMeetingRoute } from '../components/ApiRoutes';
import { meetingInfo } from '../redux/meetingSlice';
import { useNavigate } from 'react-router-dom';

const CreateMeetingScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { meetingDetails } = useSelector((state) => state.meeting);

  console.log(meetingDetails);

  const [emails, setEmails] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    generateTimeOptions();
  }, [date]);

  console.log(title);

  const generateTimeOptions = () => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    const options = [];
    const period = ['AM', 'PM'];
    // const selectedHour = selectedDate.getHours();
    // const selectedMinutes = selectedDate.getMinutes();

    if (
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    ) {
      let startHour = currentHour + 1;

      for (let hour = startHour; hour < 24; hour++) {
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = period[Math.floor(hour / 12)];
        options.push(`${formattedHour}:00 ${ampm}`);
      }
    } else {
      // For future dates, show all time options
      for (let hour = 0; hour < 24; hour++) {
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = period[Math.floor(hour / 12)];
        options.push(`${formattedHour}:00 ${ampm}`);
      }
    }

    setTimeOptions(options);
  };

  // const timeOptions = [
  //   '12:00 AM',
  //   '1:00 AM',
  //   '2:00 AM',
  //   '3:00 AM',
  //   '4:00 AM',
  //   '5:00 AM',
  //   '6:00 AM',
  //   '7:00 AM',
  //   '8:00 AM',
  //   '9:00 AM',
  //   '10:00 AM',
  //   '11:00 AM',
  //   '12:00 PM',
  //   '1:00 PM',
  //   '2:00 PM',
  //   '3:00 PM',
  //   '4:00 PM',
  //   '5:00 PM',
  //   '6:00 PM',
  //   '7:00 PM',
  //   '8:00 PM',
  //   '9:00 PM',
  //   '10:00 PM',
  //   '11:00 PM',
  // ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleAddField = (e) => {
    e.preventDefault();
    setEmails([...emails, '']);
  };

  const handleInputChange = (index, e) => {
    const values = [...emails];
    values[index] = e.target.value;
    setEmails(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedDate = moment(date).format('YYYY-MM-DD');
      const combinedDateTime = moment(
        `${selectedDate} ${time}`,
        'YYYY-MM-DD h:mm A'
      ).toDate();

      const meetingDetails = {
        title,
        emails,
        creator: user?.user?._id,
        dateTime: combinedDateTime,
        date,
        time,
      };

      const { data } = await axios.post(createMeetingRoute, meetingDetails);

      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success(data.message);
        dispatch(meetingInfo(data.meetingDetails));
        // setEmails(['']);
        // setTitle('')
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Create Meeting</p>

      <div className="p-4">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="flex flex-col">
            <label htmlFor="date">Date</label>
            <DatePicker
              id="date"
              selected={date}
              onChange={(date) => setDate(date)}
              className="border border-gray-300 rounded p-2"
              required
              showYearDropdown
              // customInput={<CustomDateInput />}
              dateFormat="yyyy-MM-dd"
              yearDropdownItemNumber={10}
              scrollableYearDropdown
              minDate={new Date()}
              // yearDropdownItemNumber={years.length}
              renderCustomHeader={({ date, changeYear }) => (
                <div className="flex justify-center">
                  <select
                    value={moment(date).year()}
                    onChange={({ target: { value } }) => changeYear(value)}
                  >
                    {years.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="time">Time</label>
            <select
              id="time"
              value={time}
              onChange={handleTimeChange}
              className="border border-gray-300 rounded p-2 mx-auto"
              required
            >
              <option value="" disabled>
                Select Time
              </option>
              {timeOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <label htmlFor="title">Title: </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded p-2 w-[260px]"
              required
            />
          </div>
          <p>Email Addresses of the participants</p>
          {emails.map((email, index) => (
            <div key={index} className=" justify-center items-center ">
              <label htmlFor={`email-${index}`}>Email {index + 1}: </label>
              <input
                id={`email-${index}`}
                type="email"
                value={email}
                onChange={(e) => handleInputChange(index, e)}
                className="border border-gray-300 rounded p-2 w-[260px]"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddField}
            disabled={loading}
            className={[
              loading ? 'bg-gray-500' : 'bg-blue-500',
              'mr-5 text-white p-2 rounded mt-4',
            ].join(' ')}
          >
            Add Email
          </button>
          <button
            disabled={loading}
            type="submit"
            className={[
              loading ? 'bg-gray-500' : 'bg-green-500',
              'text-white p-2 rounded mt-4',
            ].join(' ')}
          >
            {loading ? 'Loading...' : 'Create Meeting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetingScreen;
