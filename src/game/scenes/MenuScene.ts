import Phaser from 'phaser';
import GameData from '../../creatures/GameData';
import CreatureDatabase from '../../creatures/CreatureDatabase';
import { BUILD_INFO } from '../../buildInfo';

export class MenuScene extends Phaser.Scene {
  private debugToggle?: Phaser.GameObjects.Text;
  private uiElements: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.buildUI();

    // Listen for resize events
    this.scale.on('resize', this.handleResize, this);
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.cameras.main.setSize(gameSize.width, gameSize.height);
    this.buildUI();
  }

  private buildUI() {
    // Clear old UI
    this.uiElements.forEach(element => element.destroy());
    this.uiElements = [];

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background color already set in config

    // Title
    const title = this.add.text(centerX, Math.max(100, centerY - 300), '⚙️ CLOCKWORK MENAGERIE ⚙️', {
      fontSize: '42px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(centerX, Math.max(160, centerY - 240), 'Raise Your Bio-Mechanical Companions', {
      fontSize: '20px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
    }).setOrigin(0.5);

    this.uiElements.push(title, subtitle);

    // Create a simple button-like rectangle
    const buttonWidth = 300;
    const buttonHeight = 80;
    const buttonY = Math.max(centerY, centerY + 100);

    // Start button background
    const startButtonBg = this.add.rectangle(
      centerX,
      buttonY,
      buttonWidth,
      buttonHeight,
      0xD4A574
    ).setInteractive({ useHandCursor: true });

    // Start button text
    const startButtonText = this.add.text(centerX, buttonY, 'START GAME', {
      fontSize: '32px',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.uiElements.push(startButtonBg, startButtonText);

    // Button hover effect
    startButtonBg.on('pointerover', () => {
      startButtonBg.setFillStyle(0xE5B684);
    });

    startButtonBg.on('pointerout', () => {
      startButtonBg.setFillStyle(0xD4A574);
    });

    // Button click
    startButtonBg.on('pointerdown', () => {
      startButtonBg.setFillStyle(0xC39564);
    });

    startButtonBg.on('pointerup', () => {
      console.log('🏠 Starting world view...');
      this.scene.start('WorldScene');
    });

    // Collection button
    const collectionButtonBg = this.add.rectangle(
      centerX,
      buttonY + 100,
      buttonWidth,
      buttonHeight,
      0x9C27B0
    ).setInteractive({ useHandCursor: true });

    const collectionButtonText = this.add.text(centerX, buttonY + 100, '📚 COLLECTION', {
      fontSize: '32px',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.uiElements.push(collectionButtonBg, collectionButtonText);

    collectionButtonBg.on('pointerover', () => {
      collectionButtonBg.setFillStyle(0xAB47BC);
    });

    collectionButtonBg.on('pointerout', () => {
      collectionButtonBg.setFillStyle(0x9C27B0);
    });

    collectionButtonBg.on('pointerdown', () => {
      collectionButtonBg.setFillStyle(0x8E24AA);
    });

    collectionButtonBg.on('pointerup', () => {
      console.log('📚 Opening collection...');
      this.scene.start('CollectionScene');
    });

    // Debug toggle (top-right corner)
    this.debugToggle = this.add.text(
      this.cameras.main.width - 20,
      20,
      `🐛 ${GameData.debugMode ? 'ON' : 'OFF'}`,
      {
        fontSize: '20px',
        color: GameData.debugMode ? '#FF0000' : '#888888',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
      }
    ).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    this.debugToggle.on('pointerdown', () => {
      const newMode = GameData.toggleDebugMode();
      if (this.debugToggle) {
        this.debugToggle.setText(`🐛 ${newMode ? 'ON' : 'OFF'}`);
        this.debugToggle.setColor(newMode ? '#FF0000' : '#888888');
      }
    });

    // Creature count
    const totalCreatures = CreatureDatabase.getAllCreatures().length;
    const creatureCount = this.add.text(centerX, Math.max(200, centerY - 180), `${totalCreatures} creatures to discover!`, {
      fontSize: '18px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    // Version info
    const versionInfo = this.add.text(20, this.cameras.main.height - 50, 'v0.1.0 - Alpha', {
      fontSize: '16px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
    });

    // Build timestamp
    const buildDate = new Date(BUILD_INFO.timestamp);
    const buildTimeStr = buildDate.toLocaleString();
    const buildTimestamp = this.add.text(20, this.cameras.main.height - 30, `Built: ${buildTimeStr}`, {
      fontSize: '14px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
    });

    // Instructions
    const instructions = this.add.text(centerX, this.cameras.main.height - 100,
      'Mobile-first design\nTap to interact', {
      fontSize: '18px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
    }).setOrigin(0.5);

    this.uiElements.push(this.debugToggle, creatureCount, versionInfo, buildTimestamp, instructions);
  }
}
