import Phaser from 'phaser';
import { HexRoom, HexCoord, ROOM_CONFIGS, RoomType, RoomEffect } from '../../world/RoomTypes';
import { HexUtils } from '../../world/HexUtils';
import CreatureDatabase from '../../creatures/CreatureDatabase';
import CreatureManager from '../../creatures/CreatureManager';
import { CreatureInstance, Stats } from '../../creatures/types';

export class WorldScene extends Phaser.Scene {
  private hexSize: number = 100;
  private rooms: Map<string, HexRoom> = new Map();
  private roomGraphics: Map<string, Phaser.GameObjects.Container> = new Map();

  private creatures: Map<string, CreatureInstance> = new Map();
  private creatureSprites: Map<string, Phaser.GameObjects.Container> = new Map();

  private worldContainer?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'WorldScene' });
  }

  create() {
    // Create world container for panning/zooming
    this.worldContainer = this.add.container(0, 0);

    // Center camera
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.worldContainer.setPosition(centerX, centerY);

    // Create initial rooms (hardcoded layout for now)
    this.createInitialRooms();

    // Create a starting creature
    const starter = CreatureManager.createInstance('hop_spring', 'Hoppy');
    this.creatures.set(starter.id, starter);

    // Place in play room
    const playRoom = Array.from(this.rooms.values()).find(r => r.config.type === 'play');
    if (playRoom) {
      playRoom.creatureIds.push(starter.id);
      this.createCreatureSprite(starter, playRoom);
    }

    // Render all rooms
    this.renderRooms();

    // UI
    this.createUI();

    // Camera controls (pinch zoom, pan - simplified for now)
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number) => {
      if (this.worldContainer) {
        const zoom = this.worldContainer.scale;
        const newZoom = Phaser.Math.Clamp(zoom - deltaY * 0.001, 0.5, 2);
        this.worldContainer.setScale(newZoom);
      }
    });

    // Start room effect timers
    this.startRoomEffects();

    console.log('🏠 World created with hexagonal rooms!');
  }

  private createInitialRooms() {
    // Create a simple layout
    // Row 0: Play room, Cafeteria
    // Row 1: Gym, Track (2 hexes), Library
    // Row 2: Medical, Bedroom

    const layout: Array<{ coord: HexCoord; type: RoomType }> = [
      // Row 0
      { coord: { q: 0, r: 0 }, type: 'play' },
      { coord: { q: 1, r: 0 }, type: 'cafeteria' },

      // Row 1
      { coord: { q: -1, r: 1 }, type: 'gym' },
      { coord: { q: 0, r: 1 }, type: 'track' },
      { coord: { q: 1, r: 1 }, type: 'track' },
      { coord: { q: 2, r: 1 }, type: 'library' },

      // Row 2
      { coord: { q: 0, r: 2 }, type: 'medical' },
      { coord: { q: 1, r: 2 }, type: 'bedroom' },
    ];

    layout.forEach(({ coord, type }) => {
      const room: HexRoom = {
        coord,
        config: ROOM_CONFIGS[type],
        creatureIds: [],
      };
      this.rooms.set(this.coordToKey(coord), room);
    });
  }

  private renderRooms() {
    this.rooms.forEach((room, key) => {
      const container = this.createRoomGraphics(room);
      this.roomGraphics.set(key, container);
      if (this.worldContainer) {
        this.worldContainer.add(container);
      }
    });
  }

  private createRoomGraphics(room: HexRoom): Phaser.GameObjects.Container {
    const pos = HexUtils.hexToPixel(room.coord, this.hexSize);
    const container = this.add.container(pos.x, pos.y);

    // Draw hexagon
    const hex = this.add.graphics();
    hex.fillStyle(room.config.color, 0.6);
    hex.lineStyle(4, room.config.accentColor, 1);

    const corners = HexUtils.getHexagonCorners(this.hexSize);
    hex.beginPath();
    hex.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) {
      hex.lineTo(corners[i].x, corners[i].y);
    }
    hex.closePath();
    hex.fillPath();
    hex.strokePath();

    // Room label
    const label = this.add.text(0, -20, room.config.name, {
      fontSize: '14px',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    // Room icon/emoji
    const icon = this.getRoomIcon(room.config.type);
    const iconText = this.add.text(0, 10, icon, {
      fontSize: '32px',
    }).setOrigin(0.5);

    container.add([hex, label, iconText]);

    // Make room interactive
    hex.setInteractive(new Phaser.Geom.Polygon(corners), Phaser.Geom.Polygon.Contains);
    hex.on('pointerdown', () => {
      this.onRoomClick(room);
    });

    return container;
  }

  private getRoomIcon(type: RoomType): string {
    const icons: Record<RoomType, string> = {
      play: '🎮',
      cafeteria: '🍽️',
      medical: '🏥',
      track: '🏃',
      library: '📚',
      gym: '💪',
      bedroom: '🛏️',
      empty: '❓',
    };
    return icons[type] || '?';
  }

  private createCreatureSprite(creature: CreatureInstance, room: HexRoom): void {
    const definition = CreatureDatabase.getCreature(creature.definitionId);
    if (!definition) return;

    const roomPos = HexUtils.hexToPixel(room.coord, this.hexSize);
    const container = this.add.container(roomPos.x, roomPos.y);

    // Check if sprite exists
    const hasSprite = definition.sprite && this.textures.exists(definition.id);

    if (hasSprite) {
      const sprite = this.add.image(0, 0, definition.id);
      sprite.setScale(0.1); // Small in world view
      container.add(sprite);
    } else {
      // Fallback circle
      const circle = this.add.circle(0, 0, 20, definition.color);
      circle.setStrokeStyle(2, definition.accentColor);
      container.add(circle);
    }

    // Store sprite
    this.creatureSprites.set(creature.id, container);

    if (this.worldContainer) {
      this.worldContainer.add(container);
    }

    // Start wandering animation
    this.startCreatureWandering(creature.id, room);
  }

  private startCreatureWandering(creatureId: string, room: HexRoom) {
    const sprite = this.creatureSprites.get(creatureId);
    if (!sprite) return;

    const roomPos = HexUtils.hexToPixel(room.coord, this.hexSize);
    const wanderRadius = this.hexSize * 0.6; // Stay within hex

    // Random wander within room
    const wander = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * wanderRadius;
      const targetX = roomPos.x + Math.cos(angle) * distance;
      const targetY = roomPos.y + Math.sin(angle) * distance;

      this.tweens.add({
        targets: sprite,
        x: targetX,
        y: targetY,
        duration: 2000 + Math.random() * 2000,
        ease: 'Sine.easeInOut',
        onComplete: wander,
      });
    };

    wander();
  }

  private onRoomClick(room: HexRoom) {
    console.log(`Clicked: ${room.config.name}`, room);

    // Show room info
    this.showRoomInfo(room);
  }

  private showRoomInfo(room: HexRoom) {
    // TODO: Show a UI panel with room details
    const creatures = room.creatureIds.map(id => this.creatures.get(id)).filter(Boolean);
    console.log(`Room: ${room.config.name}`);
    console.log(`Creatures: ${creatures.length}`);
    console.log(`Effects:`, room.config.effects);
  }

  private createUI() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Back button
    const backButton = this.add.text(20, 20, '← Menu', {
      fontSize: '20px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F5DEB3',
      padding: { x: 10, y: 5 },
    }).setInteractive({ useHandCursor: true });

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Title
    this.add.text(width / 2, 30, 'Creature World', {
      fontSize: '24px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      backgroundColor: '#F5DEB3',
      padding: { x: 15, y: 8 },
    }).setOrigin(0.5);

    // Instructions
    this.add.text(width / 2, height - 30,
      'Tap rooms to view | Scroll to zoom', {
      fontSize: '14px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F5DEB3AA',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);
  }

  private startRoomEffects() {
    // Apply room effects periodically
    this.rooms.forEach(room => {
      room.config.effects.forEach(effect => {
        if (effect.interval) {
          this.time.addEvent({
            delay: effect.interval,
            callback: () => this.applyRoomEffect(room, effect),
            loop: true,
          });
        }
      });
    });
  }

  private applyRoomEffect(room: HexRoom, effect: RoomEffect) {
    // Apply effect to all creatures in room
    room.creatureIds.forEach(creatureId => {
      const creature = this.creatures.get(creatureId);
      if (!creature) return;

      switch (effect.type) {
        case 'stat_gain':
          if (effect.stat) {
            const statKey = effect.stat as keyof Stats;
            creature.currentStats[statKey] += effect.amount;
            console.log(`🏠 ${room.config.name}: ${effect.stat} +${effect.amount}`);
          }
          break;
        case 'auto_feed':
          CreatureManager.feed(creature, effect.amount);
          break;
        case 'heal':
          creature.currentStats.stamina += effect.amount;
          break;
        case 'happiness':
          CreatureManager.play(creature, effect.amount);
          break;
      }

      // Check evolution
      const evolutionTarget = CreatureManager.checkEvolution(creature);
      if (evolutionTarget) {
        this.evolveCreature(creature, evolutionTarget);
      }
    });
  }

  private evolveCreature(creature: CreatureInstance, targetId: string) {
    console.log(`Evolution in room!`);
    CreatureManager.evolve(creature, targetId);

    // Update sprite
    const sprite = this.creatureSprites.get(creature.id);
    if (sprite) {
      sprite.destroy();
      const room = Array.from(this.rooms.values()).find(r => r.creatureIds.includes(creature.id));
      if (room) {
        this.createCreatureSprite(creature, room);
      }
    }
  }

  private coordToKey(coord: HexCoord): string {
    return `${coord.q},${coord.r}`;
  }

  update() {
    // Update creatures age
    this.creatures.forEach(creature => {
      CreatureManager.updateAge(creature);
    });
  }
}
