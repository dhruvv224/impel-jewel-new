

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OTPInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Logo from "../../assets/images/logo.png";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { Helmet } from "react-helmet-async";
import profileService from "../../services/Auth";

const Login = () => {
  const navigate = useNavigate();
  const location=useLocation()
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);
  const [phoneError, setPhoneError] = useState();
  const [spinner, setSpinner] = useState(false);
  const [phonedata, setPhoneData] = useState();
  const handlePhoneNumberChange = (newPhoneNumber) => {
    let isValid = true;
    if (!newPhoneNumber) {
      setPhoneError("Please enter your mobile number");
      isValid = false;
    } else if (newPhoneNumber.length !== 12) {
      setPhoneError("Your mobile number should be 10 digits");
      isValid = false;
    } else {
      setPhoneError("");
    }
    setPhoneNumber(newPhoneNumber);
    return isValid;
  };

  const sendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setPhoneError("Please enter your mobile number");
    } else if (phoneNumber.length !== 12) {
      setPhoneError("Your mobile number should be 10 digits");
    } else {
      setPhoneError("");
      const formatPh = `+${phoneNumber}`;
      setSpinner(true);
      profileService
        .checkUser({ phone: formatPh })
        .then((res) => {
          if (res?.data?.status === 0) {
            toast.error(res?.data?.message);
navigate('/login', { state: { from: location.pathname } });
            return;
          } else {
            profileService
              .otpLogin({ number: formatPh })
              .then((datas) => {
                toast.success("OTP sent successfully!");
                setPhoneData(res?.data);
                setShow(true);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setSpinner(false);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setSpinner(false);
        });
    }
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    setSpinner(true);
    const code = otp;
    const datas = {
      otp: parseInt(code),
      number: parseInt(phoneNumber),
    };
    profileService
      .otpVerify(datas)
      .then((datas) => {
        if (datas?.status === true) {
          toast.success("Login Successfully...");
          localStorage.setItem("phone", "+" + phoneNumber);
          localStorage.setItem("user_type", phonedata?.user_type);
          localStorage.setItem("user_id", phonedata?.user_id);
          localStorage.setItem("verification", phonedata?.verification);
          const redirectPath = localStorage.getItem("redirectPath");
          localStorage.removeItem("redirectPath");
          localStorage.removeItem("showPopup");
          if (redirectPath) {
            navigate(redirectPath);
          } else {
            navigate(-1);
          }
        } else if (datas?.message === "Your OTP has been expired") {
          toast.error("Your OTP has been expired");
          setOtp("");
        } else {
          toast.error("Invalid OTP");
          setOtp("");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const PhoneNumber = phoneNumber.replace("91", "");
useEffect(() => {
  // Store the current path in sessionStorage
  sessionStorage.setItem("currentPath", location.pathname);
}, [location.pathname]);
  return (
    <>
      <Helmet>
        <title>Impel Store - Login</title>
      </Helmet>
      <section className="login">
        <div className="container">
          <div className="">
            <div className="row justify-content-center text-align-center">
              <div className="col-md-5">
                <div className="user-login-form">
                  {show === false && (
                    <>
                      <form
                        onSubmit={sendOtp}
                        className="d-flex flex-column gap-2 form w-100"
                      >
                        <div className="text-center">
                          <Link to="/">
                            <img src={Logo} alt="logo" />
                          </Link>
                        </div>
                        <h5>Welcome</h5>
                        <span>
                          Enter phone number to continue and we will send a
                          verification code to this number.
                        </span>
                        <div className="my-3">
                          <PhoneInput
                            country={"in"}
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            placeholder="Enter Your Phone Number"
                            enableSearch
                            disableSearchIcon
                            countryCodeEditable={false}
                            disableDropdown
                            enableAreaCodes={true}
                            autoFormat
                          />
                          {phoneError && (
                            <div
                              className="text-danger ms-5 ps-5"
                              style={{ fontWeight: "600" }}
                            >
                              {phoneError}
                            </div>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="customer_login_btn"
                          id="sign-in-button"
                          disabled={spinner}
                        >
                          {spinner && (
                            <CgSpinner
                              size={20}
                              className="animate_spin text-center mx-2"
                              role="button"
                            />
                          )}
                          {spinner ? "" : "Login To Continue"}
                        </button>
                      </form>
                      <div className="col-md-12 text-end">
                        <Link
                          to="/dealer-login"
                          className="text-decoration-none text-success"
                          style={{ fontWeight: "700", fontSize: "18px" }}
                        >
                          Dealer Login ?
                        </Link>
                      </div>
                    </>
                  )}

                  {show === true && (
                    <>
                      <form
                        onSubmit={handleOtpVerification}
                        className="d-flex flex-column gap-2 form w-100"
                      >
                        <h5>Enter Verification Code</h5>
                        <span>
                          We have sent a verification code to
                          <p>
                            {PhoneNumber.substring(0, 2) +
                              "*".repeat(PhoneNumber.length - 4) +
                              PhoneNumber.slice(-2)}
                          </p>
                        </span>
                        <div>
                          <OTPInput
                            className="otp-container"
                            value={otp}
                            onChange={setOtp}
                            autoFocus
                            OTPLength={6}
                            otpType="number"
                            disabled={false}
                            placeholder="------"
                          />
                        </div>

                        <span className="button-container d-flex gap-5">
                          <button
                            type="submit"
                            id="sign-in-button"
                            disabled={otp?.length < 6}
                          >
                            {spinner && (
                              <CgSpinner
                                size={20}
                                className="animate_spin text-center mx-3"
                              />
                            )}
                            {spinner ? "" : " Verify and Proceed"}
                          </button>
                        </span>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
