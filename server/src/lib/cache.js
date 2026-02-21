/**
 * Output and Plan Caching System
 * Avoid duplicate Claude API calls by caching results
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, '../../outputs/cache');
const MANIFEST_PATH = path.join(CACHE_DIR, 'manifest.json');

// In-memory cache
let cacheManifest = {};

/**
 * Initialize cache system
 */
export async function initializeCache() {
  try {
    // Create cache directory if it doesn't exist
    await fs.mkdir(CACHE_DIR, { recursive: true });

    // Load existing manifest if present
    try {
      const manifestData = await fs.readFile(MANIFEST_PATH, 'utf-8');
      cacheManifest = JSON.parse(manifestData);
      console.log(`[cache] Loaded ${Object.keys(cacheManifest).length} cached entries`);
    } catch (error) {
      // Manifest doesn't exist yet, start fresh
      cacheManifest = {};
      console.log('[cache] Starting with empty cache');
    }
  } catch (error) {
    console.warn('[cache] Failed to initialize cache:', error.message);
  }
}

/**
 * Generate cache key from request parameters
 */
export function generateCacheKey(params) {
  const {
    key,
    bars,
    difficulty,
    prompt = '',
    style = '',
    inspiredBy = '',
    intent = '',
    motifMode = false,
    harmonyBudget = '',
    surpriseType = '',
    negativeConstraints = ''
  } = params;

  // Normalize and create deterministic string
  const normalizedParams = {
    key: key.trim(),
    bars: parseInt(bars),
    difficulty: difficulty.trim().toLowerCase(),
    prompt: (prompt || '').trim().toLowerCase().replace(/\s+/g, ' '),
    style: (style || '').trim().toLowerCase(),
    inspiredBy: (inspiredBy || '').trim().toLowerCase(),
    intent: (intent || '').trim().toLowerCase().replace(/\s+/g, ' '),
    motifMode: !!motifMode,
    harmonyBudget: (harmonyBudget || '').trim().toLowerCase(),
    surpriseType: (surpriseType || '').trim().toLowerCase(),
    negativeConstraints: (negativeConstraints || '').trim().toLowerCase().replace(/\s+/g, ' ')
  };

  // Create hash
  const dataString = JSON.stringify(normalizedParams);
  const hash = crypto.createHash('sha1').update(dataString).digest('hex').substring(0, 16);

  return hash;
}

/**
 * Check if cache entry exists
 */
export function getCachedResult(cacheKey) {
  const entry = cacheManifest[cacheKey];

  if (!entry) {
    return null;
  }

  console.log(`[cache] HIT for key ${cacheKey}`);
  return entry;
}

/**
 * Check if composer plan is cached
 */
export function getCachedPlan(cacheKey) {
  const planKey = `${cacheKey}:plan`;
  const entry = cacheManifest[planKey];

  if (!entry) {
    return null;
  }

  console.log(`[cache] PLAN HIT for key ${cacheKey}`);
  return entry.plan;
}

/**
 * Save result to cache
 */
export async function saveCacheEntry(cacheKey, outputs, plan = null) {
  try {
    // Save output cache entry
    cacheManifest[cacheKey] = {
      outputs,
      createdAt: new Date().toISOString(),
      cacheKey
    };

    // Save plan cache entry if provided
    if (plan) {
      const planKey = `${cacheKey}:plan`;
      cacheManifest[planKey] = {
        plan,
        createdAt: new Date().toISOString(),
        cacheKey
      };
    }

    // Write manifest to disk
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(cacheManifest, null, 2), 'utf-8');

    console.log(`[cache] Saved entry for key ${cacheKey}`);
  } catch (error) {
    console.warn('[cache] Failed to save cache entry:', error.message);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const totalEntries = Object.keys(cacheManifest).length;
  const outputEntries = Object.keys(cacheManifest).filter(k => !k.includes(':plan')).length;
  const planEntries = Object.keys(cacheManifest).filter(k => k.includes(':plan')).length;

  return {
    totalEntries,
    outputEntries,
    planEntries
  };
}
