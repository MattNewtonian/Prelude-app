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
    description: 'Static harmony with registral displacement',
    harmonyBudget: 'rich',
    constraints: {
      phrase: 'Avoid regular 4-bar units. Use 3+5 or similar asymmetry.',
      texture: 'Both hands share material in different registers. Parallel motion allowed. Long silences required.',
      harmony: 'Choose one: whole-tone scale OR pentatonic OR single extended chord. No functional progression.',
      avoid: ['clear cadences', 'melodic climax', 'rhythmic drive'],
      motifConstraint: 'Intervallic sonority (4th, 5th, or 2nd) sustained throughout'
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
      phrase: 'No phrases. Continuous repetition of 1-bar cell.',
      texture: 'One hand repeats ostinato, other adds single notes at long intervals. Maximum 2 notes per bar in non-ostinato hand.',
      harmony: 'Static. Choose I or vi and do not leave. No cadences.',
      avoid: ['development', 'climax', 'more than 3 pitches per bar'],
      motifConstraint: 'Single intervallic cell (2-3 notes) repeated without variation'
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
    hint: 'Choose a sonority (parallel 5ths, whole-tone, pentatonic) and exhaust it. Avoid functional harmony. Displacement over development.'
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
