/**
 * Human-Likeness Metrics (Display Only)
 * Lightweight analysis of generated music for composer-like characteristics
 * NEVER fails a job - only provides feedback
 */

/**
 * Analyze LilyPond code for human-like compositional traits
 * @param {string} lilypondCode - The generated LilyPond code
 * @param {object} plan - The composer plan
 * @returns {object} Metrics object with humanScore and notes
 */
export function analyzeHumanLikeness(lilypondCode, plan) {
  const metrics = {
    humanScore: 0,
    notes: [],
    details: {}
  };

  // 1. Motif Recurrence Proxy
  // Look for repeated rhythmic or pitch patterns
  const motifScore = analyzeMotifRecurrence(lilypondCode, plan);
  metrics.details.motifRecurrence = motifScore.score;
  metrics.notes.push(motifScore.note);

  // 2. Rhythmic Variety Cap
  // Count distinct rhythmic values - too many = inhuman
  const rhythmScore = analyzeRhythmicVariety(lilypondCode);
  metrics.details.rhythmicVariety = rhythmScore.score;
  metrics.notes.push(rhythmScore.note);

  // 3. Symmetry Penalty
  // Detect overly symmetrical structures
  const symmetryScore = analyzeSymmetry(lilypondCode);
  metrics.details.symmetry = symmetryScore.score;
  metrics.notes.push(symmetryScore.note);

  // 4. Silence Presence
  // Human composers use rests intentionally
  const silenceScore = analyzeSilence(lilypondCode);
  metrics.details.silence = silenceScore.score;
  metrics.notes.push(silenceScore.note);

  // Calculate overall human score (0-100)
  metrics.humanScore = Math.round(
    (motifScore.score + rhythmScore.score + symmetryScore.score + silenceScore.score) / 4
  );

  // Add overall assessment
  if (metrics.humanScore >= 75) {
    metrics.notes.unshift('✓ Strong compositional coherence');
  } else if (metrics.humanScore >= 50) {
    metrics.notes.unshift('⚠ Moderate coherence - could be more focused');
  } else {
    metrics.notes.unshift('✗ Weak coherence - too much variety or randomness');
  }

  return metrics;
}

/**
 * Analyze motif recurrence - humans repeat material
 */
function analyzeMotifRecurrence(code, plan) {
  // Simple heuristic: look for repeated pitch patterns
  // Count occurrences of 3-4 note sequences

  const notes = extractNotes(code);
  if (notes.length < 10) {
    return { score: 50, note: 'Too short to analyze motif recurrence' };
  }

  // Look for 3-note patterns
  const patterns = new Map();
  for (let i = 0; i < notes.length - 2; i++) {
    const pattern = notes.slice(i, i + 3).join('-');
    patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
  }

  // Find most common pattern
  let maxRecurrence = 0;
  for (const count of patterns.values()) {
    if (count > maxRecurrence) maxRecurrence = count;
  }

  // Score based on recurrence (3+ is good)
  let score;
  let note;
  if (maxRecurrence >= 5) {
    score = 100;
    note = `✓ Strong motif recurrence (pattern appears ${maxRecurrence} times)`;
  } else if (maxRecurrence >= 3) {
    score = 75;
    note = `✓ Moderate motif recurrence (pattern appears ${maxRecurrence} times)`;
  } else {
    score = 40;
    note = `⚠ Weak motif recurrence (max ${maxRecurrence} repetitions)`;
  }

  return { score, note };
}

/**
 * Analyze rhythmic variety - humans limit their palette
 */
function analyzeRhythmicVariety(code) {
  const durations = extractDurations(code);

  if (durations.length === 0) {
    return { score: 50, note: 'No rhythmic data found' };
  }

  const uniqueDurations = new Set(durations);
  const varietyCount = uniqueDurations.size;

  // Ideal: 2-4 distinct durations
  // Too many = inhuman variety
  let score;
  let note;

  if (varietyCount <= 4) {
    score = 100;
    note = `✓ Limited rhythmic palette (${varietyCount} distinct values)`;
  } else if (varietyCount <= 6) {
    score = 70;
    note = `⚠ Moderate rhythmic variety (${varietyCount} distinct values)`;
  } else {
    score = 30;
    note = `✗ Excessive rhythmic variety (${varietyCount} distinct values) - too chaotic`;
  }

  return { score, note };
}

/**
 * Analyze symmetry - humans disrupt perfect symmetry
 */
function analyzeSymmetry(code) {
  // Look for phrase structure
  // Count bar lines to detect section lengths
  const barCount = (code.match(/\|/g) || []).length;

  if (barCount < 8) {
    return { score: 50, note: 'Too short to analyze symmetry' };
  }

  // Simple heuristic: check if total bars is a power of 2
  const isPowerOfTwo = (barCount & (barCount - 1)) === 0;

  let score;
  let note;

  if (!isPowerOfTwo) {
    score = 90;
    note = `✓ Asymmetrical structure (${barCount} bars) - human-like`;
  } else if (barCount === 16 || barCount === 32) {
    score = 60;
    note = `⚠ Symmetrical structure (${barCount} bars) - acceptable but predictable`;
  } else {
    score = 40;
    note = `⚠ Perfectly symmetrical (${barCount} bars) - consider disruption`;
  }

  return { score, note };
}

/**
 * Analyze silence/rests - humans use silence intentionally
 */
function analyzeSilence(code) {
  // Count rest symbols
  const rests = (code.match(/r\d+/g) || []).length;
  const totalEvents = (code.match(/[a-g]['",]?\d+/gi) || []).length + rests;

  if (totalEvents === 0) {
    return { score: 50, note: 'No rhythmic events found' };
  }

  const silenceRatio = rests / totalEvents;

  let score;
  let note;

  if (silenceRatio >= 0.15) {
    score = 100;
    note = `✓ Intentional use of silence (${Math.round(silenceRatio * 100)}% rests)`;
  } else if (silenceRatio >= 0.05) {
    score = 70;
    note = `⚠ Some silence (${Math.round(silenceRatio * 100)}% rests) - could use more`;
  } else {
    score = 40;
    note = `✗ Insufficient silence (${Math.round(silenceRatio * 100)}% rests) - too dense`;
  }

  return { score, note };
}

/**
 * Extract note pitches from LilyPond code
 */
function extractNotes(code) {
  // Match note names (c, d, e, f, g, a, b) with optional accidentals and octave markers
  const noteRegex = /[a-g][is|es|isis|eses]*['",]*/gi;
  const matches = code.match(noteRegex) || [];

  // Normalize to just pitch class
  return matches.map(n => n.replace(/['",]/g, '').toLowerCase());
}

/**
 * Extract rhythmic durations from LilyPond code
 */
function extractDurations(code) {
  // Match numbers following notes or rests (duration values)
  const durationRegex = /[a-gr]['",]*(\d+)/gi;
  const matches = [...code.matchAll(durationRegex)];

  return matches.map(m => m[1]);
}
