/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to convert LTA load code to readable standard
function mapCrowdLoad(loadCode) {
  switch (loadCode) {
    case 'SEA':
      return 'seats-available';
    case 'SDA':
      return 'standing-available';
    case 'LSD':
      return 'limited-standing';
    default:
      return 'seats-available';
  }
}

// Helper to format arrival minutes/seconds
function formatArrivalTiming(estimatedArrivalStr) {
  if (!estimatedArrivalStr) {
    return { arrivalTime: 'No Est', secondsLeft: 9999 };
  }
  const targetTime = new Date(estimatedArrivalStr).getTime();
  const now = Date.now();
  const diffSecs = Math.round((targetTime - now) / 1000);

  if (isNaN(targetTime)) {
    return { arrivalTime: 'N/A', secondsLeft: 9999 };
  }

  if (diffSecs <= 45) {
    return { arrivalTime: 'Arr', secondsLeft: Math.max(0, diffSecs) };
  }
  const mins = Math.ceil(diffSecs / 60);
  return { arrivalTime: `${mins} mins`, secondsLeft: diffSecs };
}

function parseBusItem(rawBus) {
  if (!rawBus || !rawBus.EstimatedArrival) {
    return null;
  }
  const timing = formatArrivalTiming(rawBus.EstimatedArrival);
  return {
    estimatedArrival: rawBus.EstimatedArrival,
    arrivalTime: timing.arrivalTime,
    secondsLeft: timing.secondsLeft,
    crowding: mapCrowdLoad(rawBus.Load),
    type: rawBus.Type || 'SD',
    wheelchairAccessible: rawBus.Feature === 'WAB',
    originCode: rawBus.OriginCode || '',
    destinationCode: rawBus.DestinationCode || '',
    latitude: rawBus.Latitude || '',
    longitude: rawBus.Longitude || '',
    visitNumber: rawBus.VisitNumber || '1',
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Extract parameters from query
  // Supports both req.query (Express/Vercel) and URL parsing fallback
  const urlObj = req.url ? new URL(req.url, 'http://localhost') : null;
  const busStopCode = (req.query?.BusStopCode || req.query?.busStopCode || urlObj?.searchParams.get('BusStopCode') || urlObj?.searchParams.get('busStopCode') || '').trim();
  const serviceNo = (req.query?.ServiceNo || req.query?.serviceNo || urlObj?.searchParams.get('ServiceNo') || urlObj?.searchParams.get('serviceNo') || '').trim();

  if (!busStopCode) {
    res.statusCode = 400;
    const errorBody = {
      error: 'Missing required parameter: BusStopCode',
      usage: '/api/bus-arrival?BusStopCode=04121&ServiceNo=7',
      documentation: 'BusStopCode is required. ServiceNo is optional.',
    };
    if (typeof res.status === 'function') return res.status(400).json(errorBody);
    return res.end(JSON.stringify(errorBody));
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY ? process.env.LTA_ACCOUNT_KEY.trim() : '';

  if (!accountKey) {
    // If user hasn't added the LTA_ACCOUNT_KEY in Vercel env yet
    const responseData = {
      status: 'key_missing',
      message: 'LTA_ACCOUNT_KEY environment variable is not set. Configure LTA_ACCOUNT_KEY in Vercel project environment settings.',
      BusStopCode: busStopCode,
      requestedService: serviceNo || 'ALL',
      timestamp: new Date().toISOString(),
      raw: null,
      services: [],
    };
    if (typeof res.status === 'function') return res.status(200).json(responseData);
    return res.end(JSON.stringify(responseData));
  }

  try {
    let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      const errData = {
        status: 'lta_error',
        statusCode: response.status,
        message: `LTA DataMall API returned status ${response.status}: ${response.statusText}`,
        details: errText,
        BusStopCode: busStopCode,
      };
      if (typeof res.status === 'function') return res.status(response.status).json(errData);
      res.statusCode = response.status;
      return res.end(JSON.stringify(errData));
    }

    const ltaData = await response.json();
    const rawServices = ltaData.Services || [];

    // Transform services to clean structured format
    const formattedServices = rawServices.map((svc) => {
      const b1 = parseBusItem(svc.NextBus);
      const b2 = parseBusItem(svc.NextBus2);
      const b3 = parseBusItem(svc.NextBus3);

      const nextBuses = [
        b1 || { arrivalTime: 'No Info', secondsLeft: 9999, crowding: 'seats-available', type: 'SD', wheelchairAccessible: false },
        b2 || { arrivalTime: '-', secondsLeft: 9999, crowding: 'seats-available', type: 'SD', wheelchairAccessible: false },
        b3 || { arrivalTime: '-', secondsLeft: 9999, crowding: 'seats-available', type: 'SD', wheelchairAccessible: false },
      ];

      return {
        serviceNo: svc.ServiceNo,
        operator: svc.Operator || 'SBST',
        nextBuses,
        rawNextBus: svc.NextBus,
        rawNextBus2: svc.NextBus2,
        rawNextBus3: svc.NextBus3,
      };
    });

    const successResponse = {
      status: 'ok',
      source: 'lta_datamall_v3',
      BusStopCode: ltaData.BusStopCode || busStopCode,
      servicesCount: formattedServices.length,
      services: formattedServices,
      raw: ltaData,
      cachedUntil: new Date(Date.now() + 20000).toISOString(), // 20s refresh
    };

    if (typeof res.status === 'function') {
      return res.status(200).json(successResponse);
    }
    res.statusCode = 200;
    return res.end(JSON.stringify(successResponse));
  } catch (err) {
    const errorResponse = {
      status: 'error',
      message: 'Failed to fetch bus arrival data from LTA DataMall',
      error: err instanceof Error ? err.message : String(err),
      BusStopCode: busStopCode,
    };
    if (typeof res.status === 'function') {
      return res.status(502).json(errorResponse);
    }
    res.statusCode = 502;
    return res.end(JSON.stringify(errorResponse));
  }
}
