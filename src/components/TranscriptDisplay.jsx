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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Transcript</h3>
        {transcript && (
          <button
            onClick={onClear}
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
            <p className="text-gray-500 text-center">{getPlaceholderText()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;
