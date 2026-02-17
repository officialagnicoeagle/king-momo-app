import React from "react";

const FormErrMsg = ({ errors, inputName }) => {
  if (!errors || !errors[inputName]) return null;

  return (
    <p className="text-red-500 text-sm mt-1">{errors[inputName]?.message}</p>
  );
};

export default FormErrMsg;
