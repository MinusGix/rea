import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background color already set in config

    // Title
    this.add.text(centerX, centerY - 300, '⚙️ CLOCKWORK MENAGERIE ⚙️', {
      fontSize: '42px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, centerY - 240, 'Raise Your Bio-Mechanical Companions', {
      fontSize: '20px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
    }).setOrigin(0.5);

    // Create a simple button-like rectangle
    const buttonWidth = 300;
    const buttonHeight = 80;
    const buttonY = centerY + 100;

    // Start button background
    const startButtonBg = this.add.rectangle(
      centerX,
      buttonY,
      buttonWidth,
      buttonHeight,
      0xD4A574
    ).setInteractive({ useHandCursor: true });

    // Start button text
    this.add.text(centerX, buttonY, 'START GAME', {
      fontSize: '32px',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

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
      console.log('🎮 Starting game...');
      this.scene.start('RaisingScene');
    });

    // Version info
    this.add.text(20, this.cameras.main.height - 30, 'v0.1.0 - Alpha', {
      fontSize: '16px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
    });

    // Instructions
    this.add.text(centerX, this.cameras.main.height - 100,
      'Mobile-first design\nTap to interact', {
      fontSize: '18px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
    }).setOrigin(0.5);
  }
}
