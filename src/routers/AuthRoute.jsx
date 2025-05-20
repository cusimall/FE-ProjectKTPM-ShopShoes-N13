import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const userData = JSON.parse(localStorage.getItem('user'));

  // Kiểm tra quyền admin từ cả currentUser và userData
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN') || userData?.roles?.includes('ROLE_ADMIN');
  
  return isAdmin ? children : <Navigate to="/" />;
};

export default AuthRoute;
