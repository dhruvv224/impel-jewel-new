import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userPhone = localStorage.getItem("phone");
  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    if (userType == 2 && location.pathname === "/dealer-login") {
      navigate("/");
    }
  }, [userType, location.pathname]);

  const checkUser = () => {
    if (!userPhone) {
      setIsLoggedIn(false);
      return navigate('/login', { state: { from: location.pathname } });
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkUser();
  }, [isLoggedIn]);

  return <>{isLoggedIn ? props.children : null}</>;
};

export default ProtectedRoute;
