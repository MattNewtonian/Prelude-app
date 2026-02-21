/**
 * Style Presets - Constraint-first compositional thinking
 * Rewritten to focus on structural rules, not vague aesthetics
 */

export const STYLE_PRESETS = {
  baroque: {
    name: 'Baroque Counterpoint',
    description: 'Two-voice thinking with clear independence',
    harmonyBudget: 'tight',
    constraints: {
      phrase: '4-bar units, one asymmetry allowed',
      texture: 'Each hand maintains distinct voice with independent rhythm. No parallel motion. One voice rests while other moves.',
      harmony: 'Functional only. Sequences on descending fifths. Cadence every 4 bars.',
      avoid: ['homophonic blocks', 'romantic chromaticism', 'pedal blur'],
      motifConstraint: 'Intervallic cell stated in opening bar, inverted or sequenced'
    }
  },

  classical: {
    name: 'Classical Clarity',
    description: 'Periodic phrasing with one disruption',
    harmonyBudget: 'tight',
    constraints: {
      phrase: '4+4 structure, truncated once at phrase 3',
      texture: 'Melody-dominated RH, LH provides harmonic rhythm (2 or 4 beats). Alberti bass only if static.',
      harmony: 'I-IV-V-I cadence plan stated explicitly. One applied dominant allowed.',
      avoid: ['constant figuration', 'continuous development', 'chromatic passing tones'],
      motifConstraint: 'Opening gesture defines all melodic material'
    }
  },

  romantic: {
    name: 'Romantic Lyricism',
    description: 'Delayed resolution with intensified dominant',
    harmonyBudget: 'normal',
    constraints: {
      phrase: '4-bar singing phrases, one extended by 2 bars via sequence',
      texture: 'RH sustains melody over moving LH. Silence in LH when melody peaks.',
      harmony: 'Functional with one deceptive cadence. Chromatic approach to dominant only.',
      avoid: ['constant texture', 'even phrase lengths', 'surface chromaticism'],
      motifConstraint: 'Lyrical arc (rise-fall) stated then elongated'
    }
  },

  impressionist: {
    name: 'Impressionist Color',
    description: 'Arpeggiated harmony with floating melody',
    harmonyBudget: 'rich',
    constraints: {
      phrase: 'Avoid regular 4-bar units. Phrases breathe and overlap — no clean phrase endings.',
      texture: 'LEFT HAND: continuous arpeggiated broken chords spanning at least 2 octaves — never stops moving. RIGHT HAND: long singing melodic lines with quarter and half notes floating above the LH. The two hands must never both rest simultaneously.',
      harmony: 'Rich extended chords throughout: major 7th, add9, sus2, parallel chord motion. Avoid plain triads. Use whole-tone or pentatonic color in at least one passage.',
      avoid: ['staccato', 'sharp accents', 'both hands resting simultaneously', 'plain triads', 'scalar runs without harmonic color'],
      motifConstraint: 'A short melodic cell in the RH, developed through register shifts and harmonic recoloring — never literally repeated'
    }
  },

  'jazz-tinged': {
    name: 'Jazz-tinged',
    description: 'Syncopation with delayed bass',
    harmonyBudget: 'normal',
    constraints: {
      phrase: '4-bar units with syncopated anacrusis. Last phrase truncated by 1 bar.',
      texture: 'RH anticipates beat, LH lands on beat. Walking bass or stride. Silence on beat 3.',
      harmony: 'ii-V-I with extensions (9th, 11th). One tritone substitution.',
      avoid: ['straight rhythms', 'parallel 3rds', 'classical voice leading'],
      motifConstraint: 'Rhythmic cell with off-beat accent, used obsessively'
    }
  },

  minimal: {
    name: 'Minimal / Ambient',
    description: 'Repetition with subtraction',
    harmonyBudget: 'tight',
    constraints: {
      phrase: 'No dramatic phrases. One hand sustains a repeating ostinato cell; the other moves slowly above or below it.',
      texture: 'One hand repeats a rhythmic ostinato (3-5 distinct pitches). The other hand adds sparse melodic notes — at least one new pitch every 4 bars. Both hands together must use at least 5 distinct pitch classes.',
      harmony: 'Mostly static, but allow slow harmonic drift — one chord change every 6-8 bars minimum. No sudden modulations.',
      avoid: ['dramatic climax', 'rapid harmonic rhythm', 'dense textures', 'scalar runs'],
      motifConstraint: 'Small cell (3-5 notes) repeated, but register and voicing shift gradually across the piece'
    }
  },

  cinematic: {
    name: 'Modern Cinematic',
    description: 'Build-release with octave doubling',
    harmonyBudget: 'rich',
    constraints: {
      phrase: 'Start with 2-bar units, expand to 4-bar by end. One extra bar before climax.',
      texture: 'Sparse opening (single notes), build to octave doubling at climax, return to sparse.',
      harmony: 'Modal. Use bVII or bVI for color. Authentic cadence only at end.',
      avoid: ['constant density', 'even dynamics throughout', 'functional harmony'],
      motifConstraint: 'Ascending perfect interval (4th or 5th) drives structure'
    }
  }
};

/**
 * Composer inspirations - thinking habits, not sound-alikes
 * Rewritten to describe compositional decisions, not timbral characteristics
 */
export const COMPOSER_INSPIRATIONS = {
  bach: {
    name: 'J.S. Bach',
    hint: 'Each voice must justify its existence independently. If one hand stops, the other should complete a thought. Avoid homophony.'
  },
  mozart: {
    name: 'W.A. Mozart',
    hint: 'Phrase in multiples of 2, disrupt once near the end. Never write a 5-bar phrase unless intentionally asymmetrical. Clarity over variety.'
  },
  chopin: {
    name: 'Frédéric Chopin',
    hint: 'Delay the expected resolution by one bar. The melody should resist its cadence. Use silence to intensify the next phrase.'
  },
  debussy: {
    name: 'Claude Debussy',
    hint: 'Left hand: continuous arpeggiated broken chords spanning 2+ octaves — never stops moving, never rests. Right hand: long, singing melodic lines (quarter and half notes) floating above the arpeggios. No scalar runs, no staccato, no fragmented 16th-note snippets. Choose a sonority (parallel chords, whole-tone, pentatonic) and let it drift through color rather than function. Both hands must never both rest simultaneously.'
  },
  gershwin: {
    name: 'George Gershwin',
    hint: 'Melody arrives early, bass arrives late. Use syncopation as structure, not decoration. One blue note is enough.'
  },
  glass: {
    name: 'Philip Glass',
    hint: 'Repeat a cell until it becomes hypnotic. Add one note, subtract another. Avoid developmental logic entirely.'
  },
  zimmer: {
    name: 'Hans Zimmer',
    hint: 'Start with a single repeated note. Double it, then triple it. Build to octave unison, then return to silence. One trajectory only.'
  }
};

/**
 * Get style preset by key
 */
export function getStylePreset(styleKey) {
  return STYLE_PRESETS[styleKey] || null;
}

/**
 * Get composer inspiration by key
 */
export function getComposerInspiration(composerKey) {
  if (!composerKey) return null;
  return COMPOSER_INSPIRATIONS[composerKey.toLowerCase()] || null;
}

/**
 * Get list of available styles for UI
 */
export function getAvailableStyles() {
  return Object.keys(STYLE_PRESETS).map(key => ({
    value: key,
    label: STYLE_PRESETS[key].name
  }));
}

/**
 * Get list of available composers for UI
 */
export function getAvailableComposers() {
  return Object.keys(COMPOSER_INSPIRATIONS).map(key => ({
    value: key,
    label: COMPOSER_INSPIRATIONS[key].name
  }));
}
