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
 * Helper to extract tag value from XML string (handles namespaced tags like d:ServiceNo)
 */
function getTagValue(xmlChunk: string, tagName: string): string {
  const regex = new RegExp(`<(?:[a-zA-Z0-9_-]+:)?${tagName}[^>]*>(.*?)</(?:[a-zA-Z0-9_-]+:)?${tagName}>`, 's');
  const match = xmlChunk.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Parses individual NextBus / NextBus2 / NextBus3 block from LTA OData XML
 */
function parseArrivalInfoXml(xmlChunk: string, busTagName: string): LTANextBus | undefined {
  const regex = new RegExp(`<(?:[a-zA-Z0-9_-]+:)?${busTagName}[^>]*>(.*?)</(?:[a-zA-Z0-9_-]+:)?${busTagName}>`, 's');
  const match = xmlChunk.match(regex);
  if (!match) return undefined;

  const inner = match[1];

  // Check if null or empty
  if (inner.includes('m:null="true"') || inner.includes('EstimatedArrival m:null="true"')) {
    return undefined;
  }

  const estimatedArrival = getTagValue(inner, 'EstimatedArrival');
  if (!estimatedArrival) {
    return undefined;
  }

  return {
    OriginCode: getTagValue(inner, 'OriginCode'),
    DestinationCode: getTagValue(inner, 'DestinationCode'),
    EstimatedArrival: estimatedArrival,
    Latitude: getTagValue(inner, 'Latitude'),
    Longitude: getTagValue(inner, 'Longitude'),
    VisitNumber: getTagValue(inner, 'VisitNumber') || '1',
    Load: (getTagValue(inner, 'Load') as any) || 'SEA',
    Feature: (getTagValue(inner, 'Feature') as any) || 'WAB',
    Type: (getTagValue(inner, 'Type') as any) || 'SD',
  };
}

/**
 * Parses LTA DataMall v3 Atom / OData XML feed into LTABusArrivalResponse
 */
export function parseLtaODataXml(xml: string, fallbackStopCode: string): LTABusArrivalResponse {
  const busStopId =
    getTagValue(xml, 'BusStopID') ||
    getTagValue(xml, 'BusStopCode') ||
    fallbackStopCode;

  // Extract <d:Services> section
  const servicesMatch = xml.match(/<(?:[a-zA-Z0-9_-]+:)?Services[^>]*>(.*?)<\/(?:[a-zA-Z0-9_-]+:)?Services>/s);
  const servicesBlock = servicesMatch ? servicesMatch[1] : xml;

  // Match all <d:element> items
  const elementRegex = /<(?:[a-zA-Z0-9_-]+:)?element[^>]*>(.*?)<\/(?:[a-zA-Z0-9_-]+:)?element>/gs;
  const services: LTABusService[] = [];
  let elMatch: RegExpExecArray | null;

  while ((elMatch = elementRegex.exec(servicesBlock)) !== null) {
    const el = elMatch[1];
    const serviceNo = getTagValue(el, 'ServiceNo');
    const operator = getTagValue(el, 'Operator');

    const nextBus = parseArrivalInfoXml(el, 'NextBus');
    const nextBus2 = parseArrivalInfoXml(el, 'NextBus2');
    const nextBus3 = parseArrivalInfoXml(el, 'NextBus3');

    if (serviceNo && nextBus) {
      services.push({
        ServiceNo: serviceNo,
        Operator: operator || 'SBST',
        NextBus: nextBus,
        NextBus2: nextBus2,
        NextBus3: nextBus3,
      });
    }
  }

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrival',
    BusStopCode: busStopId,
    Services: services,
  };
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
  let sampleServices = serviceNo ? [serviceNo] : ['15', '65', '14', '106'];
  if (!serviceNo && busStopCode === '20251') {
    sampleServices = ['176', '30', '78'];
  }

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrival',
    BusStopCode: busStopCode,
    isMock: true,
    warning:
      'LTA_API_KEY is not set in environment variables. Showing simulated transit arrival data. Add LTA_API_KEY in Vercel Environment Variables to get live LTA telemetry.',
    Services: sampleServices.map((svc) => {
      const op =
        svc === '176' ? 'SMRT' : svc === '78' || svc === '106' ? 'TTS' : svc === '15' ? 'GAS' : 'SBST';

      return {
        ServiceNo: svc,
        Operator: op,
        NextBus: {
          OriginCode: '10009',
          DestinationCode: '45009',
          EstimatedArrival: new Date(now + 90 * 1000).toISOString(),
          Latitude: '1.310178',
          Longitude: '103.756378',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'DD',
          minutesToArrival: 'Arr',
          isArr: true,
          loadDescription: 'Seats Available',
        },
        NextBus2: {
          OriginCode: '10009',
          DestinationCode: '45009',
          EstimatedArrival: new Date(now + 7 * 60 * 1000).toISOString(),
          Latitude: '1.276848',
          Longitude: '103.789578',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'DD',
          minutesToArrival: 7,
          isArr: false,
          loadDescription: 'Seats Available',
        },
        NextBus3: {
          OriginCode: '10009',
          DestinationCode: '45009',
          EstimatedArrival: new Date(now + 18 * 60 * 1000).toISOString(),
          Latitude: '1.275151',
          Longitude: '103.814938',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'SD',
          minutesToArrival: 18,
          isArr: false,
          loadDescription: 'Seats Available',
        },
      };
    }),
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
      (query.BusStopID as string) ||
      url.searchParams.get('BusStopCode') ||
      url.searchParams.get('BusStopID') ||
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
        Accept: 'application/json, application/xml, text/xml, */*',
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

    const rawResponseText = await ltaResponse.text();
    let data: LTABusArrivalResponse;

    // Detect if LTA returned XML or JSON
    const trimmed = rawResponseText.trim();
    if (trimmed.startsWith('<') || trimmed.includes('<entry') || trimmed.includes('<d:Services')) {
      data = parseLtaODataXml(rawResponseText, busStopCode);
    } else {
      data = JSON.parse(rawResponseText) as LTABusArrivalResponse;
    }

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
