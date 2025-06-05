import React, { useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import ModeToggle from "./components/ModeToggle.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import RecordingControls from "./components/RecordingControls.jsx";
import FileUpload from "./components/FileUpload.jsx";

export const App = () => {
  const [mode, setMode] = useState("realtime");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const [language, setLanguage] = useState("en");
  const [tab, setTab] = useState("record"); // 'record' or 'upload'
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  // Start recording and streaming audio to backend
  const startRecording = async () => {
    setTranscript("");
    setIsRecording(true);
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
    if (socketRef.current) {
      socketRef.current.emit("stop-audio-stream", { language });
    }
  };

  // Handle file upload to backend
  const handleFileUpload = async (file) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["audio/mp3", "audio/wav", "audio/mpeg"];
      if (
        validTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith(".mp3") ||
        file.name.toLowerCase().endsWith(".wav")
      ) {
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
      } else {
        alert("Please select a valid MP3 or WAV file.");
      }
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "zh", name: "Mandarin", flag: "🇨🇳" },
  ];

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

  const getPlaceholderText = () => {
    if (isRecording) return "Listening... Transcript will appear here.";
    if (isProcessing) return "Processing audio file...";
    if (mode === "realtime")
      return 'Click "Start Recording" to begin transcription.';
    return "Upload an audio file to see the transcript here.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Voice Transcription
          </h1>
          <p className="text-gray-600 text-lg">
            Convert speech to text in multiple languages
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Mode Toggle */}
          <ModeToggle mode={mode} onModeChange={setMode} />

          {/* Language Selector */}
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />

          <div className="border-t border-gray-200 pt-8">
            {mode === "realtime" ? (
              /* Recording Controls */
              <RecordingControls
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
              />
            ) : (
              /* File Upload */
              <FileUpload
                onFileUpload={handleFileUpload}
                isProcessing={isProcessing}
                selectedLanguage={selectedLanguage}
              />
            )}
          </div>

          {/* Transcript Display */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Transcript
              </h3>
              {transcript && (
                <button
                  onClick={handleClearTranscript}
                  className="text-gray-500 hover:text-red-600 transition-colors duration-200 text-sm font-medium"
                  aria-label="Clear transcript"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-6 min-h-48 bg-gray-50">
              {transcript ? (
                <div className="space-y-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {transcript}
                  </p>
                  {isRecording && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    {getPlaceholderText()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Export Controls */}
          {transcript && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Export Options
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                  aria-label="Copy transcript to clipboard"
                >
                  <span>📋</span>
                  <span>Copy</span>
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                  aria-label="Save transcript as file"
                >
                  <span>💾</span>
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-500">
          <p>Supports English, Spanish, French, Hindi, and Mandarin</p>
        </div>
      </div>
    </div>
  );
};
