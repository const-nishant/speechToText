import React, { useRef } from "react";
import PropTypes from "prop-types";

const FileUpload = ({ onFileUpload, isProcessing, selectedLanguage }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["audio/mp3", "audio/wav", "audio/mpeg"];
      const isValid =
        validTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith(".mp3") ||
        file.name.toLowerCase().endsWith(".wav");

      onFileUpload(file);
      if (isValid) {
      } else {
        alert("Please select a valid MP3 or WAV file.");
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Upload Audio File</h3>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors duration-200">
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,audio/mp3,audio/wav"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload audio file"
        />

        {!isProcessing ? (
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📁</div>
            <div>
              <button
                onClick={handleUploadClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Choose Audio File
              </button>
            </div>
            <p className="text-gray-600">
              Support for MP3 and WAV files up to 50MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin text-6xl">⚙️</div>
            <p className="text-blue-600 font-medium">
              Processing your audio file...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  selectedLanguage: PropTypes.string, // if used
};

export default FileUpload;
