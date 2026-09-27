/**
 * PULSE - Web Audio Synthesizer
 * Zero external audio files required. Generates soothing ambient focus noise
 * and completion chimes using the browser's native AudioContext.
 */

let audioCtx = null;
let ambientSource = null;
let ambientGain = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a triumphant completion chord (C-maj9 vibe)
 */
export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 1.8);
    });
  } catch (err) {
    console.warn('Audio chime note:', err);
  }
}

/**
 * Toggles gentle brown/pink ambient rain noise for deep focus
 */
export function toggleAmbientNoise(enable = true, volume = 0.04) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (!enable) {
      if (ambientSource) {
        try {
          ambientSource.stop();
          ambientSource.disconnect();
        } catch {
          // ignore
        }
        ambientSource = null;
      }
      return false;
    }

    if (ambientSource) return true; // already playing

    // Generate 5 seconds of soft pink noise buffer
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = buffer;
    ambientSource.loop = true;

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);

    ambientSource.connect(ambientGain);
    ambientGain.connect(ctx.destination);
    ambientSource.start();

    return true;
  } catch (err) {
    console.warn('Audio ambient note:', err);
    return false;
  }
}
