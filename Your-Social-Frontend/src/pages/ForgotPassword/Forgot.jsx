import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ForgotPassword from "../ForgotPassword";
import OtpVerification from "../OtpVerification";

const Forgot = () => {
  const { auth } = useSelector((store) => store);

  useEffect(() => {}, [auth.forgotEmailResponse]);

  // If OTP is sent, redirect to OtpVerification
  if (auth.forgotEmailResponse || localStorage.getItem("email")) {
    return <OtpVerification />;
  }

  return (
    <div>
      {!auth.forgotEmailResponse ? <ForgotPassword /> : <OtpVerification />}
    </div>
  );
};

export default Forgot;
