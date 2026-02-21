/**
 * MIDI Validation Utility
 * Verifies that generated MIDI files use Acoustic Grand Piano (Program 0)
 * and have proper channel separation for RH and LH
 */

import MidiParser from 'midi-parser-js';
import fs from 'fs/promises';

/**
 * Validate MIDI file for correct instrumentation
 * @param {string} midiPath - Path to MIDI file
 * @returns {Promise<{valid: boolean, details: object, errors: string[]}>}
 */
export async function validateMidi(midiPath) {
  const errors = [];
  const details = {
    programChanges: [],
    channels: new Set(),
    tracks: 0
  };

  try {
    // Read MIDI file
    const midiData = await fs.readFile(midiPath);
    const midiArray = new Uint8Array(midiData);

    // Parse MIDI
    const parsed = MidiParser.parse(midiArray);

    if (!parsed || !parsed.track) {
      errors.push('Invalid MIDI file structure');
      return { valid: false, details, errors };
    }

    details.tracks = parsed.track.length;

    // Analyze each track
    for (let trackIndex = 0; trackIndex < parsed.track.length; trackIndex++) {
      const track = parsed.track[trackIndex];

      for (const event of track.event) {
        // Check for Program Change events (type 12)
        if (event.type === 12) {
          const program = event.data;
          const channel = event.channel || 0;

          details.programChanges.push({
            track: trackIndex,
            channel: channel,
            program: program
          });

          // Verify it's Acoustic Grand Piano (Program 0)
          if (program !== 0) {
            errors.push(
              `Track ${trackIndex}, Channel ${channel}: Wrong instrument (Program ${program}, expected 0 for Acoustic Grand)`
            );
          }
        }

        // Track channels that have note events
        if (event.type === 9 || event.type === 8) { // Note On / Note Off
          if (event.channel !== undefined) {
            details.channels.add(event.channel);
          }
        }
      }
    }

    // Verify we have at least 2 channels (RH and LH)
    if (details.channels.size < 2) {
      errors.push(
        `Only ${details.channels.size} channel(s) found, expected at least 2 for RH and LH separation`
      );
    }

    // Verify we have program changes
    if (details.programChanges.length === 0) {
      errors.push('No Program Change events found in MIDI file');
    }

    return {
      valid: errors.length === 0,
      details: {
        ...details,
        channels: Array.from(details.channels).sort()
      },
      errors
    };

  } catch (error) {
    errors.push(`MIDI parsing failed: ${error.message}`);
    return { valid: false, details, errors };
  }
}

/**
 * Get a human-readable validation report
 */
export function getValidationReport(result) {
  const { valid, details, errors } = result;

  let report = '=== MIDI Validation Report ===\n';
  report += `Status: ${valid ? '✓ VALID' : '✗ INVALID'}\n`;
  report += `Tracks: ${details.tracks}\n`;
  report += `Channels: ${details.channels.join(', ')}\n`;
  report += `Program Changes: ${details.programChanges.length}\n`;

  if (details.programChanges.length > 0) {
    report += '\nInstruments:\n';
    details.programChanges.forEach(pc => {
      const instrument = pc.program === 0 ? 'Acoustic Grand Piano' : `Program ${pc.program}`;
      report += `  Track ${pc.track}, Channel ${pc.channel}: ${instrument}\n`;
    });
  }

  if (errors.length > 0) {
    report += '\nErrors:\n';
    errors.forEach(err => {
      report += `  - ${err}\n`;
    });
  }

  return report;
}
