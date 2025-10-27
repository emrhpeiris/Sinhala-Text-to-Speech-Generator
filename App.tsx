
import React, { useState, useEffect, useCallback } from 'react';
import { GenerationMode, VoiceOption } from './types';
import { generateSingleSpeakerAudio, generateDialogAudio } from './services/geminiService';
import { decode, createWavBlob } from './utils/audioUtils';
import Loader from './components/Loader';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.SINGLE);
  const [voice, setVoice] = useState<VoiceOption>(VoiceOption.MALE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleGenerateAudio = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to generate audio.');
      return;
    }

    setIsLoading(true);
    setError(null);
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);

    try {
      let base64Audio: string;
      if (generationMode === GenerationMode.SINGLE) {
        base64Audio = await generateSingleSpeakerAudio(text, voice);
      } else {
        base64Audio = await generateDialogAudio(text);
      }
      
      const pcmData = decode(base64Audio);
      // Gemini TTS provides 24000Hz, 1-channel (mono) audio
      const wavBlob = createWavBlob(pcmData, 24000, 1);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [text, generationMode, voice, audioUrl]);

  const ModeButton: React.FC<{mode: GenerationMode; label: string}> = ({ mode, label }) => (
    <button
      onClick={() => setGenerationMode(mode)}
      className={`w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        generationMode === mode
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
      }`}
    >
      {label}
    </button>
  );

  const VoiceButton: React.FC<{option: VoiceOption; label: string; icon: string}> = ({ option, label, icon }) => (
    <button
        onClick={() => setVoice(option)}
        className={`w-full flex items-center justify-center py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            voice === option
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
        }`}
    >
        <i className={`fas ${icon} mr-2`}></i>
        {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8 border border-slate-200">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Sinhala Text-to-Speech Generator
          </h1>
          <p className="mt-2 text-slate-600">
            Powered by Google's Gemini AI
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">1. Select Mode</h2>
          <div className="grid grid-cols-2 gap-4">
            <ModeButton mode={GenerationMode.SINGLE} label="Single Speaker" />
            <ModeButton mode={GenerationMode.DIALOG} label="Dialog (2 Speakers)" />
          </div>
        </section>

        {generationMode === GenerationMode.SINGLE && (
          <section className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-700">2. Choose Voice</h2>
            <div className="grid grid-cols-2 gap-4">
                <VoiceButton option={VoiceOption.MALE} label="Male" icon="fa-male" />
                <VoiceButton option={VoiceOption.FEMALE} label="Female" icon="fa-female" />
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">
            {generationMode === GenerationMode.SINGLE ? '3' : '2'}. Enter Text
          </h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              generationMode === GenerationMode.SINGLE
                ? 'මෙතනින් සිංහල යුනිකෝඩ් යොදන්න...'
                : 'Format:\nSpeaker 1: Hello\nSpeaker 2: Hi there!'
            }
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-y"
          />
        </section>

        <button
          onClick={handleGenerateAudio}
          disabled={isLoading}
          className="w-full flex items-center justify-center py-4 px-6 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-3"></i>
              Generate Audio
            </>
          )}
        </button>

        <div className="flex justify-center items-center pt-4">
          {isLoading && <Loader />}
          {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg w-full text-center">{error}</div>}
          {audioUrl && !isLoading && <AudioPlayer audioUrl={audioUrl} />}
        </div>
      </main>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
