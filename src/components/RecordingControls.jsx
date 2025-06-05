import React from "react";

const RecordingControls = ({
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Voice Recording</h3>

      <div className="flex justify-center">
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label="Start recording"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span className="text-lg">Start Recording</span>
            </div>
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 animate-pulse"
            aria-label="Stop recording"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
              <span className="text-lg">Stop Recording</span>
            </div>
          </button>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <span className="font-medium">Recording in progress...</span>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
