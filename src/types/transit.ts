export type CrowdingLevel = 'seats-available' | 'standing-available' | 'limited-standing';
export type BusType = 'DD' | 'SD' | 'BD'; // Double Decker, Single Decker, Bendy

export interface NextBusArrival {
  arrivalTime: string; // e.g. "Arr", "3 mins", "8 mins"
  secondsLeft: number;
  crowding: CrowdingLevel;
  type: BusType;
  wheelchairAccessible: boolean;
  busPlate?: string;
  isElectric?: boolean;
}

export interface BusArrivalService {
  serviceNo: string;
  category: 'trunk' | 'feeder' | 'express' | 'night';
  operator: 'SBS Transit';
  destinationName: string;
  destinationCode: string;
  originName: string;
  nextBuses: [NextBusArrival, NextBusArrival, NextBusArrival];
  firstBus: string;
  lastBus: string;
  frequency: string;
  routeStopsCount: number;
}

export interface BusStop {
  code: string;
  name: string;
  roadName: string;
  description?: string;
  isInterchange?: boolean;
  mrtConnections?: string[]; // e.g. ["NE4", "DT19"]
  services: string[];
}

export interface RouteStopDetail {
  stopCode: string;
  stopName: string;
  roadName: string;
  seq: number;
  distanceKm: number;
  firstBus: string;
  lastBus: string;
  hasBusNow?: boolean;
  busPlate?: string;
  busLoad?: CrowdingLevel;
}

export interface BusRouteInfo {
  serviceNo: string;
  direction: 1 | 2;
  origin: string;
  destination: string;
  loopPoint?: string;
  stops: RouteStopDetail[];
  category: 'trunk' | 'feeder' | 'express' | 'night';
  fareDistance: string;
  weekdayFrequency: string;
  weekendFrequency: string;
}

export interface MRTStation {
  code: string; // "NE1", "DT19"
  name: string;
  line: 'NEL' | 'DTL' | 'SKLRT' | 'PGLRT';
  interchanges?: string[];
  firstTrainWeekday: {
    terminalA: string;
    terminalB: string;
  };
  lastTrainWeekday: {
    terminalA: string;
    terminalB: string;
  };
  facilities: {
    hasLift: boolean;
    hasTactileTiles: boolean;
    hasNursingRoom: boolean;
    hasToilets: boolean;
    hasBicycleRacks: boolean;
    hasGoToPoint: boolean;
  };
  exits: {
    exit: string;
    landmarks: string[];
  }[];
}

export interface MRTLineStatus {
  id: 'NEL' | 'DTL' | 'SKLRT' | 'PGLRT';
  name: string;
  fullName: string;
  color: string;
  accentColor: string;
  status: 'Normal' | 'Delay' | 'Disrupted';
  statusDescription: string;
  lastUpdated: string;
  totalStations: number;
  operatingHours: string;
}

export interface DisruptionAlert {
  id: string;
  severity: 'high' | 'medium' | 'info';
  title: string;
  category: 'MRT Disruption' | 'Bus Diversion' | 'Service Extension' | 'Travel Advisory';
  linesAffected?: string[];
  busServicesAffected?: string[];
  timestamp: string;
  message: string;
  alternativeTravelAdvice?: string;
  active: boolean;
}

export interface JourneyLeg {
  type: 'walk' | 'bus' | 'mrt';
  serviceOrLine?: string;
  color?: string;
  from: string;
  to: string;
  durationMins: number;
  stopsCount?: number;
  instruction: string;
}

export interface JourneyOption {
  id: string;
  title: string;
  durationMinutes: number;
  walkingMinutes: number;
  transfers: number;
  estimatedFare: number; // SGD
  crowding: CrowdingLevel;
  legs: JourneyLeg[];
}
