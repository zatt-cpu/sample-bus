export type CrowdLevel = 'seats' | 'standing' | 'limited';

export type BusDeckType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Decker, Bendy

export interface LiveArrival {
  time: string; // 'Arr' or '3' or '7'
  isArr?: boolean;
  deck: BusDeckType;
  crowd: CrowdLevel;
  wab: boolean; // Wheelchair accessible
  plate?: string;
  distanceMetres?: number;
}

export interface BusServiceSummary {
  serviceNo: string;
  operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  destination: string;
  via?: string;
  origin?: string;
  operatingHours: string;
  frequencyPeak: string;
  type: string;
  arrivals: [LiveArrival, LiveArrival, LiveArrival];
  isStarred?: boolean;
  hasAlarm?: boolean;
}

export interface RouteTimelineStop {
  id: string;
  name: string;
  road: string;
  seq: number;
  status: 'passed' | 'current' | 'upcoming';
  etaMinutes?: number;
  isCurrentLocation?: boolean;
  activeBus?: {
    plate: string;
    deck: BusDeckType;
    crowd: CrowdLevel;
    busNoLabel: string;
    isDoubleDecker?: boolean;
  };
  transfers?: string[];
}

export interface BusStopDetail {
  id: string;
  name: string;
  road: string;
  distanceMeters: number;
  walkMinutes: number;
  services: string[];
  isStarred?: boolean;
  lat: number;
  lng: number;
}

export interface AlightingAlarmState {
  isActive: boolean;
  targetStopId: string;
  targetStopName: string;
  serviceNo: string;
  notifyStopsBefore: number;
}
