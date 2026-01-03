import { CreatureDefinition } from './types';
import creaturesData from '../data/creatures.json';

/**
 * Creature Database - Manages all creature definitions
 */
export class CreatureDatabase {
  private static instance: CreatureDatabase;
  private creatures: Map<string, CreatureDefinition> = new Map();

  private constructor() {
    this.loadCreatures();
  }

  public static getInstance(): CreatureDatabase {
    if (!CreatureDatabase.instance) {
      CreatureDatabase.instance = new CreatureDatabase();
    }
    return CreatureDatabase.instance;
  }

  private loadCreatures() {
    // Load from JSON
    const data = creaturesData as Record<string, CreatureDefinition>;

    for (const [id, creature] of Object.entries(data)) {
      this.creatures.set(id, creature);
    }

    console.log(`📚 Loaded ${this.creatures.size} creatures`);
  }

  public getCreature(id: string): CreatureDefinition | undefined {
    return this.creatures.get(id);
  }

  public getAllCreatures(): CreatureDefinition[] {
    return Array.from(this.creatures.values());
  }

  public getCreaturesByStage(stage: number): CreatureDefinition[] {
    return this.getAllCreatures().filter(c => c.stage === stage);
  }

  public getCreaturesByType(type: string): CreatureDefinition[] {
    return this.getAllCreatures().filter(c => c.type === type);
  }

  public getStarterCreatures(): CreatureDefinition[] {
    return this.getCreaturesByStage(1);
  }

  public getEvolutionTree(creatureId: string): CreatureDefinition[] {
    const creature = this.getCreature(creatureId);
    if (!creature) return [];

    const tree: CreatureDefinition[] = [creature];

    // Get all evolutions recursively
    const addEvolutions = (c: CreatureDefinition) => {
      for (const evo of c.evolutions) {
        const evolved = this.getCreature(evo.targetId);
        if (evolved && !tree.includes(evolved)) {
          tree.push(evolved);
          addEvolutions(evolved);
        }
      }
    };

    addEvolutions(creature);
    return tree;
  }
}

export default CreatureDatabase.getInstance();
