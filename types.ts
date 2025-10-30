export enum GenerationMode {
  SINGLE = 'single',
  DIALOG = 'dialog',
}

// Using API voice names directly. These are the available prebuilt voices.
export type VoiceOption = 'Puck' | 'Kore' | 'Zephyr' | 'Charon' | 'Fenrir';

export const MALE_VOICES: VoiceOption[] = ['Puck', 'Zephyr', 'Charon', 'Fenrir'];
export const FEMALE_VOICES: VoiceOption[] = ['Kore'];
