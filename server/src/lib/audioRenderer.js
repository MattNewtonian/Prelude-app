/**
 * Audio Rendering with FluidSynth
 * Converts MIDI files to WAV/MP3 using Steinway Grand soundfont
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Render MIDI to audio using FluidSynth with Steinway soundfont
 * @param {string} midiPath - Path to MIDI file
 * @param {string} outputDir - Directory for output files
 * @param {object} options - Rendering options
 * @returns {Promise<{wav: string, mp3?: string}>}
 */
export async function renderAudio(midiPath, outputDir, options = {}) {
  const {
    soundfont = process.env.SOUNDFONT_PATH || '/usr/share/sounds/sf2/FluidR3_GM.sf2',
    sampleRate = 48000,
    generateMP3 = true,
    mp3Quality = 1 // VBR quality 1 (very high quality)
  } = options;

  const basename = path.basename(midiPath, '.midi');
  const wavPath = path.join(outputDir, `${basename}.wav`);
  const mp3Path = path.join(outputDir, `${basename}.mp3`);

  try {
    // Check if FluidSynth is available
    try {
      await execAsync('which fluidsynth');
    } catch (error) {
      throw new Error('FluidSynth not found. Please install: brew install fluid-synth (macOS) or apt-get install fluidsynth (Linux)');
    }

    // Check if soundfont exists
    try {
      await fs.access(soundfont);
    } catch (error) {
      throw new Error(`Soundfont not found at: ${soundfont}. Please set SOUNDFONT_PATH in .env`);
    }

    // Render MIDI to WAV using FluidSynth
    console.log(`[AudioRenderer] Rendering ${basename}.midi to WAV with Steinway soundfont...`);

    // Piano-optimized FluidSynth settings:
    // - gain 0.8: louder than the default 0.2 (avoids noise floor issues after normalization)
    // - reverb room-size 0.6: medium concert hall acoustics
    // - reverb damp 0.4: partial high-frequency damping (natural piano decay)
    // - reverb width 0.8: wide stereo field
    // - reverb level 0.35: noticeable but not overwhelming reverb
    // - chorus off: chorus muddies piano timbre
    const fluidSynthCommand = [
      'fluidsynth', '-ni',
      `-g 0.8`,
      `-o synth.reverb.active=yes`,
      `-o synth.reverb.room-size=0.6`,
      `-o synth.reverb.damp=0.4`,
      `-o synth.reverb.width=0.8`,
      `-o synth.reverb.level=0.35`,
      `-o synth.chorus.active=no`,
      `"${soundfont}"`,
      `"${midiPath}"`,
      `-F "${wavPath}"`,
      `-r ${sampleRate}`
    ].join(' ');

    const { stdout, stderr } = await execAsync(fluidSynthCommand, {
      timeout: 60000, // 60 second timeout
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    if (stdout) {
      console.log('[FluidSynth stdout]:', stdout);
    }
    if (stderr) {
      console.log('[FluidSynth stderr]:', stderr);
    }

    // Verify WAV was created
    try {
      await fs.access(wavPath);
    } catch (error) {
      throw new Error(`WAV file not generated at ${wavPath}`);
    }

    const result = { wav: wavPath };

    // Optionally convert to MP3 using ffmpeg
    if (generateMP3) {
      try {
        // Check if ffmpeg is available
        await execAsync('which ffmpeg');

        console.log(`[AudioRenderer] Converting WAV to MP3...`);

        // Normalize loudness to -16 LUFS (streaming standard) and add gentle EQ:
        // - loudnorm: consistent perceived loudness across all pieces
        // - highpass at 30Hz: remove sub-bass rumble from synthesis artifacts
        // - VBR quality 1: ~220 kbps (higher than default q=2)
        const ffmpegCommand = `ffmpeg -i "${wavPath}" -af "highpass=f=30,loudnorm=I=-16:TP=-1.5:LRA=11" -codec:a libmp3lame -qscale:a ${mp3Quality} "${mp3Path}" -y`;

        const { stdout: ffmpegStdout, stderr: ffmpegStderr } = await execAsync(ffmpegCommand, {
          timeout: 60000,
          maxBuffer: 1024 * 1024 * 10
        });

        if (ffmpegStdout) {
          console.log('[ffmpeg stdout]:', ffmpegStdout);
        }
        if (ffmpegStderr && !ffmpegStderr.includes('frame=')) {
          // ffmpeg outputs progress to stderr, so only log if it's not progress info
          console.log('[ffmpeg stderr]:', ffmpegStderr);
        }

        // Verify MP3 was created
        await fs.access(mp3Path);
        result.mp3 = mp3Path;

        console.log(`[AudioRenderer] ✓ Audio rendering complete: WAV + MP3`);

      } catch (error) {
        console.warn('[AudioRenderer] MP3 conversion failed (ffmpeg not available or error), WAV only:', error.message);
      }
    } else {
      console.log(`[AudioRenderer] ✓ Audio rendering complete: WAV only`);
    }

    return result;

  } catch (error) {
    // Clean up partial files on error
    try {
      await fs.unlink(wavPath).catch(() => {});
      await fs.unlink(mp3Path).catch(() => {});
    } catch {}

    throw new Error(`Audio rendering failed: ${error.message}`);
  }
}

/**
 * Check if FluidSynth and dependencies are available
 * @returns {Promise<{fluidsynth: boolean, ffmpeg: boolean, soundfont: boolean}>}
 */
export async function checkAudioDependencies() {
  const result = {
    fluidsynth: false,
    ffmpeg: false,
    soundfont: false
  };

  try {
    await execAsync('which fluidsynth');
    result.fluidsynth = true;
  } catch {}

  try {
    await execAsync('which ffmpeg');
    result.ffmpeg = true;
  } catch {}

  const soundfontPath = process.env.SOUNDFONT_PATH || '/usr/share/soundfonts/default.sf2';
  try {
    await fs.access(soundfontPath);
    result.soundfont = true;
  } catch {}

  return result;
}
