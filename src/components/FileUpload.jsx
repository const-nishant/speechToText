import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

const FileUpload = ({ onFileUpload, isProcessing, selectedLanguage }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["audio/mp3", "audio/wav", "audio/mpeg"];
      const isValid =
        validTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith(".mp3") ||
        file.name.toLowerCase().endsWith(".wav");

      if (isValid) {
        onFileUpload(file);
        // Clear file input after upload
        event.target.value = "";
      } else {
        alert("Please select a valid MP3 or WAV file.");
        event.target.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.value && (fileInputRef.current.value = "");
    fileInputRef.current?.click();
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ["audio/mp3", "audio/wav", "audio/mpeg"];
      const isValid =
        validTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith(".mp3") ||
        file.name.toLowerCase().endsWith(".wav");

      if (isValid) {
        onFileUpload(file);
      } else {
        alert("Please select a valid MP3 or WAV file.");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
      <h3 className="file-upload-title">Upload Audio File</h3>

      <div
        className="file-upload-container"
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#60A5FA")} // blue-400
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: dragActive ? "2px solid #2563EB" : "2px dashed #D1D5DB",
          borderRadius: "0.5rem",
          padding: "2rem",
          background: dragActive ? "#EFF6FF" : "#fff",
          transition: "border 0.2s, background 0.2s",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,audio/mp3,audio/wav"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          aria-label="Upload audio file"
        />

        {!isProcessing ? (
          <div style={{ marginTop: "1.5rem" }}>
            <div
              style={{ fontSize: "3.75rem", color: "#9CA3AF" /* gray-400 */ }}
            >
              📁
            </div>
            <div>
              <button
                onClick={handleUploadClick}
                className="upload-button"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1D4ED8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563EB")
                }
              >
                Choose Audio File
              </button>
            </div>
            <p style={{ color: "#4B5563", marginTop: "1rem" /* gray-600 */ }}>
              {dragActive
                ? "Drop your audio file here"
                : "Support for MP3 and WAV files up to 50MB"}
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                fontSize: "3.75rem",
                animation: "spin 1s linear infinite",
              }}
            >
              ⚙️
            </div>
            <p
              style={{ color: "#2563EB", fontWeight: "500", marginTop: "1rem" }}
            >
              Processing your audio file...
            </p>
            <div className="progress" style={{}}>
              <div className="progress-bar"></div>
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
