/**
 * Creature Type System
 */
export type CreatureType = 'clockwork' | 'steam' | 'hydro' | 'electric' | 'pneumatic' | 'kinetic';

/**
 * Evolution Stage
 */
export type EvolutionStage = 1 | 2 | 3 | 4 | 5;

/**
 * Base Stats
 */
export interface Stats {
  strength: number;
  speed: number;
  intelligence: number;
  defense: number;
  stamina: number;
}

/**
 * Evolution Condition Types
 */
export type EvolutionCondition =
  | { type: 'age'; hours: number }
  | { type: 'stat'; stat: keyof Stats; value: number }
  | { type: 'training'; trainingType: string; count: number }
  | { type: 'item'; itemId: string }
  | { type: 'battles'; wins: number }
  | { type: 'happiness'; value: number };

/**
 * Evolution Path
 */
export interface EvolutionPath {
  targetId: string;
  conditions: EvolutionCondition[];
  description: string; // Human-readable description
}

/**
 * Creature Definition
 */
export interface CreatureDefinition {
  id: string; // e.g., "hop_spring"
  name: string; // e.g., "Hop Spring"
  type: CreatureType;
  stage: EvolutionStage;
  description: string;

  // Stats
  baseStats: Stats;

  // Visual
  sprite?: string; // Path to sprite (optional for now)
  color: number; // Hex color for placeholder rendering
  accentColor: number; // Secondary color

  // Evolution
  evolvesFrom?: string; // Parent creature ID
  evolutions: EvolutionPath[];

  // Flavor
  discoveryText: string; // Pokedex entry when first discovered

  // Metadata
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

/**
 * Creature Instance (player's actual creature)
 */
export interface CreatureInstance {
  id: string; // Unique instance ID
  definitionId: string; // Reference to CreatureDefinition
  nickname?: string;

  // Current state
  currentStats: Stats;
  level: number;
  experience: number;

  // Age & Care
  ageInHours: number;
  happiness: number;
  hunger: number;
  discipline: number;

  // Training history
  trainingHistory: {
    [key: string]: number; // e.g., { "strength": 5, "agility": 3 }
  };

  // Battle stats
  battlesWon: number;
  battlesLost: number;

  // Timestamps
  createdAt: number;
  lastFed: number;
  lastTrained: number;

  // Discovery
  discoveredAt: number;
}

/**
 * Player Progress (for Pokedex)
 */
export interface PlayerProgress {
  discoveredCreatures: Set<string>; // Creature IDs that have been seen
  ownedCreatures: CreatureInstance[];
  achievements: string[];
}
