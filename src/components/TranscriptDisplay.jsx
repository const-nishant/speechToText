import React from "react";

const TranscriptDisplay = ({
  transcript,
  isRecording,
  isProcessing,
  mode,
  onClear,
}) => {
  const getPlaceholderText = () => {
    if (isRecording) return "Listening... Transcript will appear here.";
    if (isProcessing) return "Processing audio file...";
    if (mode === "realtime")
      return 'Click "Start Recording" to begin transcription.';
    return "Upload an audio file to see the transcript here.";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#1f2937",
          }}
        >
          Transcript
        </h3>
        {transcript && (
          <button
            onClick={onClear}
            aria-label="Clear transcript"
            className="transcript-clear-button"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            Clear
          </button>
        )}
      </div>

      <div className="transcript-container">
        {transcript ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <p
              style={{
                color: "#1f2937",
                lineHeight: "1.625",
                whiteSpace: "pre-wrap",
              }}
            >
              {transcript}
            </p>
            {isRecording && (
              <div className="loading-spinner">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ color: "#6b7280", textAlign: "center" }}>
              {getPlaceholderText()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;
