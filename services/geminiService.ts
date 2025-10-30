import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceOption } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash-preview-tts";

export async function generateSingleSpeakerAudio(text: string, voice: VoiceOption): Promise<string> {
  const response = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Audio generation failed, no audio data received.");
  }
  return base64Audio;
}

export async function generateDialogAudio(text: string): Promise<string> {
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');
  const speakerLines = lines.map(line => {
    const parts = line.split(':');
    if (parts.length < 2) return null;
    return { speaker: parts[0].trim(), text: parts.slice(1).join(':').trim() };
  }).filter(Boolean);

  if (speakerLines.length === 0) {
    throw new Error("Invalid dialog format. Use 'SpeakerName: Text' on each line.");
  }

  const speakers = [...new Set(speakerLines.map(line => line!.speaker))];

  if (speakers.length !== 2) {
    throw new Error(`Dialogs must have exactly 2 speakers. Found ${speakers.length}.`);
  }

  const prompt = `TTS the following conversation between ${speakers[0]} and ${speakers[1]}:\n${text}`;
  
  const response = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: speakers[0],
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Puck' }, // Male default
              },
            },
            {
              speaker: speakers[1],
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }, // Female default
              },
            },
          ],
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Audio generation failed, no audio data received.");
  }
  return base64Audio;
}
