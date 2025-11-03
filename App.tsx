import React, { useState, useEffect, useCallback } from 'react';
import { GenerationMode, VoiceOption, MALE_VOICES, FEMALE_VOICES, Language, EnglishVoiceOption, ENGLISH_VOICES, TAMIL_VOICES } from './types';
import { generateSingleSpeakerAudio, generateDialogAudio } from './services/geminiService';
import { decode, createWavBlob } from './utils/audioUtils';
import Loader from './components/Loader';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [language, setLanguage] = useState<Language>(Language.SINHALA);
  const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.SINGLE);
  const [voice, setVoice] = useState<VoiceOption | EnglishVoiceOption>('Puck');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup audio URL on component unmount or when a new one is created
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Reset settings when language changes
  useEffect(() => {
    // Reset common state for any language change
    setGenerationMode(GenerationMode.SINGLE);
    setText('');
    setError(null);
    setAudioUrl(null);

    // Set language-specific defaults
    if (language === Language.SINHALA) {
        setVoice('Puck'); // Default Sinhala voice
    } else if (language === Language.ENGLISH) {
        setVoice('Kore'); // Default English voice
    } else { // Tamil
        setVoice('Kore'); // Default Tamil voice
    }
  }, [language]);


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
        // The voice state now holds either a Sinhala or English voice name
        base64Audio = await generateSingleSpeakerAudio(text, voice as VoiceOption);
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

  const stepOffset = language === Language.SINHALA ? 1 : 0;
  
  const LanguageButton: React.FC<{lang: Language; label: string}> = ({ lang, label }) => (
    <button
      onClick={() => setLanguage(lang)}
      className={`w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        language === lang
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
      }`}
    >
      {label}
    </button>
  );

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

  const VoiceButton: React.FC<{option: VoiceOption | EnglishVoiceOption; label: string; icon: string}> = ({ option, label, icon }) => (
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
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8 border border-slate-200">
        <header className="text-center space-y-4">
          <div className="flex justify-center">
            <img src="https://metaphoragency.com/assets/img/hero/shape-3.png" alt="Metaphor Logo" className="h-16 w-auto" />
          </div>
          <p className="text-xl font-semibold text-indigo-600 tracking-wide">
            Metaphor Marketing Agency
          </p>
          <div className="pt-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Multilingual Text-to-Speech
            </h1>
            <p className="text-slate-600">
              Powered by Google's Gemini AI
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">1. Select Language</h2>
          <div className="grid grid-cols-3 gap-4">
            <LanguageButton lang={Language.SINHALA} label="Sinhala" />
            <LanguageButton lang={Language.TAMIL} label="Tamil" />
            <LanguageButton lang={Language.ENGLISH} label="English" />
          </div>
        </section>

        {language === Language.SINHALA && (
          <section className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-700">2. Select Mode</h2>
            <div className="grid grid-cols-2 gap-4">
              <ModeButton mode={GenerationMode.SINGLE} label="Single Speaker" />
              <ModeButton mode={GenerationMode.DIALOG} label="Dialog (2 Speakers)" />
            </div>
          </section>
        )}

        {generationMode === GenerationMode.SINGLE && (
          <section className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-700">{2 + stepOffset}. Choose Voice</h2>
            {language === Language.SINHALA ? (
              <>
                <div>
                  <h3 className="text-md font-medium text-slate-600 mb-3">Male Voices</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {MALE_VOICES.map((voiceName, index) => (
                        <VoiceButton key={voiceName} option={voiceName} label={`Male ${index + 1}`} icon="fa-male" />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-slate-600 mb-3">Female Voices</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {FEMALE_VOICES.map((voiceName, index) => (
                        <VoiceButton key={voiceName} option={voiceName} label={`Female ${index + 1}`} icon="fa-female" />
                    ))}
                  </div>
                </div>
              </>
            ) : language === Language.ENGLISH ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ENGLISH_VOICES.map(({ voice, label, icon }) => (
                  <VoiceButton key={voice} option={voice} label={label} icon={icon} />
                ))}
              </div>
            ) : ( // Tamil
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TAMIL_VOICES.map(({ voice, label, icon }) => (
                  <VoiceButton key={voice} option={voice} label={label} icon={icon} />
                ))}
              </div>
            )}
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">
            {generationMode === GenerationMode.SINGLE ? 3 + stepOffset : 2 + stepOffset}. Enter Text
          </h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              language === Language.SINHALA
                ? generationMode === GenerationMode.SINGLE ? 'මෙතනින් සිංහල යුනිකෝඩ් යොදන්න...' : 'Format:\nකථිකයා 1: හෙලෝ\nකථිකයා 2: ආයුබෝවන්!'
                : language === Language.ENGLISH 
                ? 'Enter English text here...'
                : 'உங்கள் உரையை இங்கே உள்ளிடவும்...'
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