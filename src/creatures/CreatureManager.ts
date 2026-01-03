import { CreatureInstance, EvolutionCondition, Stats } from './types';
import CreatureDatabase from './CreatureDatabase';
import GameData from './GameData';

/**
 * CreatureManager - Handles creature instances and evolution
 */
export class CreatureManager {
  /**
   * Create a new creature instance from definition
   */
  static createInstance(definitionId: string, nickname?: string): CreatureInstance {
    const definition = CreatureDatabase.getCreature(definitionId);
    if (!definition) {
      throw new Error(`Unknown creature: ${definitionId}`);
    }

    const now = Date.now();

    return {
      id: `${definitionId}_${now}_${Math.random().toString(36).substr(2, 9)}`,
      definitionId: definitionId,
      nickname: nickname,
      currentStats: { ...definition.baseStats },
      level: 1,
      experience: 0,
      ageInHours: 0,
      happiness: 75,
      hunger: 80,
      discipline: 50,
      trainingHistory: {},
      battlesWon: 0,
      battlesLost: 0,
      createdAt: now,
      lastFed: now,
      lastTrained: now,
      discoveredAt: now,
    };
  }

  /**
   * Update age based on time passed
   */
  static updateAge(creature: CreatureInstance): void {
    const hoursPassed = (Date.now() - creature.createdAt) / (1000 * 60 * 60);
    creature.ageInHours = hoursPassed;
  }

  /**
   * Train a creature in a specific stat
   */
  static train(creature: CreatureInstance, statType: keyof Stats, amount: number = 2): void {
    creature.currentStats[statType] += amount;
    creature.lastTrained = Date.now();

    // Track training history
    if (!creature.trainingHistory[statType]) {
      creature.trainingHistory[statType] = 0;
    }
    creature.trainingHistory[statType]++;

    console.log(`📈 ${statType} +${amount} (now ${creature.currentStats[statType]})`);
  }

  /**
   * Feed a creature
   */
  static feed(creature: CreatureInstance, amount: number = 20): void {
    creature.hunger = Math.min(100, creature.hunger + amount);
    creature.lastFed = Date.now();
  }

  /**
   * Play with creature
   */
  static play(creature: CreatureInstance, amount: number = 15): void {
    creature.happiness = Math.min(100, creature.happiness + amount);
  }

  /**
   * Check if evolution conditions are met
   */
  static checkEvolution(creature: CreatureInstance): string | null {
    const definition = CreatureDatabase.getCreature(creature.definitionId);
    if (!definition || definition.evolutions.length === 0) {
      return null;
    }

    this.updateAge(creature);

    // Check each evolution path
    for (const evolution of definition.evolutions) {
      if (this.meetsConditions(creature, evolution.conditions)) {
        return evolution.targetId;
      }
    }

    return null;
  }

  /**
   * Check if all conditions are met
   */
  private static meetsConditions(creature: CreatureInstance, conditions: EvolutionCondition[]): boolean {
    return conditions.every(condition => this.meetsCondition(creature, condition));
  }

  /**
   * Check single condition
   */
  private static meetsCondition(creature: CreatureInstance, condition: EvolutionCondition): boolean {
    switch (condition.type) {
      case 'age':
        return creature.ageInHours >= condition.hours;

      case 'stat':
        return creature.currentStats[condition.stat] >= condition.value;

      case 'training':
        return (creature.trainingHistory[condition.trainingType] || 0) >= condition.count;

      case 'item':
        // TODO: Implement item system
        return false;

      case 'battles':
        return creature.battlesWon >= condition.wins;

      case 'happiness':
        return creature.happiness >= condition.value;

      default:
        return false;
    }
  }

  /**
   * Evolve a creature
   */
  static evolve(creature: CreatureInstance, targetDefinitionId: string): void {
    const oldDefinition = CreatureDatabase.getCreature(creature.definitionId);
    const newDefinition = CreatureDatabase.getCreature(targetDefinitionId);

    if (!newDefinition) {
      throw new Error(`Unknown evolution target: ${targetDefinitionId}`);
    }

    console.log(`🎉 EVOLUTION! ${oldDefinition?.name} → ${newDefinition.name}`);

    // Update creature
    creature.definitionId = targetDefinitionId;

    // Boost stats based on new base stats
    const statBoost = 1.2; // 20% boost
    creature.currentStats.strength = Math.floor(creature.currentStats.strength * statBoost);
    creature.currentStats.speed = Math.floor(creature.currentStats.speed * statBoost);
    creature.currentStats.intelligence = Math.floor(creature.currentStats.intelligence * statBoost);
    creature.currentStats.defense = Math.floor(creature.currentStats.defense * statBoost);
    creature.currentStats.stamina = Math.floor(creature.currentStats.stamina * statBoost);

    // Discover new creature
    GameData.discoverCreature(targetDefinitionId);
  }

  /**
   * Get stat total for level calculation
   */
  static getStatTotal(creature: CreatureInstance): number {
    return Object.values(creature.currentStats).reduce((sum, val) => sum + val, 0);
  }

  /**
   * Calculate level from stats
   */
  static calculateLevel(creature: CreatureInstance): number {
    const statTotal = this.getStatTotal(creature);
    return Math.floor(statTotal / 20) + 1;
  }
}

export default CreatureManager;
