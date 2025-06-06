import React from "react";

const TranscriptDisplay = ({
  transcript,
  isRecording,
  isProcessing,
  mode,
  onClear,
}) => {
  // Show "Processing..." after recording stops and before transcript is filled
  const showProcessing =
    !isRecording && isProcessing && (!transcript || transcript.trim() === "");

  const getPlaceholderText = () => {
    if (showProcessing) return "Processing audio file...";
    if (isRecording) return "Listening... Transcript will appear here.";
    if (mode === "realtime")
      return 'Click "Start Recording" to begin transcription.';
    return "Upload an audio file to see the transcript here.";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
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
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                fontWeight: "500",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
            >
              Clear
            </button>
          )}
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            minHeight: "12rem",
            backgroundColor: "#f9fafb",
          }}
        >
          {showProcessing ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  color: "#2563eb",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                Processing audio file...
              </p>
            </div>
          ) : transcript ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#2563eb",
                  }}
                >
                  <div
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      backgroundColor: "#2563eb",
                      borderRadius: "9999px",
                      animation: "bounce 1.5s infinite",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      backgroundColor: "#2563eb",
                      borderRadius: "9999px",
                      animation: "bounce 1.5s infinite",
                      animationDelay: "0.1s",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      backgroundColor: "#2563eb",
                      borderRadius: "9999px",
                      animation: "bounce 1.5s infinite",
                      animationDelay: "0.2s",
                    }}
                  ></div>
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
    </div>
  );
};

export default TranscriptDisplay;
