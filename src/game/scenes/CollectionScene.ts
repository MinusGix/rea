import Phaser from 'phaser';
import CreatureDatabase from '../../creatures/CreatureDatabase';
import GameData from '../../creatures/GameData';
import { CreatureDefinition } from '../../creatures/types';

export class CollectionScene extends Phaser.Scene {
  private selectedCreature?: CreatureDefinition;
  private creatureCards: Phaser.GameObjects.Container[] = [];

  constructor() {
    super({ key: 'CollectionScene' });
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    this.add.text(centerX, 60, '📚 CREATURE COLLECTION 📚', {
      fontSize: '28px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Back button
    const backButton = this.add.text(40, 60, '← Back', {
      fontSize: '20px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
    }).setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Debug mode indicator
    if (GameData.debugMode) {
      this.add.text(width - 20, 60, '🐛 DEBUG', {
        fontSize: '18px',
        color: '#FF0000',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      }).setOrigin(1, 0.5);
    }

    // Get all creatures
    const allCreatures = CreatureDatabase.getAllCreatures();
    const discovered = allCreatures.filter(c => GameData.isDiscovered(c.id));

    // Stats
    this.add.text(centerX, 120, `Discovered: ${discovered.length} / ${allCreatures.length}`, {
      fontSize: '20px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    // Create scrollable grid of creature cards
    this.createCreatureGrid(allCreatures, 160);
  }

  private createCreatureGrid(creatures: CreatureDefinition[], startY: number) {
    const cardsPerRow = 3;
    const cardWidth = 200;
    const cardHeight = 240;
    const padding = 20;
    const startX = (this.cameras.main.width - (cardsPerRow * (cardWidth + padding))) / 2 + cardWidth / 2;

    creatures.forEach((creature, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;

      const x = startX + col * (cardWidth + padding);
      const y = startY + row * (cardHeight + padding);

      const card = this.createCreatureCard(creature, x, y, cardWidth, cardHeight);
      this.creatureCards.push(card);
    });
  }

  private createCreatureCard(
    creature: CreatureDefinition,
    x: number,
    y: number,
    width: number,
    height: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const isDiscovered = GameData.isDiscovered(creature.id);

    // Card background
    const bg = this.add.rectangle(0, 0, width, height, isDiscovered ? 0xF5DEB3 : 0x888888, 1);
    bg.setStrokeStyle(3, isDiscovered ? 0x8B4513 : 0x444444);
    bg.setInteractive({ useHandCursor: isDiscovered });

    container.add(bg);

    if (isDiscovered) {
      // Stage indicator
      const stageColor = this.getStageColor(creature.stage);
      const stageBadge = this.add.circle(-width / 2 + 20, -height / 2 + 20, 15, stageColor);
      const stageText = this.add.text(-width / 2 + 20, -height / 2 + 20, creature.stage.toString(), {
        fontSize: '16px',
        color: '#FFFFFF',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Creature preview (simple colored circle for now)
      const preview = this.add.circle(0, -30, 40, creature.color);
      preview.setStrokeStyle(2, creature.accentColor);

      // Name
      const nameText = this.add.text(0, 30, creature.name, {
        fontSize: '18px',
        color: '#8B4513',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: width - 20 },
      }).setOrigin(0.5);

      // Type
      const typeText = this.add.text(0, 55, creature.type.toUpperCase(), {
        fontSize: '14px',
        color: '#A0826D',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5);

      // Rarity
      const rarityColor = this.getRarityColor(creature.rarity);
      const rarityText = this.add.text(0, 75, `★ ${creature.rarity}`, {
        fontSize: '12px',
        color: rarityColor,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      container.add([stageBadge, stageText, preview, nameText, typeText, rarityText]);

      // Click to view details
      bg.on('pointerdown', () => {
        this.showCreatureDetails(creature);
      });

      // Hover effect
      bg.on('pointerover', () => {
        bg.setFillStyle(0xFFE4B5);
        container.setScale(1.05);
      });

      bg.on('pointerout', () => {
        bg.setFillStyle(0xF5DEB3);
        container.setScale(1);
      });
    } else {
      // Unknown creature - show silhouette
      const silhouette = this.add.circle(0, -20, 40, 0x000000, 0.3);
      const questionMark = this.add.text(0, -20, '?', {
        fontSize: '48px',
        color: '#444444',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      const unknownText = this.add.text(0, 40, '???', {
        fontSize: '18px',
        color: '#666666',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      container.add([silhouette, questionMark, unknownText]);
    }

    return container;
  }

  private showCreatureDetails(creature: CreatureDefinition) {
    // Create modal overlay
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setInteractive();

    const modalWidth = Math.min(600, width - 40);
    const modalHeight = Math.min(900, height - 100);

    const modal = this.add.rectangle(width / 2, height / 2, modalWidth, modalHeight, 0xF5DEB3);
    modal.setStrokeStyle(5, 0x8B4513);

    // Close button
    const closeBtn = this.add.text(width / 2 + modalWidth / 2 - 40, height / 2 - modalHeight / 2 + 30, '✕', {
      fontSize: '32px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      modal.destroy();
      closeBtn.destroy();
      detailsContainer.destroy();
    });

    // Details content
    const detailsContainer = this.add.container(width / 2, height / 2 - modalHeight / 2 + 100);

    // Creature preview (larger)
    const preview = this.add.circle(0, 0, 60, creature.color);
    preview.setStrokeStyle(3, creature.accentColor);

    // Name
    const nameText = this.add.text(0, 80, creature.name, {
      fontSize: '32px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Type & Stage
    const typeStage = this.add.text(0, 120, `${creature.type.toUpperCase()} • Stage ${creature.stage}`, {
      fontSize: '18px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    // Description
    const desc = this.add.text(0, 160, creature.description, {
      fontSize: '16px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      wordWrap: { width: modalWidth - 80 },
    }).setOrigin(0.5, 0);

    // Stats
    const statsY = 260;
    const statsTitle = this.add.text(0, statsY, '═══ STATS ═══', {
      fontSize: '20px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const statNames = ['STR', 'SPD', 'INT', 'DEF', 'STA'];
    const statValues = [
      creature.baseStats.strength,
      creature.baseStats.speed,
      creature.baseStats.intelligence,
      creature.baseStats.defense,
      creature.baseStats.stamina,
    ];

    statNames.forEach((name, i) => {
      const y = statsY + 40 + i * 35;
      this.add.text(-150, y, name, {
        fontSize: '16px',
        color: '#8B4513',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);

      // Stat bar
      const barWidth = 200;
      const barBg = this.add.rectangle(-30, y, barWidth, 20, 0xCCCCCC).setOrigin(0, 0.5);
      const barFill = this.add.rectangle(-30, y, (barWidth * statValues[i]) / 100, 20, 0x4CAF50).setOrigin(0, 0.5);

      this.add.text(-30 + barWidth + 10, y, statValues[i].toString(), {
        fontSize: '16px',
        color: '#8B4513',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0, 0.5);

      detailsContainer.add([barBg, barFill]);
    });

    // Discovery text
    const discoveryY = statsY + 240;
    const discoveryText = this.add.text(0, discoveryY, `"${creature.discoveryText}"`, {
      fontSize: '14px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: modalWidth - 80 },
    }).setOrigin(0.5, 0);

    detailsContainer.add([preview, nameText, typeStage, desc, statsTitle, discoveryText]);
  }

  private getStageColor(stage: number): number {
    switch (stage) {
      case 1: return 0x90EE90; // Light green
      case 2: return 0x4169E1; // Royal blue
      case 3: return 0x9370DB; // Medium purple
      case 4: return 0xFFD700; // Gold
      case 5: return 0xFF1493; // Deep pink
      default: return 0x808080; // Gray
    }
  }

  private getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return '#8B4513';
      case 'uncommon': return '#2E8B57';
      case 'rare': return '#4169E1';
      case 'legendary': return '#FFD700';
      default: return '#000000';
    }
  }
}
