import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);

  console.log(user);

  return (
    <div>{user && user !== null ? <Outlet /> : <Navigate to="/login" />}</div>
  );
};

export default ProtectedRoute;
