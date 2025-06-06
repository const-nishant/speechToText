import React from "react";
import PropTypes from "prop-types";

const ExportControls = ({ transcript }) => {
  // Copy transcript to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      alert("Transcript copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy transcript. Please try again.");
    }
  };

  // Save transcript as a text file
  const handleSave = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "1.5rem" }}>
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: "600",
          color: "#1F2937", // gray-800
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Export Options
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={handleCopy}
          className="copy-button"
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#374151")
          } // gray-700
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#4B5563")
          }
          aria-label="Copy transcript to clipboard"
        >
          <span>📋</span>
          <span>Copy</span>
        </button>

        <button
          onClick={handleSave}
          className="save-button"
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#15803D")
          } // green-700
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#16A34A")
          }
          aria-label="Save transcript as file"
        >
          <span>💾</span>
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

ExportControls.propTypes = {
  transcript: PropTypes.string.isRequired,
};

export default ExportControls;
