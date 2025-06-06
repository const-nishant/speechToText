import React from "react";

const RecordingControls = ({
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <h3 className="recording-title">Voice Recording</h3>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            aria-label="Start recording"
            className="start-recording-button"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#15803D")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#16A34A")
            }
          >
            <div className="recording-icon"></div>
            <span style={{ fontSize: "1.125rem" }}>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            aria-label="Stop recording"
            className="stop-recording-button"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#B91C1C")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#DC2626")
            }
          >
            <div className="recording-icon"></div>
            <span style={{ fontSize: "1.125rem" }}>Stop Recording</span>
          </button>
        )}
      </div>

      {isRecording && (
        <div className="animate-pulse">
          <div className="animate-spin"></div>
          <span style={{ fontWeight: "500" }}>Recording in progress...</span>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
