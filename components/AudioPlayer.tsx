
import React from 'react';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-slate-700">Generated Audio</h3>
      <audio controls src={audioUrl} className="w-full">
        Your browser does not support the audio element.
      </audio>
      <a
        href={audioUrl}
        download="sinhala_audio.wav"
        className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        <i className="fas fa-download mr-2"></i>
        Download .wav
      </a>
    </div>
  );
};

export default AudioPlayer;
