import React from 'react';
import PropTypes from 'prop-types';

const ExportControls = ({ transcript }) => {
  // Copy transcript to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      alert('Transcript copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy transcript. Please try again.');
    }
  };

  // Save transcript as a text file
  const handleSave = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
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
  );
};

ExportControls.propTypes = {
  transcript: PropTypes.string.isRequired,
};

export default ExportControls;
