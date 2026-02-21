/**
 * Prelude App - LilyPond Generation API Server
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import {
  createJob,
  getJob,
  updateJobStatus,
  updateJobProgress,
  failJob,
  succeedJob,
  JobStatus
} from './lib/jobManager.js';
import { generateWithRepair } from './lib/generator.js';
import { getAvailableStyles, getAvailableComposers, STYLE_PRESETS } from './lib/stylePresets.js';
import { initializeCache } from './lib/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize cache on startup
await initializeCache();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../../public')));

// Serve generated outputs
app.use('/outputs', express.static(path.join(__dirname, '../outputs')));

// Validation middleware
function validateGenerateRequest(req, res, next) {
  const { key, bars, difficulty, prompt, style, inspiredBy, refine } = req.body;

  // Validate key
  const validKeys = [
    'C major', 'G major', 'D major', 'A major', 'E major', 'B major', 'F major',
    'Bb major', 'Eb major', 'Ab major', 'Db major', 'Gb major',
    'A minor', 'E minor', 'B minor', 'F# minor', 'C# minor', 'G# minor',
    'D minor', 'G minor', 'C minor', 'F minor', 'Bb minor', 'Eb minor'
  ];

  if (!key || !validKeys.includes(key)) {
    return res.status(400).json({
      error: 'Invalid key. Must be one of: ' + validKeys.join(', ')
    });
  }

  // Validate bars
  const barsNum = parseInt(bars);
  if (!bars || isNaN(barsNum) || barsNum < 4 || barsNum > 64) {
    return res.status(400).json({
      error: 'Invalid bars. Must be a number between 4 and 64'
    });
  }

  // Validate difficulty
  const validDifficulties = ['beginner', 'intermediate', 'advanced'];
  if (!difficulty || !validDifficulties.includes(difficulty)) {
    return res.status(400).json({
      error: 'Invalid difficulty. Must be one of: ' + validDifficulties.join(', ')
    });
  }

  // Validate style (optional)
  if (style && !STYLE_PRESETS[style]) {
    return res.status(400).json({
      error: 'Invalid style. Use GET /api/styles to see available styles.'
    });
  }

  // Validate prompt (optional, but should be reasonable length)
  if (prompt && typeof prompt === 'string' && prompt.length > 500) {
    return res.status(400).json({
      error: 'Prompt too long. Maximum 500 characters.'
    });
  }

  // Validate inspiredBy (optional)
  const validComposers = ['bach', 'mozart', 'chopin', 'debussy', 'gershwin', 'glass', 'zimmer'];
  if (inspiredBy && !validComposers.includes(inspiredBy.toLowerCase())) {
    return res.status(400).json({
      error: 'Invalid composer. Use GET /api/composers to see available options.'
    });
  }

  // Validate refine (optional boolean)
  if (refine !== undefined && typeof refine !== 'boolean') {
    return res.status(400).json({
      error: 'Invalid refine parameter. Must be true or false.'
    });
  }

  // Normalize params
  req.body.bars = barsNum;
  if (inspiredBy) {
    req.body.inspiredBy = inspiredBy.toLowerCase();
  }

  next();
}

/**
 * POST /api/generate
 * Start a new generation job
 */
app.post('/api/generate', validateGenerateRequest, async (req, res) => {
  const { key, bars, difficulty, prompt, style, inspiredBy } = req.body;

  // Create job with all params
  const jobId = uuidv4();
  const jobParams = { key, bars, difficulty, prompt, style, inspiredBy };
  const job = createJob(jobId, jobParams);

  // Start async job execution
  executeJob(jobId, { ...jobParams, jobId });

  // Return job ID immediately
  res.json({ jobId });
});

/**
 * GET /api/jobs/:jobId
 * Get job status and results
 */
app.get('/api/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;

  const job = getJob(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Return job info
  const response = {
    jobId: job.jobId,
    status: job.status,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  };

  // Add optional fields if present
  if (job.progress !== null) {
    response.progress = job.progress;
  }

  if (job.error) {
    response.error = job.error;
  }

  if (job.outputs) {
    response.outputs = job.outputs;
  }

  if (job.metrics) {
    response.metrics = job.metrics;
  }

  res.json(response);
});

/**
 * Execute a generation job asynchronously
 */
async function executeJob(jobId, params) {
  try {
    // Mark as running
    updateJobStatus(jobId, JobStatus.RUNNING, { progress: 0 });

    // Run generation with repair logic
    const result = await generateWithRepair(params, (progressUpdate) => {
      // Update job progress
      updateJobProgress(jobId, progressUpdate.progress);
      console.log(`[Job ${jobId}] ${progressUpdate.message} (${progressUpdate.progress}%)`);
    });

    // Mark as succeeded with metrics
    succeedJob(jobId, result.outputs, result.metrics);
    console.log(`[Job ${jobId}] Completed successfully in ${result.attempts} attempt(s)`);

  } catch (error) {
    // Mark as failed
    failJob(jobId, error);
    console.error(`[Job ${jobId}] Failed:`, error.message);
  }
}

/**
 * GET /api/styles
 * Get available style presets
 */
app.get('/api/styles', (req, res) => {
  const styles = getAvailableStyles().map(s => ({
    value: s.value,
    label: s.label,
    description: STYLE_PRESETS[s.value].description
  }));
  res.json({ styles });
});

/**
 * GET /api/composers
 * Get available composer inspirations
 */
app.get('/api/composers', (req, res) => {
  const composers = getAvailableComposers();
  res.json({ composers });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKey: !!process.env.ANTHROPIC_API_KEY
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Prelude App server listening on http://localhost:${PORT}`);
  console.log(`   API Key configured: ${!!process.env.ANTHROPIC_API_KEY}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
