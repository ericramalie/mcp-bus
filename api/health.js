/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default async function handler(req, res) {
  const ltaKeyConfigured = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim() !== '');

  const healthData = {
    status: 'ok',
    service: 'SBS Transit / LTA Gateway API',
    uptime: typeof process.uptime === 'function' ? Math.floor(process.uptime()) : 0,
    timestamp: new Date().toISOString(),
    ltaKeyConfigured,
    environment: process.env.NODE_ENV || 'production',
    endpoints: {
      health: '/api/health',
      busArrival: '/api/bus-arrival?BusStopCode=04121',
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (typeof res.status === 'function') {
    return res.status(200).json(healthData);
  } else {
    res.statusCode = 200;
    res.end(JSON.stringify(healthData, null, 2));
  }
}
