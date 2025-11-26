
export enum GenerationMode {
  SINGLE = 'single',
  DIALOG = 'dialog',
}

export enum Language {
  SINHALA = 'sinhala',
  ENGLISH = 'english',
  TAMIL = 'tamil',
}

// Using API voice names directly.
export type VoiceOption = 'Puck' | 'Kore' | 'Zephyr' | 'Charon' | 'Fenrir';

export interface VoiceProfile {
  id: VoiceOption;
  label: string;
  gender: 'male' | 'female';
  icon: string;
}

export const SINHALA_VOICES_LIST: VoiceProfile[] = [
    { id: 'Puck', label: 'M-Puck', gender: 'male', icon: 'fa-male' },
    { id: 'Zephyr', label: 'F-Zephyr', gender: 'female', icon: 'fa-female' },
    { id: 'Charon', label: 'M-Charon', gender: 'male', icon: 'fa-male' },
    { id: 'Fenrir', label: 'M-Fenrir', gender: 'male', icon: 'fa-male' },
    { id: 'Kore', label: 'F-Kore', gender: 'female', icon: 'fa-female' },
];

export const ENGLISH_VOICES_LIST: VoiceProfile[] = [
    { id: 'Kore', label: 'F-Kore', gender: 'female', icon: 'fa-female' },
    { id: 'Puck', label: 'M-Puck', gender: 'male', icon: 'fa-male' },
    { id: 'Charon', label: 'M-Charon', gender: 'male', icon: 'fa-user-tie' },
    { id: 'Fenrir', label: 'M-Fenrir', gender: 'male', icon: 'fa-microphone-alt' },
];

export const TAMIL_VOICES_LIST: VoiceProfile[] = [
    { id: 'Kore', label: 'F-Kore', gender: 'female', icon: 'fa-female' },
    { id: 'Puck', label: 'M-Puck', gender: 'male', icon: 'fa-male' },
];