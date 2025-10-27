
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Data is raw PCM data
function writeWavHeader(data: Uint8Array, sampleRate: number, numChannels: number, bitsPerSample: number): Uint8Array {
  const dataSize = data.length;
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint8(0, 'R'.charCodeAt(0));
  view.setUint8(1, 'I'.charCodeAt(0));
  view.setUint8(2, 'F'.charCodeAt(0));
  view.setUint8(3, 'F'.charCodeAt(0));
  // file length
  view.setUint32(4, 36 + dataSize, true);
  // WAVE identifier
  view.setUint8(8, 'W'.charCodeAt(0));
  view.setUint8(9, 'A'.charCodeAt(0));
  view.setUint8(10, 'V'.charCodeAt(0));
  view.setUint8(11, 'E'.charCodeAt(0));
  // fmt chunk identifier
  view.setUint8(12, 'f'.charCodeAt(0));
  view.setUint8(13, 'm'.charCodeAt(0));
  view.setUint8(14, 't'.charCodeAt(0));
  view.setUint8(15, ' '.charCodeAt(0));
  // chunk length
  view.setUint32(16, 16, true);
  // audio format (1 is PCM)
  view.setUint16(20, 1, true);
  // number of channels
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
  // block align
  view.setUint16(32, numChannels * (bitsPerSample / 8), true);
  // bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  view.setUint8(36, 'd'.charCodeAt(0));
  view.setUint8(37, 'a'.charCodeAt(0));
  view.setUint8(38, 't'.charCodeAt(0));
  view.setUint8(39, 'a'.charCodeAt(0));
  // data size
  view.setUint32(40, dataSize, true);

  return new Uint8Array(buffer);
}

export function createWavBlob(pcmData: Uint8Array, sampleRate: number, numChannels: number): Blob {
    const bitsPerSample = 16; // Gemini TTS returns 16-bit PCM
    const header = writeWavHeader(pcmData, sampleRate, numChannels, bitsPerSample);
    const wavBytes = new Uint8Array(header.length + pcmData.length);
    wavBytes.set(header, 0);
    wavBytes.set(pcmData, header.length);

    return new Blob([wavBytes], { type: 'audio/wav' });
}
