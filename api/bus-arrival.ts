/**
 * LTA DataMall v3 Bus Arrival Serverless Handler
 *
 * Endpoint proxied:
 * https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
 * # ...optionally one service: &ServiceNo=15
 *
 * Environment variable required in Vercel:
 * LTA_API_KEY: Your LTA DataMall AccountKey
 */

export interface LTANextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: 'SEA' | 'SDA' | 'LSD' | string; // SEA = Seats Available, SDA = Standing Available, LSD = Limited Standing
  Feature: 'WAB' | string; // WAB = Wheelchair Accessible Bus
  Type: 'SD' | 'DD' | 'BD' | string; // SD = Single Deck, DD = Double Deck, BD = Bendy
  // Helper calculated fields
  minutesToArrival?: number | 'Arr';
  loadDescription?: string;
  isArr?: boolean;
}

export interface LTABusService {
  ServiceNo: string;
  Operator: string;
  NextBus: LTANextBus;
  NextBus2?: LTANextBus;
  NextBus3?: LTANextBus;
}

export interface LTABusArrivalResponse {
  'odata.metadata': string;
  BusStopCode: string;
  Services: LTABusService[];
  warning?: string;
  isMock?: boolean;
}

/**
 * Calculates minutes remaining from current time to EstimatedArrival ISO string
 */
function calculateMinutesToArrival(estimatedArrivalIso?: string): number | 'Arr' {
  if (!estimatedArrivalIso) return 'Arr';
  const targetTime = new Date(estimatedArrivalIso).getTime();
  const now = Date.now();
  const diffMinutes = Math.round((targetTime - now) / 60000);
  if (diffMinutes <= 1) return 'Arr';
  return diffMinutes;
}

function getLoadDescription(loadCode?: string): string {
  switch (loadCode) {
    case 'SEA':
      return 'Seats Available';
    case 'SDA':
      return 'Standing Available';
    case 'LSD':
      return 'Limited Standing';
    default:
      return 'Seats Available';
  }
}

function enrichBus(bus?: LTANextBus): LTANextBus | undefined {
  if (!bus || !bus.EstimatedArrival) return undefined;
  const mins = calculateMinutesToArrival(bus.EstimatedArrival);
  return {
    ...bus,
    minutesToArrival: mins,
    isArr: mins === 'Arr',
    loadDescription: getLoadDescription(bus.Load),
  };
}

/**
 * Fallback realistic mock generator when LTA_API_KEY is not yet added in Vercel
 */
function generateFallbackData(busStopCode: string, serviceNo?: string): LTABusArrivalResponse {
  const now = Date.now();
  const sampleServices = serviceNo ? [serviceNo] : ['15', '65', '14', '106'];

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrival',
    BusStopCode: busStopCode,
    isMock: true,
    warning:
      'LTA_API_KEY is not set in environment variables. Showing simulated transit arrival data. Add LTA_API_KEY in Vercel Environment Variables to get live LTA telemetry.',
    Services: sampleServices.map((svc) => ({
      ServiceNo: svc,
      Operator: svc === '15' ? 'GAS' : svc === '106' ? 'TTS' : 'SBST',
      NextBus: {
        OriginCode: '77009',
        DestinationCode: '77009',
        EstimatedArrival: new Date(now + 90 * 1000).toISOString(),
        Latitude: '1.3050',
        Longitude: '103.8500',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
        minutesToArrival: 'Arr',
        isArr: true,
        loadDescription: 'Seats Available',
      },
      NextBus2: {
        OriginCode: '77009',
        DestinationCode: '77009',
        EstimatedArrival: new Date(now + 7 * 60 * 1000).toISOString(),
        Latitude: '1.3120',
        Longitude: '103.8620',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD',
        minutesToArrival: 7,
        isArr: false,
        loadDescription: 'Standing Available',
      },
      NextBus3: {
        OriginCode: '77009',
        DestinationCode: '77009',
        EstimatedArrival: new Date(now + 18 * 60 * 1000).toISOString(),
        Latitude: '1.3280',
        Longitude: '103.8800',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'DD',
        minutesToArrival: 18,
        isArr: false,
        loadDescription: 'Limited Standing',
      },
    })),
  };
}

/**
 * Standard Vercel Serverless Function export
 */
export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, AccountKey, Authorization'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract query parameters
    const query = req.query || {};
    const url = new URL(req.url || '/', 'http://localhost');
    const busStopCode =
      (query.BusStopCode as string) ||
      url.searchParams.get('BusStopCode') ||
      '83139';
    const serviceNo =
      (query.ServiceNo as string) ||
      url.searchParams.get('ServiceNo') ||
      undefined;

    // Check for LTA API Key in environment variables
    const apiKey =
      process.env.LTA_API_KEY ||
      process.env.LTA_DATAMALL_API_KEY ||
      process.env.LTA_DATAMALL_KEY ||
      process.env.DATAMALL_API_KEY ||
      process.env.API_KEY ||
      (req.headers?.['accountkey'] as string) ||
      (req.headers?.['x-api-key'] as string);

    if (!apiKey) {
      // If user hasn't added API Key yet, return the fallback payload with clear notice
      const fallback = generateFallbackData(busStopCode, serviceNo);
      return res.status(200).json(fallback);
    }

    // Call real LTA DataMall v3 Endpoint
    const ltaUrl = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
    ltaUrl.searchParams.set('BusStopCode', busStopCode);
    if (serviceNo) {
      ltaUrl.searchParams.set('ServiceNo', serviceNo);
    }

    const ltaResponse = await fetch(ltaUrl.toString(), {
      method: 'GET',
      headers: {
        AccountKey: apiKey,
        accept: 'application/json',
      },
    });

    if (!ltaResponse.ok) {
      const errorText = await ltaResponse.text();
      console.error(`LTA DataMall API error: status ${ltaResponse.status}`, errorText);

      // Return graceful fallback with warning message
      const fallback = generateFallbackData(busStopCode, serviceNo);
      fallback.warning = `LTA DataMall API responded with status ${ltaResponse.status}. Verify your LTA_API_KEY in Vercel. Showing simulated data.`;
      return res.status(200).json(fallback);
    }

    const data = (await ltaResponse.json()) as LTABusArrivalResponse;

    // Enrich the services with calculated minutes and human-readable load descriptions
    if (data && Array.isArray(data.Services)) {
      data.Services = data.Services.map((svc) => ({
        ...svc,
        NextBus: enrichBus(svc.NextBus) || svc.NextBus,
        NextBus2: enrichBus(svc.NextBus2),
        NextBus3: enrichBus(svc.NextBus3),
      }));
    }

    // Set cache control for real-time transit data (cache for 15s to match LTA poll rate)
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching LTA Bus Arrival:', error);
    return res.status(500).json({
      error: 'Failed to fetch LTA bus arrival data',
      message: error?.message || 'Unknown error',
    });
  }
}
