import Phaser from 'phaser';
import CreatureDatabase from '../../creatures/CreatureDatabase';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading text
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const loadingText = this.add.text(centerX, centerY, 'Loading...', {
      fontSize: '32px',
      color: '#8B4513',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // Progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x8B4513, 0.3);
    progressBox.fillRect(centerX - 160, centerY + 50, 320, 30);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xD4A574, 1);
      progressBar.fillRect(centerX - 150, centerY + 55, 300 * value, 20);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load creature sprites
    const basePath = 'assets/sprites/';
    const creatures = CreatureDatabase.getAllCreatures();

    creatures.forEach(creature => {
      if (creature.sprite) {
        this.load.image(creature.id, basePath + creature.sprite);
      }
    });

    console.log(`🎨 Loading ${creatures.filter(c => c.sprite).length} creature sprites...`);
  }

  create() {
    console.log('⚙️ Boot complete, starting menu...');
    this.scene.start('MenuScene');
  }
}
