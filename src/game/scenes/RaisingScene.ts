import Phaser from 'phaser';
import CreatureDatabase from '../../creatures/CreatureDatabase';
import GameData from '../../creatures/GameData';
import CreatureManager from '../../creatures/CreatureManager';
import { CreatureDefinition, CreatureInstance } from '../../creatures/types';

export class RaisingScene extends Phaser.Scene {
  private creature?: Phaser.GameObjects.Container;
  private creatureBody?: Phaser.GameObjects.Arc;
  private hungerBar?: Phaser.GameObjects.Graphics;
  private happinessBar?: Phaser.GameObjects.Graphics;

  private creatureInstance?: CreatureInstance;
  private currentDefinition?: CreatureDefinition;

  private nameText?: Phaser.GameObjects.Text;
  private infoText?: Phaser.GameObjects.Text;
  private statsText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'RaisingScene' });
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Create or load creature instance
    this.creatureInstance = CreatureManager.createInstance('hop_spring', 'My First Creature');
    this.currentDefinition = CreatureDatabase.getCreature(this.creatureInstance.definitionId);

    if (this.currentDefinition) {
      GameData.discoverCreature(this.currentDefinition.id);
    }

    // Title
    this.nameText = this.add.text(centerX, 60, this.getCurrentName(), {
      fontSize: '28px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Create placeholder creature
    this.createPlaceholderCreature(centerX, centerY - 100);

    // Create UI
    this.createStatsUI();
    this.createActionButtons();

    // Back button
    const backButton = this.add.text(40, 60, '← Menu', {
      fontSize: '20px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
    }).setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Creature info
    this.infoText = this.add.text(centerX, centerY + 150, this.getInfoText(), {
      fontSize: '18px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
    }).setOrigin(0.5);

    // Stats display
    this.statsText = this.add.text(centerX, centerY + 200, this.getStatsText(), {
      fontSize: '16px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
    }).setOrigin(0.5);
  }

  private getCurrentName(): string {
    return this.currentDefinition?.name || 'Unknown';
  }

  private getInfoText(): string {
    if (!this.creatureInstance || !this.currentDefinition) return '';

    const age = Math.floor(this.creatureInstance.ageInHours / 24);
    const level = CreatureManager.calculateLevel(this.creatureInstance);

    return `Level ${level} | Age: ${age} days | Stage: ${this.currentDefinition.stage} | ${this.currentDefinition.type.toUpperCase()}`;
  }

  private getStatsText(): string {
    if (!this.creatureInstance) return '';

    const stats = this.creatureInstance.currentStats;
    return `STR ${stats.strength} | SPD ${stats.speed} | INT ${stats.intelligence} | DEF ${stats.defense} | STA ${stats.stamina}`;
  }

  private updateUI() {
    if (this.nameText && this.currentDefinition) {
      this.nameText.setText(this.getCurrentName());
    }
    if (this.infoText) {
      this.infoText.setText(this.getInfoText());
    }
    if (this.statsText) {
      this.statsText.setText(this.getStatsText());
    }
    if (this.hungerBar && this.creatureInstance) {
      this.updateBar(this.hungerBar, 180, 710, 300, 30, this.creatureInstance.hunger, 0x4CAF50);
    }
    if (this.happinessBar && this.creatureInstance) {
      this.updateBar(this.happinessBar, 180, 770, 300, 30, this.creatureInstance.happiness, 0xFFEB3B);
    }
  }

  private createPlaceholderCreature(x: number, y: number) {
    // Container for creature parts
    this.creature = this.add.container(x, y);

    // Get colors from creature data
    const bodyColor = this.currentDefinition?.color || 0xB8860B;
    const accentColor = this.currentDefinition?.accentColor || 0xD2691E;

    // Plastic stand (translucent)
    const stand = this.add.ellipse(0, 120, 140, 35, accentColor, 0.4);
    stand.setStrokeStyle(2, accentColor, 0.6);

    // Check if sprite is loaded
    const creatureId = this.currentDefinition?.id;
    const hasSprite = creatureId && this.textures.exists(creatureId);

    if (hasSprite && creatureId) {
      // Use sprite image
      const sprite = this.add.image(0, 0, creatureId);
      sprite.setScale(0.25); // Scale down from 2048x2048 to ~512px
      sprite.setInteractive({ useHandCursor: true });
      sprite.on('pointerdown', () => {
        this.petCreature();
      });

      this.creature.add([stand, sprite]);

      // Store reference for scaling animations
      this.creatureBody = sprite as unknown as Phaser.GameObjects.Arc;

      console.log(`🎨 Rendered sprite for ${creatureId}`);
    } else {
      // Fallback to placeholder shapes
      this.creatureBody = this.add.circle(0, 0, 60, bodyColor);
      this.creatureBody.setStrokeStyle(3, accentColor);

      const key = this.add.rectangle(50, 0, 12, 40, accentColor);
      const keyHandle = this.add.circle(50, -25, 8, accentColor);
      const spring = this.add.rectangle(0, 30, 20, 40, accentColor);
      const leftEye = this.add.circle(-20, -10, 8, 0x000000);
      const rightEye = this.add.circle(20, -10, 8, 0x000000);
      const highlight1 = this.add.circle(-18, -12, 3, 0xFFFFFF);
      const highlight2 = this.add.circle(22, -12, 3, 0xFFFFFF);

      this.creature.add([stand, this.creatureBody, spring, key, keyHandle, leftEye, rightEye, highlight1, highlight2]);

      // Rotate key slowly (only for placeholder)
      this.tweens.add({
        targets: [key, keyHandle],
        angle: -360,
        duration: 4000,
        repeat: -1,
        ease: 'Linear',
      });

      this.creatureBody.setInteractive({ useHandCursor: true });
      this.creatureBody.on('pointerdown', () => {
        this.petCreature();
      });

      console.log(`⚠️ No sprite found, using placeholder`);
    }

    // Add idle animation (gentle bounce) for whole container
    this.tweens.add({
      targets: this.creature,
      y: y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createStatsUI() {
    const startX = 60;
    const startY = 700;
    const barWidth = 300;
    const barHeight = 30;

    // Hunger label and bar
    this.add.text(startX, startY, 'Hunger:', {
      fontSize: '20px',
      color: '#8B4513',
      fontFamily: 'Arial',
    });

    const hungerBg = this.add.rectangle(startX + 120, startY + 10, barWidth, barHeight, 0xCCCCCC);
    hungerBg.setOrigin(0, 0);

    this.hungerBar = this.add.graphics();
    const initialHunger = this.creatureInstance?.hunger || 80;
    this.updateBar(this.hungerBar, startX + 120, startY + 10, barWidth, barHeight, initialHunger, 0x4CAF50);

    // Happiness label and bar
    this.add.text(startX, startY + 60, 'Happiness:', {
      fontSize: '20px',
      color: '#8B4513',
      fontFamily: 'Arial',
    });

    const happinessBg = this.add.rectangle(startX + 120, startY + 70, barWidth, barHeight, 0xCCCCCC);
    happinessBg.setOrigin(0, 0);

    this.happinessBar = this.add.graphics();
    const initialHappiness = this.creatureInstance?.happiness || 75;
    this.updateBar(this.happinessBar, startX + 120, startY + 70, barWidth, barHeight, initialHappiness, 0xFFEB3B);
  }

  private createActionButtons() {
    const buttonY = 900;
    const buttonWidth = 200;
    const buttonHeight = 70;
    const spacing = 240;
    const centerX = this.cameras.main.width / 2;

    // Feed button
    this.createButton(centerX - spacing / 2, buttonY, buttonWidth, buttonHeight, 'Feed', 0x4CAF50, () => {
      this.feedCreature();
    });

    // Play button
    this.createButton(centerX + spacing / 2, buttonY, buttonWidth, buttonHeight, 'Play', 0xFFEB3B, () => {
      this.playWithCreature();
    });

    // Train button
    this.createButton(centerX - spacing / 2, buttonY + 100, buttonWidth, buttonHeight, 'Train', 0x2196F3, () => {
      this.trainCreature();
    });

    // Status button
    this.createButton(centerX + spacing / 2, buttonY + 100, buttonWidth, buttonHeight, 'Status', 0x9C27B0, () => {
      this.showStatus();
    });
  }

  private createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    color: number,
    callback: () => void
  ) {
    const button = this.add.rectangle(x, y, width, height, color)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y, text, {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerover', () => {
      button.setScale(1.05);
    });

    button.on('pointerout', () => {
      button.setScale(1);
    });

    button.on('pointerdown', () => {
      button.setScale(0.95);
      callback();
    });

    button.on('pointerup', () => {
      button.setScale(1.05);
    });
  }

  private updateBar(graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, value: number, color: number) {
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.fillRect(x, y, (width * value) / 100, height);
  }

  private feedCreature() {
    if (!this.creatureInstance) return;

    CreatureManager.feed(this.creatureInstance, 20);
    this.showFloatingText('+20 Hunger', 0x4CAF50);
    this.bounceCreature();
    this.updateUI();
    this.checkEvolution();
  }

  private playWithCreature() {
    if (!this.creatureInstance) return;

    CreatureManager.play(this.creatureInstance, 15);
    this.showFloatingText('+15 Happiness', 0xFFEB3B);
    this.bounceCreature();
    this.updateUI();
    this.checkEvolution();
  }

  private trainCreature() {
    if (!this.creatureInstance) return;

    // Train strength by default (could rotate between stats)
    CreatureManager.train(this.creatureInstance, 'strength', 2);
    this.showFloatingText('Training! STR +2', 0x2196F3);
    this.bounceCreature();
    this.updateUI();
    this.checkEvolution();
  }

  private showStatus() {
    if (!this.creatureInstance) return;

    console.log('Creature Status:', this.creatureInstance);
    this.showFloatingText('Check console!', 0x9C27B0);
  }

  private petCreature() {
    if (!this.creatureInstance) return;

    CreatureManager.play(this.creatureInstance, 5);
    this.showFloatingText('❤️', 0xFF69B4);
    this.scaleCreature();
    this.updateUI();
  }

  private checkEvolution() {
    if (!this.creatureInstance) return;

    const evolutionTarget = CreatureManager.checkEvolution(this.creatureInstance);

    if (evolutionTarget) {
      // Evolution triggered!
      this.triggerEvolution(evolutionTarget);
    }
  }

  private triggerEvolution(targetId: string) {
    if (!this.creatureInstance) return;

    const oldDefinition = this.currentDefinition;

    // Evolve the creature
    CreatureManager.evolve(this.creatureInstance, targetId);

    // Update current definition
    this.currentDefinition = CreatureDatabase.getCreature(this.creatureInstance.definitionId);

    // Show evolution animation
    this.showEvolutionAnimation(oldDefinition?.name || '???', this.currentDefinition?.name || '???');

    // Recreate creature sprite (if it changed)
    if (this.creature) {
      this.creature.destroy();
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
      this.createPlaceholderCreature(centerX, centerY - 100);
    }

    this.updateUI();
  }

  private showEvolutionAnimation(oldName: string, newName: string) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Flash effect
    const flash = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0xFFFFFF, 0);
    this.tweens.add({
      targets: flash,
      alpha: 0.8,
      duration: 200,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        flash.destroy();
      },
    });

    // Evolution text
    const evolutionText = this.add.text(centerX, centerY, `EVOLUTION!\n\n${oldName}\n↓\n${newName}`, {
      fontSize: '48px',
      color: '#FFD700',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#8B4513',
      strokeThickness: 6,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: evolutionText,
      alpha: 1,
      scale: 1.2,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: evolutionText,
            alpha: 0,
            duration: 500,
            onComplete: () => {
              evolutionText.destroy();
            },
          });
        });
      },
    });
  }

  private bounceCreature() {
    if (!this.creature) return;

    this.tweens.add({
      targets: this.creature,
      y: this.creature.y - 30,
      duration: 200,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
  }

  private scaleCreature() {
    if (!this.creatureBody) return;

    this.tweens.add({
      targets: this.creatureBody,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut',
    });
  }

  private showFloatingText(text: string, color: number) {
    const centerX = this.cameras.main.width / 2;
    const floatingText = this.add.text(centerX, 300, text, {
      fontSize: '28px',
      color: `#${color.toString(16).padStart(6, '0')}`,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: floatingText,
      y: 200,
      alpha: 0,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        floatingText.destroy();
      },
    });
  }
}
