export enum GenerationMode {
  SINGLE = 'single',
  DIALOG = 'dialog',
}

export enum Language {
  SINHALA = 'sinhala',
  ENGLISH = 'english',
}

// Using API voice names directly. These are the available prebuilt voices for Sinhala.
export type VoiceOption = 'Puck' | 'Kore' | 'Zephyr' | 'Charon' | 'Fenrir';
export type EnglishVoiceOption = 'Kore' | 'Puck' | 'Charon' | 'Fenrir';

export const MALE_VOICES: VoiceOption[] = ['Puck', 'Zephyr', 'Charon', 'Fenrir'];
export const FEMALE_VOICES: VoiceOption[] = ['Kore'];

export const ENGLISH_VOICES: { label: string; voice: EnglishVoiceOption; icon: string }[] = [
    { label: 'Female', voice: 'Kore', icon: 'fa-female' },
    { label: 'Male', voice: 'Puck', icon: 'fa-male' },
    { label: 'Narrator', voice: 'Charon', icon: 'fa-user-tie' }, // Using 'Charon' for a deeper narrator voice
    { label: 'Presenter', voice: 'Fenrir', icon: 'fa-microphone-alt' }, // Added new deep voice for presentations/audiobooks
];