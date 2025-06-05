import React from "react";

const ModeToggle = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-100 p-1 rounded-lg flex">
        <button
          onClick={() => onModeChange("realtime")}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            mode === "realtime"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800"
          }`}
          aria-pressed={mode === "realtime"}
        >
          Real-time Recording
        </button>
        <button
          onClick={() => onModeChange("upload")}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            mode === "upload"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-gray-800"
          }`}
          aria-pressed={mode === "upload"}
        >
          File Upload
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
