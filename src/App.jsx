// App.jsx
import React, { useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("en");
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  // Start recording and streaming audio to backend
  const startRecording = async () => {
    setTranscript("");
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
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
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

  // Handle export of transcript to file
  const handleExport = async () => {
    const res = await axios.post(
      "http://localhost:3001/api/v1/export",
      { text: transcript },
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transcript.txt");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Audio Transcription App
      </h1>
      <section
        id="controls"
        className="w-full max-w-md bg-white rounded-lg shadow p-6"
      >
        <div className="input-section mb-4">
          <h3 className="text-lg font-semibold mb-2">Choose Audio Input:</h3>
          <button
            id="start-recording"
            onClick={startRecording}
            disabled={isRecording}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Start Recording
          </button>
          <button
            id="stop-recording"
            onClick={stopRecording}
            disabled={!isRecording}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Stop Recording
          </button>
          <p className="my-2">or</p>
          <input
            type="file"
            id="file-upload"
            accept=".mp3,.wav,audio/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="language" className="block mb-1 font-medium">
            Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="zh">Mandarin</option>
          </select>
        </div>
        <div>
          <label htmlFor="transcript" className="block mb-1 font-medium">
            Transcript:
          </label>
          <textarea
            id="transcript"
            value={transcript}
            readOnly
            className="border rounded p-2 w-full h-24"
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            id="export-button"
            onClick={handleExport}
            className="bg-green-500 text-white  px-4 py-2 rounded"
          >
            Export Transcript
          </button>
        </div>
      </section>
    </div>
  );
};
