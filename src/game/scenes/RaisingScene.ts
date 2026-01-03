import Phaser from 'phaser';

export class RaisingScene extends Phaser.Scene {
  private creature?: Phaser.GameObjects.Container;
  private creatureBody?: Phaser.GameObjects.Arc;
  private hungerBar?: Phaser.GameObjects.Graphics;
  private happinessBar?: Phaser.GameObjects.Graphics;
  private hunger: number = 80;
  private happiness: number = 75;

  constructor() {
    super({ key: 'RaisingScene' });
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Title
    this.add.text(centerX, 60, 'Your Creature', {
      fontSize: '28px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Create placeholder creature (Hop Spring baby form)
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

    // Creature name
    this.add.text(centerX, centerY + 150, 'Hop Spring', {
      fontSize: '32px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 190, 'Age: 0 days | Stage: Baby', {
      fontSize: '18px',
      color: '#A0826D',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);
  }

  private createPlaceholderCreature(x: number, y: number) {
    // Container for creature parts
    this.creature = this.add.container(x, y);

    // Plastic stand (translucent)
    const stand = this.add.ellipse(0, 100, 120, 30, 0xFFD700, 0.4);
    stand.setStrokeStyle(2, 0xDAA520, 0.6);

    // Creature body (brass colored circle representing mechanical frog)
    this.creatureBody = this.add.circle(0, 0, 60, 0xB8860B);
    this.creatureBody.setStrokeStyle(3, 0x8B6914);

    // Wind-up key on back
    const key = this.add.rectangle(50, 0, 12, 40, 0x8B6914);
    const keyHandle = this.add.circle(50, -25, 8, 0x8B6914);

    // Simple spring (copper colored)
    const spring = this.add.rectangle(0, 30, 20, 40, 0xD2691E);

    // Eyes
    const leftEye = this.add.circle(-20, -10, 8, 0x000000);
    const rightEye = this.add.circle(20, -10, 8, 0x000000);

    // Highlight dots (to show it's mechanical)
    const highlight1 = this.add.circle(-18, -12, 3, 0xFFFFFF);
    const highlight2 = this.add.circle(22, -12, 3, 0xFFFFFF);

    // Add all to container
    this.creature.add([stand, this.creatureBody, spring, key, keyHandle, leftEye, rightEye, highlight1, highlight2]);

    // Add idle animation (gentle bounce)
    this.tweens.add({
      targets: this.creature,
      y: y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Rotate key slowly
    this.tweens.add({
      targets: [key, keyHandle],
      angle: -360,
      duration: 4000,
      repeat: -1,
      ease: 'Linear',
    });

    // Make creature interactive
    this.creatureBody.setInteractive({ useHandCursor: true });
    this.creatureBody.on('pointerdown', () => {
      this.petCreature();
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
    this.updateBar(this.hungerBar, startX + 120, startY + 10, barWidth, barHeight, this.hunger, 0x4CAF50);

    // Happiness label and bar
    this.add.text(startX, startY + 60, 'Happiness:', {
      fontSize: '20px',
      color: '#8B4513',
      fontFamily: 'Arial',
    });

    const happinessBg = this.add.rectangle(startX + 120, startY + 70, barWidth, barHeight, 0xCCCCCC);
    happinessBg.setOrigin(0, 0);

    this.happinessBar = this.add.graphics();
    this.updateBar(this.happinessBar, startX + 120, startY + 70, barWidth, barHeight, this.happiness, 0xFFEB3B);
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
    this.hunger = Math.min(100, this.hunger + 20);
    if (this.hungerBar) {
      this.updateBar(this.hungerBar, 180, 710, 300, 30, this.hunger, 0x4CAF50);
    }
    this.showFloatingText('+20 Hunger', 0x4CAF50);
    this.bounceCreature();
  }

  private playWithCreature() {
    this.happiness = Math.min(100, this.happiness + 15);
    if (this.happinessBar) {
      this.updateBar(this.happinessBar, 180, 770, 300, 30, this.happiness, 0xFFEB3B);
    }
    this.showFloatingText('+15 Happiness', 0xFFEB3B);
    this.bounceCreature();
  }

  private trainCreature() {
    this.showFloatingText('Training! +STR', 0x2196F3);
    this.bounceCreature();
  }

  private showStatus() {
    console.log('Status:', { hunger: this.hunger, happiness: this.happiness });
    this.showFloatingText('Check console!', 0x9C27B0);
  }

  private petCreature() {
    this.happiness = Math.min(100, this.happiness + 5);
    if (this.happinessBar) {
      this.updateBar(this.happinessBar, 180, 770, 300, 30, this.happiness, 0xFFEB3B);
    }
    this.showFloatingText('❤️', 0xFF69B4);
    this.scaleCreature();
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
