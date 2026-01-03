import { CreatureInstance } from './types';

/**
 * GameData - Manages player progress and save data
 */
export class GameData {
  private static instance: GameData;

  // Player progress
  private discoveredCreatures: Set<string> = new Set();
  private ownedCreatures: CreatureInstance[] = [];

  // Debug mode
  public debugMode: boolean = true; // Default ON for development

  private constructor() {
    this.load();
  }

  public static getInstance(): GameData {
    if (!GameData.instance) {
      GameData.instance = new GameData();
    }
    return GameData.instance;
  }

  /**
   * Discovery tracking
   */
  public discoverCreature(creatureId: string) {
    if (!this.discoveredCreatures.has(creatureId)) {
      this.discoveredCreatures.add(creatureId);
      console.log(`🎉 Discovered: ${creatureId}`);
      this.save();
    }
  }

  public isDiscovered(creatureId: string): boolean {
    // In debug mode, everything is discovered
    if (this.debugMode) return true;
    return this.discoveredCreatures.has(creatureId);
  }

  public getDiscoveredCount(): number {
    return this.discoveredCreatures.size;
  }

  /**
   * Creature ownership
   */
  public addCreature(creature: CreatureInstance) {
    this.ownedCreatures.push(creature);
    this.discoverCreature(creature.definitionId);
    this.save();
  }

  public getOwnedCreatures(): CreatureInstance[] {
    return this.ownedCreatures;
  }

  public getCreature(instanceId: string): CreatureInstance | undefined {
    return this.ownedCreatures.find(c => c.id === instanceId);
  }

  /**
   * Debug toggle
   */
  public toggleDebugMode(): boolean {
    this.debugMode = !this.debugMode;
    console.log(`🐛 Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
    this.save();
    return this.debugMode;
  }

  /**
   * Save/Load (LocalStorage)
   */
  public save() {
    const data = {
      discoveredCreatures: Array.from(this.discoveredCreatures),
      ownedCreatures: this.ownedCreatures,
      debugMode: this.debugMode,
    };

    try {
      localStorage.setItem('clockwork_save', JSON.stringify(data));
      console.log('💾 Game saved');
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }

  public load() {
    try {
      const saved = localStorage.getItem('clockwork_save');
      if (saved) {
        const data = JSON.parse(saved);
        this.discoveredCreatures = new Set(data.discoveredCreatures || []);
        this.ownedCreatures = data.ownedCreatures || [];
        this.debugMode = data.debugMode !== undefined ? data.debugMode : true;
        console.log(`📂 Loaded save: ${this.discoveredCreatures.size} discovered`);
      }
    } catch (error) {
      console.error('Failed to load save:', error);
    }
  }

  public reset() {
    this.discoveredCreatures.clear();
    this.ownedCreatures = [];
    this.debugMode = true;
    this.save();
    console.log('🗑️ Save data reset');
  }
}

export default GameData.getInstance();
