/**
 * Health Check API for Vercel & Monitoring Services
 * Endpoint: /api/health.js (or /api/health)
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const memory = process.memoryUsage ? process.memoryUsage() : {};
  const hasLtaKey = Boolean(
    process.env.LTA_API_KEY ||
    process.env.LTA_DATAMALL_KEY ||
    process.env.LTA_DATAMALL_API_KEY ||
    process.env.DATAMALL_API_KEY ||
    process.env.API_KEY
  );

  const healthData = {
    status: 'ok',
    service: 'sbs-bus-arrival-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'production',
    region: process.env.VERCEL_REGION || 'local',
    checks: {
      api: {
        status: 'healthy',
        message: 'API server is responsive',
      },
      ltaDatamallIntegration: {
        status: hasLtaKey ? 'configured' : 'missing_api_key',
        message: hasLtaKey
          ? 'LTA DataMall API Key is configured'
          : 'LTA_API_KEY environment variable is not set (mock fallback active)',
      },
    },
    system: {
      nodeVersion: process.version,
      memoryHeapUsedMB: memory.heapUsed
        ? Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100
        : undefined,
    },
  };

  res.status(200).json(healthData);
}
