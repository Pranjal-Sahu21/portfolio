// Web Audio API sound generator for premium, low-latency UI feedback
import sayMyNameUrl from "../assets/say-my-name.mp3";

let audioCtx = null;
let sayMyNameAudio = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume context if suspended (browser security autoplays policy)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a high-end subtle mechanical "tick" for hover interactions.
 * Inspired by premium minimal design portfolios like bymonolog.com
 */
export function playHoverSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Check if context was successfully initialized/resumed
    if (ctx.state === "suspended") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    // Crisp, fast mechanical tick
    osc.frequency.setValueAtTime(1600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.012);

    // Louder hover volume
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);

    // Cut low-end thuds
    filter.type = "highpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.015);
  } catch (error) {
    // Fail silently
  }
}

/**
 * Play an organic crisp "click" for button/link clicks.
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    // Lower mechanical wood-like tick / tap sound
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.03);

    // Louder click volume
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1500, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.035);
  } catch (error) {
    // Fail silently
  }
}

/**
 * Play a gentle, cute digital chirp for speech bubble updates (character "talking").
 */
export function playSpeechSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Soft double chirp
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.setValueAtTime(720, now + 0.03);

    // Louder speech volume
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.075);
  } catch (error) {
    // Fail silently
  }
}

/**
 * Play a cascading 5-step ascending arpeggio matching the staggered staircase transition.
 */
export function playStaircaseSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") return;

    const now = ctx.currentTime;
    // Major pentatonic scale / ascending chord for premium retro-futuristic feel
    const freqs = [329.63, 392.00, 440.00, 523.25, 587.33]; // E4, G4, A4, C5, D5

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      const startTime = now + idx * 0.08;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth envelope for each cascading step
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.04, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, startTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (error) {
    // Fail silently
  }
}

/**
 * Play Walter White's iconic "Say my name" Breaking Bad audio clip.
 */
export function playSayMyNameSound() {
  try {
    if (!sayMyNameAudio) {
      sayMyNameAudio = new Audio(sayMyNameUrl);
      sayMyNameAudio.volume = 0.55;
    }
    sayMyNameAudio.currentTime = 0;
    sayMyNameAudio.play();
  } catch (error) {
    // Fail silently
  }
}
