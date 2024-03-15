import { useNavigate } from "react-router-dom";

const ForceRedirect = ({ isLoggedIn, role, children }) => {
  const navigate = useNavigate();
  const currentUserRole = localStorage.getItem('currentUserRole');

  if (!isLoggedIn) {
    return children;
  } else {
    navigate(`/${role || currentUserRole}/home`);
    return null;
  }
};

export default ForceRedirect;
