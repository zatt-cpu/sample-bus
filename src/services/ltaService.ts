import { LTABusArrivalResponse, LTABusService } from '../../api/bus-arrival';
import { BusDeckType, BusServiceSummary, CrowdLevel, LiveArrival } from '../types/transit';

/**
 * Maps LTA load code ('SEA', 'SDA', 'LSD') to app CrowdLevel ('seats', 'standing', 'limited')
 */
export function mapLtaLoad(load?: string): CrowdLevel {
  switch (load) {
    case 'SEA':
      return 'seats';
    case 'SDA':
      return 'standing';
    case 'LSD':
      return 'limited';
    default:
      return 'seats';
  }
}

/**
 * Maps LTA bus type ('SD', 'DD', 'BD') to app BusDeckType
 */
export function mapLtaDeck(type?: string): BusDeckType {
  switch (type) {
    case 'DD':
      return 'DD';
    case 'BD':
      return 'BD';
    case 'SD':
    default:
      return 'SD';
  }
}

/**
 * Transforms an LTA NextBus entity into the UI LiveArrival format
 */
export function formatLtaArrival(bus?: LTABusService['NextBus']): LiveArrival {
  if (!bus || !bus.EstimatedArrival) {
    return {
      time: '-',
      isArr: false,
      deck: 'SD',
      crowd: 'seats',
      wab: false,
    };
  }

  const mins = bus.minutesToArrival;
  const isArr = mins === 'Arr' || (typeof mins === 'number' && mins <= 1);
  const timeStr = isArr ? 'Arr' : typeof mins === 'number' ? String(mins) : 'Arr';

  return {
    time: timeStr,
    isArr,
    deck: mapLtaDeck(bus.Type),
    crowd: mapLtaLoad(bus.Load),
    wab: bus.Feature === 'WAB',
    plate: bus.OriginCode ? `SG${bus.OriginCode.slice(-4)}` : undefined,
  };
}

/**
 * Transforms an LTABusService object into BusServiceSummary
 */
export function transformLtaServiceToSummary(svc: LTABusService): BusServiceSummary {
  const arr1 = formatLtaArrival(svc.NextBus);
  const arr2 = formatLtaArrival(svc.NextBus2);
  const arr3 = formatLtaArrival(svc.NextBus3);

  return {
    serviceNo: svc.ServiceNo,
    operator: (svc.Operator as any) || 'SBST',
    destination: `Loop / Terminus (${svc.NextBus?.DestinationCode || 'SG'})`,
    operatingHours: '05:30 - 23:45 daily',
    frequencyPeak: '6-10 min peak',
    type: 'WAB Trunk',
    arrivals: [arr1, arr2, arr3],
    isStarred: false,
    hasAlarm: false,
  };
}

/**
 * Fetches real-time bus arrivals from the local /api/bus-arrival endpoint
 */
export async function fetchLiveBusArrivals(
  busStopCode: string = '83139',
  serviceNo?: string
): Promise<LTABusArrivalResponse> {
  const params = new URLSearchParams();
  params.set('BusStopCode', busStopCode);
  if (serviceNo) {
    params.set('ServiceNo', serviceNo);
  }

  const response = await fetch(`/api/bus-arrival?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bus arrival data: HTTP ${response.status}`);
  }

  return (await response.json()) as LTABusArrivalResponse;
}
