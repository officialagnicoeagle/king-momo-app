import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  securityQuestion: yup.string().required("Please select a security question"),
  answer: yup
    .string()
    .min(2, "Answer must be at least 2 characters")
    .required("Answer is required"),
});

const securityQuestions = [
  "What was the name of your first pet?",
  "What was your childhood nickname?",
  "What was the make and model of your first car?",
];

const SecurityQuestions = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const selectedQuestion = watch("securityQuestion");

  useEffect(() => {
    if (selectedQuestion && !showModal) {
      document.getElementById("answer-input")?.focus();
    }
  }, [selectedQuestion, showModal]);

  const handleQuestionSelect = (question) => {
    setValue("securityQuestion", question);
    setShowModal(false);
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/security-question`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/pin");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <div className="px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-400/30 rounded-full transition-colors inline-flex"
        >
          <svg
            className="w-7 h-7 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-gray-900 mb-3 text-center">
            Security Questions
          </h1>
          <p className="text-gray-700 text-center text-[15px]">
            Kindly answer your security questions
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          {/* Security Question Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Security Question
            </label>
            <div
              onClick={() => setShowModal(true)}
              className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors"
            >
              <span
                className={`${
                  selectedQuestion ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {selectedQuestion || "Select security question"}
              </span>
            </div>
            <FormErrMsg errors={errors} inputName="securityQuestion" />
          </div>

          {/* Answer Input */}
          <div>
            <label
              htmlFor="answer-input"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Answer
            </label>
            <input
              id="answer-input"
              name="answer"
              type="text"
              placeholder="Enter your answer"
              {...register("answer")}
              className="w-full px-4 py-4 bg-white border-2 border-red-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4d7a] focus:border-transparent text-gray-900 placeholder-gray-400 text-base transition-all"
            />
            <FormErrMsg errors={errors} inputName="answer" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedQuestion}
            className="w-full bg-[#8fb4c5] text-white py-4 rounded-xl font-semibold text-[17px] hover:bg-[#7da3b4] active:bg-[#6d93a3] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm mt-8"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 transition-opacity z-40"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[28px] px-6 pt-6 pb-8 shadow-2xl z-50 animate-slide-up max-h-[70vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Select Security Question
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-0 divide-y divide-gray-100">
              {securityQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuestionSelect(question)}
                  className={`w-full text-left py-4 px-2 hover:bg-gray-50 transition-colors ${
                    selectedQuestion === question
                      ? "text-[#1a4d7a] font-semibold"
                      : "text-gray-900"
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SecurityQuestions;
