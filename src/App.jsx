import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import ModeToggle from "./components/ModeToggle.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import RecordingControls from "./components/RecordingControls.jsx";
import FileUpload from "./components/FileUpload.jsx";
import TranscriptDisplay from "./components/TranscriptDisplay.jsx";

export const App = () => {
  const [mode, setMode] = useState("realtime");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState("en");
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  // When transcript arrives, stop processing
  useEffect(() => {
    if (transcript && transcript.trim() !== "") {
      setIsProcessing(false);
    }
  }, [transcript]);

  // Start recording and streaming audio to backend
  const startRecording = async () => {
    setTranscript("");
    setIsRecording(true);
    setIsProcessing(false); // Not processing while recording
    console.log("Recording started in language:", selectedLanguage);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    // Connect socket
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001");
      socketRef.current.on("transcript-result", (data) => {
        setTranscript(data);
      });
    }

    mediaRecorder.ondataavailable = (event) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = btoa(
          new Uint8Array(reader.result).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        socketRef.current.emit("audio-stream", {
          audioChunk: base64,
          language,
        });
      };
      reader.readAsArrayBuffer(event.data);
    };

    mediaRecorder.start(1000);
    setIsRecording(true);
  };

  // Stop recording and tell backend to process audio
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsProcessing(true); // Start processing after recording stops
    if (socketRef.current) {
      socketRef.current.emit("stop-audio-stream", { language });
    }
  };

  // Handle file upload to backend
  const handleFileUpload = async (event) => {
    let file;
    // Support both direct file and event from <input>
    if (event && event.target && event.target.files) {
      file = event.target.files[0];
    } else if (event instanceof File) {
      file = event;
    } else {
      return;
    }
    if (!file) return;
    setTranscript("Processing...");
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("language", language);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/v1/upload",
        formData
      );
      setTranscript(res.data.transcript);
    } catch (err) {
      setTranscript("Error processing file.");
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    console.log("Language changed to:", language);
  };

  const handleClearTranscript = () => {
    setTranscript("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      alert("Transcript copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy transcript. Please try again.");
    }
  };

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

    //export using backend
    // const res = await axios.post(
    //   "http://localhost:3001/api/v1/export",
    //   { text: transcript },
    //   { responseType: "blob" }
    // );
    // const url = window.URL.createObjectURL(new Blob([res.data]));
    // const link = document.createElement("a");
    // link.href = url;
    // link.setAttribute("download", "transcript.txt");
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
    // window.URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)", // from-blue-50 to-indigo-100
      }}
    >
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Voice Transcription
          </h1>
          <p style={{ color: "#4b5563", fontSize: "1.125rem" }}>
            Convert speech to text in multiple languages
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {/* Mode Toggle */}
          <ModeToggle mode={mode} onModeChange={setMode} />

          {/* Language Selector */}
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "2rem",
            }}
          >
            {mode === "realtime" ? (
              <RecordingControls
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
              />
            ) : (
              <FileUpload
                onFileUpload={handleFileUpload}
                isProcessing={isProcessing}
                selectedLanguage={selectedLanguage}
              />
            )}
          </div>

          {/* --- Transcript Display --- */}
          <TranscriptDisplay
            transcript={transcript}
            isRecording={isRecording}
            isProcessing={isProcessing}
            mode={mode}
            onClear={handleClearTranscript}
          />

          {/* --- Export Options and other sections remain unchanged --- */}
          {transcript && (
            <div
              style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#1f2937",
                  textAlign: "center",
                  marginBottom: "1rem",
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
                  aria-label="Copy transcript to clipboard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#4b5563",
                    color: "white",
                    fontWeight: "500",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#374151")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#4b5563")
                  }
                >
                  <span>📋</span>
                  <span>Copy</span>
                </button>

                <button
                  onClick={handleSave}
                  aria-label="Save transcript as file"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "#16a34a",
                    color: "white",
                    fontWeight: "500",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#15803d")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#16a34a")
                  }
                >
                  <span>💾</span>
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
