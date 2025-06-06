import React from "react";

const ModeToggle = ({ mode, onModeChange }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          backgroundColor: "#F3F4F6", // Tailwind's gray-100
          padding: "0.25rem ",
          gap: "0.5rem",
          borderRadius: "0.5rem",
          display: "flex",
        }}
      >
        <button
          onClick={() => onModeChange("realtime")}
          aria-pressed={mode === "realtime"}
          style={{
            padding: "0.8rem 1.0rem",
            borderRadius: "0.375rem",
            borderColor: mode === "realtime" ? "transparent" : "#4B5563", // gray-600
            fontWeight: 600,
            transition: "all 0.2s",
            cursor: "pointer",
            backgroundColor: mode === "realtime" ? "#2563EB" : "transparent", // blue-600
            color: mode === "realtime" ? "#FFFFFF" : "#4B5563", // white or gray-600
            boxShadow:
              mode === "realtime" ? "0 1px 3px rgba(0, 0, 0, 0.2)" : "none",
          }}
        >
          Real-time Recording
        </button>
        <button
          onClick={() => onModeChange("upload")}
          aria-pressed={mode === "upload"}
          style={{
            padding: "0.5rem 1.5rem",
            borderRadius: "0.375rem",
            borderColor: mode === "upload" ? "transparent" : "#4B5563", // gray-600
            fontWeight: 500,
            transition: "all 0.2s",
            cursor: "pointer",
            backgroundColor: mode === "upload" ? "#2563EB" : "transparent", // blue-600
            color: mode === "upload" ? "#FFFFFF" : "#4B5563", // white or gray-600
            boxShadow:
              mode === "upload" ? "0 1px 3px rgba(0, 0, 0, 0.2)" : "none",
          }}
        >
          File Upload
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
