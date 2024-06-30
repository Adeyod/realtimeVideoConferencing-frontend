import { Buffer } from 'buffer';
window.Buffer = Buffer;

import process from 'process';
window.process = process;

import { useEffect, useRef, useState } from 'react';
import Spinner from '../components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { InstantMeetingRoute, joinMeetingRoute } from '../components/ApiRoutes';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { CiVideoOff, CiVideoOn } from 'react-icons/ci';
import { joinMeetingSuccess, meetingInfo } from '../redux/meetingSlice';

import Peer from 'simple-peer';

const MeetingRoomScreen = () => {
  const { user } = useSelector((state) => state.user);
  const { meetingDetails } = useSelector((state) => state.meeting);
  const location = useLocation();
  const dispatch = useDispatch();

  const videoRef = useRef(null);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const myVideo = document.createElement('video');

  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState();
  const [shareCamera, setShareCamera] = useState(false);

  // const [streamTest, setStreamTest] = useState()

  const searchParams = new URLSearchParams(location.search);
  const meetingId = searchParams.get('meetingId');
  const participant = searchParams.get('participant');

  const email = meetingDetails?.userDetails?.email;

  const [messageInput, setMessageInput] = useState('');
  // const socketRef=useRef()
  const streamTest = useRef();
  const router = useParams();
  const roomId = router.roomId;

  const getUserAccess = async () => {
    try {
      const { data } = await axios.post(
        `${joinMeetingRoute}/${meetingId}/${participant}`
      );

      console.log(data);
      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success(data.message);
        dispatch(meetingInfo(data.meetingDetails));
        initializeSocket(data.meetingDetails.userDetails.email, meetingId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserAccess();
    getAllParticipants();
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        // audio: {
        //   echoCancellation: true,
        //   noiseSuppression: true,
        //   autoGainControl: true,
        // },
      })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(currentStream);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);

        // if(peer){
        //   peer.addStream(destionation.stream)
        // }
      })
      .catch((error) => {
        console.log('currentStream error:', error);
      });
  }, []);

  const createPeer = ({
    socketId,
    userUniqueId,
    userEmail,
    meetingId,
    stream,
  }) => {
    console.log('i get to this place', socketId);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    console.log('i get to this place', socketId);

    peer.on('signal', (data) => {
      console.log('object', data);
      socketRef.current.emit('sending-signal', {
        signalData: data,
        // socketId,
        userToCall: userUniqueId,
        userEmail,
        meetingId,
      });

      peer.signal(data);
    });

    peer.on('stream', (stream) => {
      streamTest.current.srcObject = stream;
    });

    peer.signal();
    console.log('Peer object:', peer);
    return peer;
  };

  const getAllParticipants = () => {
    socketRef.current.on('all-users', ({ data }) => {
      console.log(data);
      const users = data.users;
      console.log(users);
      const peers = [];
      users.forEach((user) => {
        console.log(user.uniqueId);
        console.log(socketRef.current.id);
        console.log(userVideo.current.srcObject);
        const peer = createPeer({
          socketId: socketRef.current.id,
          userId: user.uniqueId,
          userEmail: user.email,
          meetingId: data.meetingId,
          stream: userVideo.current.srcObject,
        });
        console.log(peer);

        if (!peer) {
          console.error('Peer was not created for', user);
        }

        console.log(peer);
        peersRef.current.push({
          peerID: user.uniqueId,
          peer,
        });
        console.log(peersRef.current);
        peers.push({
          peerID: user.uniqueId,
          peer,
        });
      });

      setPeers(peers);
    });
  };

  const initializeSocket = (email, meetingId) => {
    console.log(email);
    socketRef.current = io.connect('http://localhost:5050');

    socketRef.current.emit('join-room', ({ meetingId, email }) => {
      console.log(meetingId, email);
    });

    socketRef.current.emit('meeting-creator-joined', ({ meetingId, email }) => {
      console.log(meetingId, email);
    });

    socketRef.current.on('room-joined', (data) => {
      console.log('join room', data);
    });

    socketRef.current.on('user-waiting', (data) => {
      console.log('waiting room', data);
    });

    socketRef.current.on('already-joined', (data) => {
      console.log('already joined', data);
    });

    socketRef.current.on('creator', (id) => {
      console.log('Creator ID: ' + id);
    });

    socketRef.current.on('meeting-creator-joined', (data) => {
      console.log('meetingCreator:', data);
    });

    socketRef.current.on('all-users', (data) => {
      console.log(data);
      const users = data.users;
      console.log(users);
      const peers = [];
      users.forEach((user) => {
        console.log(user.uniqueId);
        console.log(socketRef.current.id);
        console.log(userVideo.current.srcObject);
        const peer = createPeer({
          socketId: socketRef.current.id,
          userId: user.uniqueId,
          userEmail: user.email,
          meetingId: data.meetingId,
          stream: userVideo.current.srcObject,
        });
        console.log(peer);

        if (!peer) {
          console.error('Peer was not created for', user);
        }

        console.log(peer);
        peersRef.current.push({
          peerID: user.uniqueId,
          peer,
        });
        console.log(peersRef.current);
        peers.push({
          peerID: user.uniqueId,
          peer,
        });
      });

      setPeers(peers);
    });
    console.log(peers);

    socketRef.current.on('user-waiting', (payload) => {
      console.log('user-waiting', payload);
    });

    socketRef.current.on('user-waiting', (payload) => {
      console.log('user-waiting', payload);
      const peer = addPeer(
        payload.signal,
        payload.callerID,
        userVideo.current.srcObject
      );
      peersRef.current.push({
        peerID: payload.callerID,
        peer,
      });

      setPeers((users) => [...users, { peerID: payload.callerID, peer }]);
    });

    socketRef.current.on('receiving returned signal', (payload) => {
      const item = peersRef.current.find((p) => p.peerID === payload.id);
      item.peer.signal(payload.signal);
    });

    socketRef.current.on('user-left', (id) => {
      console.log(id);
      const peerObj = peersRef.current.find((p) => p.peerID === id);
      if (peerObj) {
        peerObj.peer.destroy();
      }
      const peers = peersRef.current.filter((p) => p.peerID !== id);
      peersRef.current = peers;
      setPeers((users) => users.filter((p) => p.peerID !== id));
    });
  };

  const handleShareCamera = () => {
    setShareCamera(!shareCamera);
  };

  // const createPeer = (socketId, userUniqueId, userEmail, meetingId, stream) => {
  //   // console.log('userToSignal', userToSignal);
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream,
  //   });

  //   console.log('peer', peer);

  //   peer.on('signal', (data) => {
  //     console.log('object');
  //     socketRef.current.emit('sending signal', {
  //       // socketId,
  //       userToCall: userUniqueId,
  //       // userEmail,
  //       // meetingId,
  //       signalData: data,
  //     });
  //   });

  //   console.log('Peer object:', peer);
  //   return peer;
  // };

  // const createPeer = (userToSignal, callerID, stream) => {

  //   console.log('userToSignal', userToSignal);
  //   const peer = new Peer({
  //     initiator: true,
  //     // trickle: false,
  //     stream,
  //   });

  //   console.log('peer', peer);

  //   peer.on('signal', (signal) => {
  //     socketRef.current.emit('sending signal', {
  //       userToSignal,
  //       callerID,
  //       signal,
  //     });
  //   });

  //   console.log('Peer object:', peer);
  //   return peer;
  // };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on('signal', (signal) => {
      socketRef.current.emit('returning signal', { signal, callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  };

  const approveUser = (email) => {
    socketRef.current.emit('approve-user', meetingId, email);
  };

  const endMeeting = () => {
    socketRef.current.emit('end-meeting', {
      meetingId,
      email: meetingDetails.userDetails.email,
    });
  };

  return (
    <div className="">
      <p>InstantMeetingScreen</p>

      <div className="">
        <div className={!shareCamera && 'w-[70%] pl-[-300px]'}>
          <video
            ref={userVideo}
            autoPlay
            playsInline
            className="mb-[50px] w-[80%] h-full border-red-500 border-4 mx-auto"
          />
        </div>
        <div className="">
          {peers.map((peer) => {
            console.log(peer);
            <p>{peer.email}</p>;
            return (
              <div key={peer.peerID} className="">
                <p>Am showing here</p>
                <video
                  ref={peer.peer}
                  autoPlay
                  playsInline
                  className="mb-[50px] w-[80%] h-full border-red-500 border-4 mx-auto"
                />
              </div>
            );
          })}
        </div>
      </div>

      <p>Share this link to other participants: {'meetingLink'}</p>
      <div className="text-3xl flex justify-center">
        <button onClick={handleShareCamera}>
          {shareCamera ? <CiVideoOn /> : <CiVideoOff />}
        </button>
      </div>
    </div>
  );
};

export default MeetingRoomScreen;
