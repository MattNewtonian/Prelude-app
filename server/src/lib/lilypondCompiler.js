/**
 * LilyPond compilation helper
 * Runs lilypond binary via child_process to generate PDF and MIDI
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Compile a LilyPond file to PDF and MIDI
 * @param {string} lyFilePath - Absolute path to .ly file
 * @param {string} outputDir - Directory to write outputs
 * @returns {Promise<{pdf: string, midi: string}>} - Paths to generated files
 */
export async function compileLilyPond(lyFilePath, outputDir) {
  // Get basename without extension
  const basename = path.basename(lyFilePath, '.ly');
  const outputBasename = path.join(outputDir, basename);

  try {
    // Run lilypond with output directory
    // -o flag specifies output basename (without extension)
    const command = `lilypond -o "${outputBasename}" "${lyFilePath}"`;

    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    // Log output for debugging
    if (stdout) {
      console.log('[LilyPond stdout]:', stdout);
    }
    if (stderr) {
      console.log('[LilyPond stderr]:', stderr);
    }

    // Detect barcheck warnings — LilyPond exits 0 but the bar has wrong beat count.
    // Collect all occurrences so the repair prompt can name the exact bars.
    const allOutput = (stdout || '') + (stderr || '');
    const barcheckWarnings = [];
    const barcheckRe = /([^\n]+):(\d+):\d+: warning: barcheck failed at: (\S+)/g;
    let bcMatch;
    while ((bcMatch = barcheckRe.exec(allOutput)) !== null) {
      barcheckWarnings.push({
        line: parseInt(bcMatch[2], 10),
        position: bcMatch[3],   // e.g. "1/8" means 1 eighth note off
        raw: bcMatch[0]
      });
    }

    // Check if output files were created
    const pdfPath = `${outputBasename}.pdf`;
    const midiPath = `${outputBasename}.midi`;

    // Verify PDF exists
    try {
      await fs.access(pdfPath);
    } catch (err) {
      throw new Error(`PDF file not generated at ${pdfPath}`);
    }

    // MIDI might not exist (optional), so we'll check but not fail
    let midiExists = false;
    try {
      await fs.access(midiPath);
      midiExists = true;
    } catch (err) {
      console.log('[LilyPond] MIDI file not generated (this is optional)');
    }

    return {
      pdf: pdfPath,
      midi: midiExists ? midiPath : null,
      barcheckWarnings
    };

  } catch (error) {
    // Capture detailed error information
    const errorMessage = [
      'LilyPond compilation failed:',
      error.message,
      error.stdout ? `\nStdout: ${error.stdout}` : '',
      error.stderr ? `\nStderr: ${error.stderr}` : ''
    ].filter(Boolean).join('\n');

    throw new Error(errorMessage);
  }
}

/**
 * Write LilyPond content to file
 */
export async function writeLilyPondFile(content, filePath) {
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}
