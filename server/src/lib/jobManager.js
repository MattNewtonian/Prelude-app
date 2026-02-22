/**
 * Job tracking system — in-memory with disk persistence for terminal states.
 * Succeeded/failed jobs are written to disk so polls survive server restarts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory store for all jobs
const jobs = new Map();

// Disk persistence directory (same as outputs dir)
const OUTPUTS_DIR = path.resolve(__dirname, '../../outputs');

function stateFilePath(jobId) {
  return path.join(OUTPUTS_DIR, `${jobId}.state.json`);
}

function persistJobState(job) {
  try {
    // Only persist terminal states — no point writing every progress tick
    if (job.status !== 'succeeded' && job.status !== 'failed') return;
    const payload = {
      jobId:     job.jobId,
      status:    job.status,
      outputs:   job.outputs  || null,
      metrics:   job.metrics  || null,
      error:     job.error    || null,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      progress:  job.progress
    };
    fs.writeFileSync(stateFilePath(job.jobId), JSON.stringify(payload), 'utf-8');
  } catch (err) {
    // Non-fatal — polling will fall back to the error path
    console.warn(`[JobManager] Could not persist job state for ${job.jobId}:`, err.message);
  }
}

function loadJobFromDisk(jobId) {
  try {
    const raw = fs.readFileSync(stateFilePath(jobId), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const JobStatus = {
  QUEUED:    'queued',
  RUNNING:   'running',
  SUCCEEDED: 'succeeded',
  FAILED:    'failed'
};

/**
 * Create a new job
 */
export function createJob(jobId, params) {
  const job = {
    jobId,
    status: JobStatus.QUEUED,
    params,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: null,
    error: null,
    outputs: null,
    metrics: null
  };

  jobs.set(jobId, job);
  return job;
}

/**
 * Get job by ID — checks memory first, then disk (for post-restart recovery).
 */
export function getJob(jobId) {
  const inMemory = jobs.get(jobId);
  if (inMemory) return inMemory;

  // Fall back to disk for terminal states that survived a restart
  const fromDisk = loadJobFromDisk(jobId);
  if (fromDisk) {
    // Re-hydrate into memory so subsequent polls are fast
    jobs.set(jobId, fromDisk);
    console.log(`[JobManager] Recovered job ${jobId} from disk (status: ${fromDisk.status})`);
  }
  return fromDisk || null;
}

/**
 * Update job status
 */
export function updateJobStatus(jobId, status, updates = {}) {
  const job = jobs.get(jobId);
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  job.status = status;
  job.updatedAt = new Date().toISOString();

  Object.assign(job, updates);
  jobs.set(jobId, job);

  persistJobState(job); // no-op for non-terminal states
  return job;
}

/**
 * Update job progress
 */
export function updateJobProgress(jobId, progress) {
  const job = jobs.get(jobId);
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  job.progress = progress;
  job.updatedAt = new Date().toISOString();

  jobs.set(jobId, job);
  return job;
}

/**
 * Mark job as failed
 */
export function failJob(jobId, error) {
  return updateJobStatus(jobId, JobStatus.FAILED, {
    error: error instanceof Error ? error.message : String(error)
  });
}

/**
 * Mark job as succeeded
 */
export function succeedJob(jobId, outputs, metrics = null) {
  return updateJobStatus(jobId, JobStatus.SUCCEEDED, {
    outputs,
    progress: 100,
    metrics
  });
}

/**
 * Get all jobs (for debugging)
 */
export function getAllJobs() {
  return Array.from(jobs.values());
}
