/**
 * Room Types and their effects
 */
export type RoomType =
  | 'play'       // Increases happiness over time
  | 'cafeteria'  // Auto-feeds creatures
  | 'medical'    // Heals and restores stats
  | 'track'      // Increases speed/stamina
  | 'library'    // Increases intelligence
  | 'gym'        // Increases strength
  | 'bedroom'    // Resting, increases happiness
  | 'empty';     // No special effects

/**
 * Room configuration
 */
export interface RoomConfig {
  type: RoomType;
  name: string;
  description: string;
  color: number;        // Primary hex color
  accentColor: number;  // Accent color
  effects: RoomEffect[];
}

/**
 * Room effect types
 */
export interface RoomEffect {
  type: 'stat_gain' | 'auto_feed' | 'heal' | 'happiness' | 'evolution_modifier';
  stat?: 'strength' | 'speed' | 'intelligence' | 'defense' | 'stamina';
  amount: number;       // Amount per tick (or multiplier)
  interval?: number;    // How often effect applies (milliseconds)
}

/**
 * Hex coordinate (axial)
 */
export interface HexCoord {
  q: number;  // Column
  r: number;  // Row
}

/**
 * Room instance in the world
 */
export interface HexRoom {
  coord: HexCoord;
  config: RoomConfig;
  creatureIds: string[];  // Creatures currently in this room
}

/**
 * Room type configurations
 */
export const ROOM_CONFIGS: Record<RoomType, RoomConfig> = {
  play: {
    type: 'play',
    name: 'Play Room',
    description: 'A fun space for creatures to play and be happy',
    color: 0xFFEB3B,
    accentColor: 0xFFC107,
    effects: [
      { type: 'happiness', amount: 1, interval: 10000 }, // +1 happiness every 10s
    ],
  },
  cafeteria: {
    type: 'cafeteria',
    name: 'Cafeteria',
    description: 'Keeps creatures fed automatically',
    color: 0x4CAF50,
    accentColor: 0x388E3C,
    effects: [
      { type: 'auto_feed', amount: 5, interval: 30000 }, // +5 hunger every 30s
    ],
  },
  medical: {
    type: 'medical',
    name: 'Medical Room',
    description: 'Heals and restores creature vitality',
    color: 0xF44336,
    accentColor: 0xD32F2F,
    effects: [
      { type: 'heal', amount: 2, interval: 15000 }, // +2 stamina every 15s
    ],
  },
  track: {
    type: 'track',
    name: 'Track Field',
    description: 'Long track for running and building stamina',
    color: 0x2196F3,
    accentColor: 0x1976D2,
    effects: [
      { type: 'stat_gain', stat: 'speed', amount: 0.5, interval: 20000 },
      { type: 'stat_gain', stat: 'stamina', amount: 0.5, interval: 20000 },
    ],
  },
  library: {
    type: 'library',
    name: 'Library',
    description: 'Quiet study space to increase intelligence',
    color: 0x9C27B0,
    accentColor: 0x7B1FA2,
    effects: [
      { type: 'stat_gain', stat: 'intelligence', amount: 0.5, interval: 20000 },
    ],
  },
  gym: {
    type: 'gym',
    name: 'Gym',
    description: 'Training equipment for building strength',
    color: 0xFF5722,
    accentColor: 0xE64A19,
    effects: [
      { type: 'stat_gain', stat: 'strength', amount: 0.5, interval: 20000 },
    ],
  },
  bedroom: {
    type: 'bedroom',
    name: 'Bedroom',
    description: 'Cozy space for resting and relaxing',
    color: 0x795548,
    accentColor: 0x5D4037,
    effects: [
      { type: 'happiness', amount: 2, interval: 15000 },
    ],
  },
  empty: {
    type: 'empty',
    name: 'Empty Room',
    description: 'An unused space',
    color: 0xCCCCCC,
    accentColor: 0x999999,
    effects: [],
  },
};
