# Prelude App

A production-ready Node.js/Express application that generates **composer-quality piano preludes** using a **two-pass AI system**. The app thinks like a composer first (structural planning), then notates second (LilyPond generation). This produces music that sounds like **real authorship**, not algorithmic novelty.

**Philosophy:** Silence, limitation, and recurrence are GOOD. The goal is musical pieces a human pianist could remember, shape, and care about.

Try it out here! [https://prelude-app-beta.netlify.app/] (https://prelude-app-beta.netlify.app/)

## Features

### Composer System
- 🧠 **Two-Pass Generation** - Composer plan (JSON) → LilyPond notation
- 🎯 **Constraint-First Thinking** - Musical authorship through intentional limitation
- 🔁 **Obsessive Motif Mode** - Strict motivic unity with required transformations
- 🎼 **Harmony Budget System** - Tight/Normal/Rich harmonic complexity control
- ⚡ **One Structural Surprise** - Single intentional disruption per piece
- 📊 **Human-Likeness Metrics** - Analysis of compositional coherence

### Audio & Output
- 🎹 **Steinway Grand Piano** - High-quality audio rendering with Steinway soundfont
- 🔊 **Audio Playback** - MP3/WAV audio with consistent tonal identity
- 📄 **PDF Sheet Music** - Professional-quality engraving via LilyPond
- 🎛️ **MIDI Export** - Clean MIDI with proper instrumentation (GM Program 0)
- 📝 **Composer Plan Export** - JSON file showing structural decisions

### Generation Features
- 🎨 **Natural-Language Prompts** - Describe musical character and intent
- 🎵 **Style Presets** - Constraint-based compositional thinking (not vibes)
- 🎼 **Composer Inspirations** - Thinking habits, not sound-alikes
- 🔧 **Automatic Repair** - Fixes notation errors without changing musical plan
- 🚀 **Async Job Processing** - Real-time progress tracking
- 💻 **Modern Web Interface** - Intuitive, responsive design with audio player

## Prerequisites

- **Node.js 18+** (for ES modules support)
- **LilyPond** (for compiling sheet music)
- **FluidSynth** (for audio rendering)
- **FFmpeg** (optional, for MP3 conversion)
- **Steinway Soundfont** (for high-quality piano audio)
- **Anthropic API Key** (for Claude AI)

### Installing LilyPond

**macOS:**
```bash
brew install lilypond
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install lilypond
```

**Windows:**
Download from [lilypond.org](https://lilypond.org/download.html)

Verify installation:
```bash
lilypond --version
```

### Installing FluidSynth

**macOS:**
```bash
brew install fluid-synth
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install fluidsynth
```

**Windows:**
Download from [FluidSynth website](https://www.fluidsynth.org/)

Verify installation:
```bash
fluidsynth --version
```

### Installing FFmpeg (Optional, for MP3)

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Setting Up Steinway Soundfont

1. **Download a high-quality Steinway soundfont** (`.sf2` file):
   - Search for "Steinway Grand Piano SF2" or "Steinway D soundfont"
   - Recommended: Salamander Grand Piano or other high-quality piano soundfonts
   - Example: [MuseScore Soundfonts](https://ftp.osuosl.org/pub/musescore/soundfont/)

2. **Place the soundfont** in a standard location:
   - macOS: `/usr/local/share/soundfonts/`
   - Linux: `/usr/share/soundfonts/`
   - Windows: `C:\soundfonts\`

3. **Update your `.env` file** with the soundfont path:
   ```env
   SOUNDFONT_PATH=/usr/local/share/soundfonts/Steinway.sf2
   ```

**Security Note:** The soundfont path must be fixed in `.env` and never user-controlled to prevent path traversal attacks.

## Installation

1. **Navigate to the project:**
```bash
cd prelude-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```env
ANTHROPIC_API_KEY=your_actual_api_key_here
```

Get your API key from [https://console.anthropic.com/](https://console.anthropic.com/)

## Usage

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

## Using the Web Interface

1. **Describe Your Prelude** - Enter a natural-language prompt (optional but recommended):
   - "restless, stormy, strong bass motion"
   - "gentle and flowing with peaceful harmonies"
   - "energetic with jazzy syncopation"

2. **Choose Style & Inspiration** (optional):
   - **Style Preset**: Select a musical style with specific constraints
   - **Inspired By**: Add aesthetic guidance from a composer

3. **Set Musical Parameters**:
   - Key signature (major/minor)
   - Number of bars (4-64)
   - Difficulty level (beginner/intermediate/advanced)

4. **Generate** - Watch real-time progress and download your files!

## Two-Pass Composer System

The app uses a revolutionary **two-pass generation architecture** that thinks like a real composer:

### Pass A: Composer Plan (Structural Thinking)

Before writing any notation, the AI creates a **structured JSON plan** that defines:

```json
{
  "motif": "intervallic or rhythmic cell",
  "form": "sectional outline with bar counts",
  "phraseLogic": ["e.g. 4+4", "disrupted once"],
  "harmonyPlan": ["roman numerals: I-IV-V-I"],
  "textureRules": ["LH role", "RH role", "silence rules"],
  "transformations": ["sequence", "register shift"],
  "surprise": "exactly one structural surprise",
  "avoid": ["explicit musical avoidances"]
}
```

**This plan is generated ONCE and never regenerated.** It represents the composer's structural decisions.

### Pass B: LilyPond Notation (Realization)

The AI then realizes the plan in LilyPond notation. If compilation fails, **only the notation is repaired** - the musical plan remains fixed.

**Key Principle:** The plan embodies musical authorship. Notation errors are syntax problems, not compositional problems.

### Why Two Passes?

**Without separation:**
- AI generates notation directly
- Repairs often change the musical idea
- Results feel improvised, not composed
- No structural coherence

**With separation:**
- Compositional decisions happen first
- Structural integrity is preserved
- Repairs only fix syntax
- Results feel intentional and memorable

### Musical Philosophy

> "You are not 'generating music'. You are writing a small piece that a human pianist could remember, shape, and care about."

**Core Principles:**
1. **Silence, limitation, and recurrence are GOOD**
2. **Intentional constraint > surface variety**
3. **Memorability > continuous novelty**
4. **One idea, thoroughly explored**

## Obsessive Motif Mode

Enable **motifMode** for strict motivic unity:

```json
{
  "motifMode": true,
  "intent": "Build everything from a single three-note cell"
}
```

**Enforced Constraints:**
- Motif MUST appear every 1-2 bars
- NO new rhythmic cells after bar 8
- Transformations are REQUIRED (not optional)
- Melody derives from motif, accompaniment reacts

**Result:** Pieces that sound like obsessive études - relentless focus on a single idea.

## Harmony Budget System

Control harmonic complexity with three levels:

### **Tight** (Diatonic Discipline)
```json
{
  "harmonyBudget": "tight"
}
```
- Diatonic harmony ONLY
- Maximum ONE borrowed chord
- NO modulation
- Forces clarity and directness

### **Normal** (Functional with Color)
```json
{
  "harmonyBudget": "normal"
}
```
- One modulation allowed
- 2-3 chromatic events total
- Functional progression required
- Balanced complexity

### **Rich** (Coloristic Freedom)
```json
{
  "harmonyBudget": "rich"
}
```
- Extended harmonies allowed
- Modal and chromatic color
- Still requires explicit cadence plan
- Chromatic enrichment serves structure

**Key Insight:** Limiting harmony forces better melodic and rhythmic invention.

## Structural Surprise (One Only)

Every piece includes **exactly one** intentional disruption:

**Options:**
- Extra bar (phrase extension)
- Deceptive cadence (harmonic surprise)
- Phrase truncation (rhythmic surprise)
- Register displacement (textural surprise)

```json
{
  "surpriseType": "phrase truncation"
}
```

**Why one only?** Multiple surprises = chaos. One surprise = intention.

## Advanced Parameters

The API accepts these optional parameters:

```json
{
  "key": "D minor",
  "bars": 24,
  "difficulty": "intermediate",

  // Natural language
  "prompt": "restless, searching, never settling",

  // Style system
  "style": "romantic",
  "inspiredBy": "chopin",

  // Composer system (advanced)
  "motifMode": true,
  "intent": "Build from a falling minor third",
  "harmonyBudget": "tight",
  "surpriseType": "deceptive cadence",
  "negativeConstraints": "Avoid: alberti bass, arpeggios, sequences longer than 2 bars"
}
```

**All advanced parameters are optional.** Defaults provide excellent results.

## Human-Likeness Metrics

After generation, the system analyzes compositional quality:

```json
{
  "humanScore": 82,
  "notes": [
    "✓ Strong compositional coherence",
    "✓ Strong motif recurrence (pattern appears 6 times)",
    "✓ Limited rhythmic palette (3 distinct values)",
    "✓ Asymmetrical structure (23 bars) - human-like",
    "✓ Intentional use of silence (18% rests)"
  ],
  "details": {
    "motifRecurrence": 100,
    "rhythmicVariety": 100,
    "symmetry": 90,
    "silence": 100
  }
}
```

**These metrics are display-only and never fail jobs.** They provide insight into compositional coherence.

## Style Presets (Constraint-First)

Style presets are **not vibes** - they are **structural rules**. Each preset includes:
- Phrase structure rules
- Texture constraints
- Harmony budget
- Explicit avoid list
- Motif constraint

### Baroque Counterpoint
**Thinking:** Two-voice independence with clear separation

```
Phrase: 4-bar units, one asymmetry allowed
Texture: Each hand maintains distinct voice. No parallel motion.
Harmony: Functional only. Sequences on descending fifths.
Avoid: homophonic blocks, romantic chromaticism, pedal blur
Budget: tight
```

### Classical Clarity
**Thinking:** Periodic phrasing with one disruption

```
Phrase: 4+4 structure, truncated once at phrase 3
Texture: Melody-dominated RH, LH provides harmonic rhythm
Harmony: I-IV-V-I cadence plan stated explicitly
Avoid: constant figuration, continuous development
Budget: tight
```

### Romantic Lyricism
**Thinking:** Delayed resolution with intensified dominant

```
Phrase: 4-bar singing phrases, one extended by 2 bars
Texture: RH sustains melody over moving LH. Silence in LH when melody peaks.
Harmony: Functional with one deceptive cadence
Avoid: constant texture, even phrase lengths
Budget: normal
```

### Impressionist Color
**Thinking:** Static harmony with registral displacement

```
Phrase: Avoid regular 4-bar units. Use 3+5 or similar asymmetry.
Texture: Both hands share material in different registers. Parallel motion allowed.
Harmony: Choose one: whole-tone OR pentatonic OR single extended chord
Avoid: clear cadences, melodic climax, rhythmic drive
Budget: rich
```

### Jazz-tinged
**Thinking:** Syncopation with delayed bass

```
Phrase: 4-bar units with syncopated anacrusis. Last phrase truncated by 1 bar.
Texture: RH anticipates beat, LH lands on beat. Walking bass or stride.
Harmony: ii-V-I with extensions (9th, 11th). One tritone substitution.
Avoid: straight rhythms, parallel 3rds, classical voice leading
Budget: normal
```

### Minimal / Ambient
**Thinking:** Repetition with subtraction

```
Phrase: No phrases. Continuous repetition of 1-bar cell.
Texture: One hand repeats ostinato, other adds single notes at long intervals.
Harmony: Static. Choose I or vi and do not leave.
Avoid: development, climax, more than 3 pitches per bar
Budget: tight
```

### Modern Cinematic
**Thinking:** Build-release with octave doubling

```
Phrase: Start with 2-bar units, expand to 4-bar by end.
Texture: Sparse opening, build to octave doubling at climax, return to sparse.
Harmony: Modal. Use bVII or bVI for color. Authentic cadence only at end.
Avoid: constant density, even dynamics throughout
Budget: rich
```

## Composer Inspirations (Thinking Habits)

Composer inspirations describe **decision-making patterns**, not sounds:

- **J.S. Bach** - Each voice must justify its existence independently. Avoid homophony.
- **W.A. Mozart** - Phrase in multiples of 2, disrupt once near the end. Clarity over variety.
- **Frédéric Chopin** - Delay the expected resolution by one bar. Use silence to intensify.
- **Claude Debussy** - Choose a sonority and exhaust it. Displacement over development.
- **George Gershwin** - Melody arrives early, bass arrives late. One blue note is enough.
- **Philip Glass** - Repeat a cell until hypnotic. Add one note, subtract another.
- **Hans Zimmer** - Start with single repeated note. Build to octave unison, then silence.

## API Endpoints

### POST `/api/generate`

Start a new music generation job.

**Request Body:**
```json
{
  "key": "D minor",
  "bars": 24,
  "difficulty": "intermediate",
  "prompt": "restless, stormy, strong bass motion",
  "style": "romantic",
  "inspiredBy": "chopin"
}
```

**Parameters:**
- `key` (required): Key signature (e.g., "C major", "A minor")
- `bars` (required): Number of bars (4-64)
- `difficulty` (required): "beginner", "intermediate", or "advanced"
- `prompt` (optional): Natural-language description (max 500 chars)
- `style` (optional): Style preset key (see GET /api/styles)
- `inspiredBy` (optional): Composer key (see GET /api/composers)

**Response:**
```json
{
  "jobId": "uuid-string"
}
```

### GET `/api/jobs/:jobId`

Get the status and results of a generation job.

**Response (Running):**
```json
{
  "jobId": "uuid-string",
  "status": "running",
  "progress": 45,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:15.000Z"
}
```

**Response (Success):**
```json
{
  "jobId": "uuid-string",
  "status": "succeeded",
  "progress": 100,
  "outputs": {
    "ly": "job-uuid.ly",
    "pdf": "job-uuid.pdf",
    "midi": "job-uuid.midi",
    "wav": "job-uuid.wav",
    "mp3": "job-uuid.mp3"
  },
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:30.000Z"
}
```

**Output Files:**
- `ly` - LilyPond source code
- `pdf` - Professional PDF sheet music
- `midi` - MIDI file with Acoustic Grand Piano (GM Program 0)
- `wav` - High-quality WAV audio rendered with Steinway soundfont
- `mp3` - Compressed MP3 audio for web playback (if FFmpeg is installed)

**Note:** Audio files (`wav`/`mp3`) may be `null` if FluidSynth is not installed or if audio rendering fails. The generation will still succeed with PDF and MIDI outputs.

**Status Values:**
- `queued` - Job is waiting to be processed
- `running` - Job is actively generating
- `succeeded` - Job completed successfully
- `failed` - Job failed with an error

### GET `/api/styles`

Get available style presets.

**Response:**
```json
{
  "styles": [
    {
      "value": "baroque",
      "label": "Baroque Counterpoint",
      "description": "Contrapuntal textures with clear voice leading"
    },
    ...
  ]
}
```

### GET `/api/composers`

Get available composer inspirations.

**Response:**
```json
{
  "composers": [
    {
      "value": "bach",
      "label": "J.S. Bach"
    },
    ...
  ]
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "apiKey": true
}
```

## Project Structure

```
prelude-app/
├── server/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── generator.js         # AI generation with repair logic
│   │   │   ├── jobManager.js        # In-memory job tracking
│   │   │   ├── lilypondCompiler.js  # LilyPond compilation
│   │   │   ├── stylePresets.js      # Style and composer configurations
│   │   │   ├── midiValidator.js     # MIDI instrumentation validation
│   │   │   └── audioRenderer.js     # FluidSynth audio rendering
│   │   └── index.js                 # Express server
│   └── outputs/                     # Generated files (.ly, .pdf, .midi, .wav, .mp3)
├── public/
│   └── index.html                   # Frontend interface with audio player
├── package.json
├── .env.example
└── README.md
```

## Architecture

### Prompt Construction

The app builds a structured system prompt by combining:

1. **Global Musical Constraints**
   - Key signature, bars, difficulty
   - Piano-only, LilyPond 2.24+
   - Syntax and notation rules

2. **Style Preset Rules** (if selected)
   - Texture guidelines
   - Harmony constraints
   - Rhythm patterns
   - Form structure
   - Notation preferences

3. **Composer Inspiration** (if selected)
   - Aesthetic hints
   - Stylistic guidance

4. **User's Natural-Language Prompt**
   - Creative direction
   - Mood and character

This structured approach ensures musical coherence while allowing creative flexibility.

### Generation Pipeline

1. **Request** - User submits parameters via web UI or API
2. **Job Creation** - Server creates job with unique ID and returns immediately
3. **Async Execution** - Job executes in background:
   - Build structured prompt from all parameters
   - Claude AI generates LilyPond code with enforced MIDI instrumentation
   - Code is compiled with LilyPond to produce PDF and MIDI
   - If compilation fails, error is sent back to Claude for repair
   - Retry up to 3 times until successful
   - **MIDI Validation**: Verify MIDI uses Acoustic Grand Piano (GM Program 0) on separate channels
   - **Audio Rendering**: Convert MIDI to high-quality audio using FluidSynth + Steinway soundfont
   - **MP3 Conversion**: Optionally compress WAV to MP3 for web playback
4. **Progress Tracking** - Client polls job status endpoint every 1 second
5. **Completion** - Files are available for download and playback from `/outputs/*`

### Steinway Grand Piano Implementation

Every generated prelude uses the **Steinway Grand Piano** sound:

**1. LilyPond Template Enforcement**

The system enforces this exact MIDI structure in all generated code:

```lilypond
\score {
  <<
    \new PianoStaff <<
      \new Staff = "RH" \with {
        midiInstrument = "acoustic grand"
        midiMinimumVolume = #0.3
        midiMaximumVolume = #0.9
      } {
        \clef treble
        % right hand music
      }

      \new Staff = "LH" \with {
        midiInstrument = "acoustic grand"
        midiMinimumVolume = #0.2
        midiMaximumVolume = #0.7
      } {
        \clef bass
        % left hand music
      }
    >>
  >>
  \layout { }
  \midi { \tempo 4 = 76 }
}
```

**Key Features:**
- Both hands use `midiInstrument = "acoustic grand"` (GM Program 0)
- Separate channels for RH and LH enable proper stereo separation
- Subtle volume differentiation (RH slightly brighter) for expressiveness
- Claude AI cannot override these settings

**2. MIDI Validation**

After LilyPond compilation, the MIDI file is validated to ensure:
- Program Change events set to 0 (Acoustic Grand Piano)
- At least 2 channels present (RH and LH)
- Proper channel separation for stereo playback

**3. Audio Rendering**

The MIDI file is rendered to audio using:
- **FluidSynth** - Professional software synthesizer
- **Steinway Soundfont** - High-quality sampled Steinway Grand Piano
- **44.1kHz Sample Rate** - CD-quality audio
- **MP3 Compression** - Optional web-optimized format

This ensures:
- ✅ Consistent tonal identity across all devices
- ✅ No browser-dependent MIDI playback variations
- ✅ Professional Steinway Grand sound
- ✅ High-quality audio suitable for listening and demonstration

### Error Repair Logic

The `generateWithRepair()` function implements automatic error correction:

1. Generate initial LilyPond code with Claude
2. Attempt compilation with LilyPond
3. If compilation fails:
   - Extract error message
   - Send error back to Claude with repair prompt and common issues checklist
   - Receive corrected code
   - Retry compilation
4. Repeat up to 3 times or until successful

This dramatically improves success rate by allowing the AI to learn from its mistakes.

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY` (required) - Your Anthropic API key
- `PORT` (optional) - Server port, defaults to 3000
- `NODE_ENV` (optional) - Environment mode (development/production)

### Customization

**Change max retry attempts:**

Edit `server/src/lib/generator.js`:
```javascript
const MAX_REPAIR_ATTEMPTS = 3; // Change this value
```

**Add new style presets:**

Edit `server/src/lib/stylePresets.js` and add to `STYLE_PRESETS` object:
```javascript
mystyle: {
  name: 'My Style',
  description: 'Description here',
  constraints: {
    texture: '...',
    harmony: '...',
    rhythm: '...',
    form: '...',
    notation: '...'
  }
}
```

**Add new composers:**

Edit `server/src/lib/stylePresets.js` and add to `COMPOSER_INSPIRATIONS` object:
```javascript
composer: {
  name: 'Composer Name',
  hint: 'Aesthetic guidance here'
}
```

## Examples

### Example 1: Stormy Romantic Prelude

```json
{
  "key": "D minor",
  "bars": 24,
  "difficulty": "advanced",
  "prompt": "restless, stormy, strong bass motion",
  "style": "romantic",
  "inspiredBy": "chopin"
}
```

### Example 2: Peaceful Impressionist Prelude

```json
{
  "key": "Eb major",
  "bars": 16,
  "difficulty": "intermediate",
  "prompt": "gentle and flowing with peaceful harmonies",
  "style": "impressionist",
  "inspiredBy": "debussy"
}
```

### Example 3: Energetic Jazz Prelude

```json
{
  "key": "F major",
  "bars": 32,
  "difficulty": "advanced",
  "prompt": "energetic with jazzy syncopation and blue notes",
  "style": "jazz-tinged",
  "inspiredBy": "gershwin"
}
```

### Example 4: Minimalist Ambient Prelude

```json
{
  "key": "C major",
  "bars": 20,
  "difficulty": "beginner",
  "prompt": "sparse, meditative, lots of space",
  "style": "minimal"
}
```

## Development

### Testing

Test the API with curl:

```bash
# Start a generation job
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "key": "C major",
    "bars": 16,
    "difficulty": "intermediate",
    "prompt": "cheerful and bright",
    "style": "classical"
  }'

# Check job status (replace JOB_ID with actual ID)
curl http://localhost:3000/api/jobs/JOB_ID

# List available styles
curl http://localhost:3000/api/styles

# List available composers
curl http://localhost:3000/api/composers
```

## Troubleshooting

### "lilypond: command not found"

LilyPond is not installed or not in PATH. Install it using instructions above.

### "API key not configured"

Make sure `.env` file exists and contains a valid `ANTHROPIC_API_KEY`.

### Jobs fail with "compilation error"

- Check that LilyPond is installed: `lilypond --version`
- Check server logs for detailed error messages
- Try increasing `MAX_REPAIR_ATTEMPTS` for more retry attempts
- The improved prompts should handle most syntax errors automatically

### Frontend shows "Failed to fetch job status"

- Ensure server is running on the expected port
- Check browser console for CORS or network errors
- Verify firewall settings

### Audio files not generated (wav/mp3 are null)

**FluidSynth not found:**
```bash
# Check if FluidSynth is installed
fluidsynth --version

# Install if missing
brew install fluid-synth  # macOS
sudo apt-get install fluidsynth  # Linux
```

**Soundfont not found:**
```bash
# Check soundfont path in .env
echo $SOUNDFONT_PATH

# Verify file exists
ls -l /usr/share/soundfonts/default.sf2
```

Download a soundfont if needed:
- [MuseScore Soundfonts](https://ftp.osuosl.org/pub/musescore/soundfont/)
- Search for "Steinway Grand Piano SF2"
- Update `SOUNDFONT_PATH` in `.env`

**MP3 not generated (WAV works):**
```bash
# Check if FFmpeg is installed
ffmpeg -version

# Install if missing
brew install ffmpeg  # macOS
sudo apt-get install ffmpeg  # Linux
```

Note: Generation will succeed without audio if FluidSynth fails. Audio is optional but highly recommended for best user experience.

### MIDI validation warnings

If you see "MIDI Validation Failed" warnings in logs:
- Check that the LilyPond template includes `midiInstrument = "acoustic grand"`
- Verify the generated `.ly` file uses the correct \score structure
- The system will auto-repair most issues, but validation helps ensure quality

These warnings are informational and won't prevent generation from succeeding.

## Security

### Critical Security Measures

**1. No Arbitrary LilyPond Includes**
- User-supplied LilyPond code is **not allowed**
- The system generates code via Claude AI only
- No `\include` directives permitted from user input
- All LilyPond code is AI-generated with validated templates

**2. Soundfont Path Security**
- Soundfont path is **fixed** in `.env` and never user-controlled
- Prevents path traversal attacks (`../../etc/passwd`)
- Must be set by system administrator only
- Example: `SOUNDFONT_PATH=/usr/local/share/soundfonts/Steinway.sf2`

**3. Command Execution Safety**
- All file paths are validated and sanitized
- Commands use absolute paths, not user input
- Timeouts prevent resource exhaustion (30-60 seconds)
- stdout/stderr captured and limited to 10MB

**4. Sandboxing Recommendations (Production)**

For production deployments, run LilyPond and FluidSynth in sandboxed environments:

**Docker Container:**
```dockerfile
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache \
    lilypond \
    fluidsynth \
    ffmpeg

# Run as non-root user
RUN adduser -D appuser
USER appuser

# Limit resources
WORKDIR /app
CMD ["node", "server/src/index.js"]
```

**Docker Compose with Resource Limits:**
```yaml
version: '3.8'
services:
  prelude-app:
    build: .
    mem_limit: 2g
    cpus: 2
    security_opt:
      - no-new-privileges:true
    read_only: true
    volumes:
      - ./outputs:/app/server/outputs
```

**5. Rate Limiting**

Add express-rate-limit to prevent abuse:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});

app.use('/api/generate', limiter);
```

**6. Input Validation**

All inputs are validated:
- Key: whitelist of valid keys
- Bars: integer between 4-64
- Difficulty: enum (beginner/intermediate/advanced)
- Prompt: max 500 characters, sanitized
- Style: enum from STYLE_PRESETS
- Composer: enum from COMPOSER_INSPIRATIONS

**7. File Cleanup**

Implement automatic cleanup of old output files:
```javascript
// Clean up files older than 24 hours
async function cleanupOldFiles() {
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  // ... cleanup logic
}
```

## Production Deployment

### Recommendations

1. **Add database persistence** - Replace in-memory job storage with PostgreSQL/MongoDB
2. **Add authentication** - Protect API endpoints with API keys or OAuth
3. **Add rate limiting** - Prevent abuse with express-rate-limit
4. **Add job queue** - Use Bull/BullMQ for robust job processing
5. **Add monitoring** - Integrate logging and error tracking (Sentry, Datadog)
6. **Scale horizontally** - Use Redis for shared job state across instances
7. **Add cleanup** - Periodically delete old output files
8. **Add caching** - Cache style/composer lookups

### Environment Setup

For production, set:
```env
NODE_ENV=production
PORT=3000
```

Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server/src/index.js --name prelude-app
```

## Non-Goals

The following features are explicitly **not** included:

- ❌ User-supplied LilyPond code
- ❌ Real-time audio playback
- ❌ Direct composer impersonation (only aesthetic inspiration)
- ❌ Database persistence (in-memory for now)
- ❌ User accounts or authentication

## License

MIT

## Credits

Built with:
- [Express](https://expressjs.com/) - Web framework
- [Anthropic Claude](https://anthropic.com/) - AI music generation
- [LilyPond](https://lilypond.org/) - Sheet music engraving
- [UUID](https://github.com/uuidjs/uuid) - Unique IDs

---

**Note:** This app integrates the `generateWithRepair()` algorithm from the prelude-worker pipeline for robust AI-driven music generation. Natural-language prompts and style presets enable creative, expressive compositions without requiring musical notation knowledge.
