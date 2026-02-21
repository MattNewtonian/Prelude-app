/**
 * In-memory job tracking system
 * Stores job metadata: status, progress, timestamps, params, outputs, errors
 */

const jobs = new Map();

export const JobStatus = {
  QUEUED: 'queued',
  RUNNING: 'running',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
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
 * Get job by ID
 */
export function getJob(jobId) {
  return jobs.get(jobId);
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

  // Merge additional updates
  Object.assign(job, updates);

  jobs.set(jobId, job);
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
