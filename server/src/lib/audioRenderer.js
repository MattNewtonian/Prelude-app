/**
 * Audio Rendering with FluidSynth
 * Renders MIDI to WAV — served directly to the browser (no MP3 conversion needed).
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Render MIDI to WAV using FluidSynth with piano soundfont.
 * WAV is served directly for browser playback — no MP3 conversion.
 * @param {string} midiPath - Path to MIDI file
 * @param {string} outputDir - Directory for output files
 * @returns {Promise<{wav: string}>}
 */
export async function renderAudio(midiPath, outputDir) {
  const soundfont = process.env.SOUNDFONT_PATH || '/usr/share/sounds/sf2/FluidR3_GM.sf2';
  const sampleRate = 44100; // 44.1kHz is sufficient for web playback

  const basename = path.basename(midiPath, '.midi');
  const wavPath = path.join(outputDir, `${basename}.wav`);

  // Check if FluidSynth is available
  try {
    await execAsync('which fluidsynth');
  } catch {
    throw new Error('FluidSynth not found. Install with: apt-get install fluidsynth');
  }

  // Check if soundfont exists
  try {
    await fs.access(soundfont);
  } catch {
    throw new Error(`Soundfont not found at: ${soundfont}. Set SOUNDFONT_PATH env var.`);
  }

  console.log(`[AudioRenderer] Rendering ${basename}.midi → WAV...`);

  // Piano-optimized FluidSynth settings:
  // -g 0.8     : gain (default 0.2 is too quiet)
  // reverb     : concert hall acoustics (room 0.6, damp 0.4, width 0.8, level 0.35)
  // chorus off : chorus muddies piano timbre
  const fluidSynthCommand = [
    'fluidsynth', '-ni',
    '-g 0.8',
    '-o synth.reverb.active=yes',
    '-o synth.reverb.room-size=0.6',
    '-o synth.reverb.damp=0.4',
    '-o synth.reverb.width=0.8',
    '-o synth.reverb.level=0.35',
    '-o synth.chorus.active=no',
    `"${soundfont}"`,
    `"${midiPath}"`,
    `-F "${wavPath}"`,
    `-r ${sampleRate}`
  ].join(' ');

  const { stdout, stderr } = await execAsync(fluidSynthCommand, {
    timeout: 60000,
    maxBuffer: 1024 * 1024 * 10
  });

  if (stdout) console.log('[FluidSynth stdout]:', stdout);
  if (stderr) console.log('[FluidSynth stderr]:', stderr);

  // Verify WAV was created
  try {
    await fs.access(wavPath);
  } catch {
    throw new Error(`WAV file not generated at ${wavPath}`);
  }

  console.log(`[AudioRenderer] ✓ Done — ${basename}.wav`);
  return { wav: wavPath };
}

/**
 * Check if FluidSynth and soundfont are available
 */
export async function checkAudioDependencies() {
  const result = { fluidsynth: false, soundfont: false };

  try {
    await execAsync('which fluidsynth');
    result.fluidsynth = true;
  } catch {}

  const soundfontPath = process.env.SOUNDFONT_PATH || '/usr/share/sounds/sf2/FluidR3_GM.sf2';
  try {
    await fs.access(soundfontPath);
    result.soundfont = true;
  } catch {}

  return result;
}
