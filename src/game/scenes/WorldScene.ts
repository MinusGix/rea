import Phaser from 'phaser';
import { HexRoom, HexCoord, ROOM_CONFIGS, RoomType, RoomEffect } from '../../world/RoomTypes';
import { HexUtils } from '../../world/HexUtils';
import CreatureDatabase from '../../creatures/CreatureDatabase';
import CreatureManager from '../../creatures/CreatureManager';
import { CreatureInstance, Stats } from '../../creatures/types';

export class WorldScene extends Phaser.Scene {
  private hexSize: number = 60;  // Base hex size
  private rooms: Map<string, HexRoom> = new Map();
  private roomGraphics: Map<string, Phaser.GameObjects.Container> = new Map();

  private creatures: Map<string, CreatureInstance> = new Map();
  private creatureSprites: Map<string, Phaser.GameObjects.Container> = new Map();

  private worldContainer?: Phaser.GameObjects.Container;

  // Drag-and-drop state
  private draggedCreature?: { creatureId: string; originalRoom: HexRoom; sprite: Phaser.GameObjects.Container };
  private originalScale: number = 1;
  private dragScale: number = 1.3;  // Scale up when picked up

  constructor() {
    super({ key: 'WorldScene' });
  }

  create() {
    // Create world container for panning/zooming
    this.worldContainer = this.add.container(0, 0);

    // Create initial rooms (hardcoded layout for now)
    this.createInitialRooms();

    // Render all rooms FIRST
    this.renderRooms();

    // Create test creatures AFTER rooms (so they render on top)
    const testCreatures = [
      { id: 'hop_spring', name: 'Hoppy', roomType: 'play' as RoomType },
      { id: 'hop_spring', name: 'Bouncer', roomType: 'gym' as RoomType },
      { id: 'hop_spring', name: 'Chompy', roomType: 'cafeteria' as RoomType },
      { id: 'hop_spring', name: 'Sleepy', roomType: 'bedroom' as RoomType },
      { id: 'hop_spring', name: 'Speedy', roomType: 'track' as RoomType },
    ];

    testCreatures.forEach(({ id, name, roomType }) => {
      const creature = CreatureManager.createInstance(id, name);
      this.creatures.set(creature.id, creature);

      // Find and place in appropriate room
      const targetRoom = Array.from(this.rooms.values()).find(r => r.config.type === roomType);
      if (targetRoom) {
        targetRoom.creatureIds.push(creature.id);
        this.createCreatureSprite(creature, targetRoom);
      }
    });

    // UI
    this.createUI();

    // Position and scale world to fit
    this.resizeWorld();

    // Listen for orientation changes
    this.scale.on('resize', this.handleResize, this);

    // Camera controls (pinch zoom, pan - simplified for now)
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number) => {
      if (this.worldContainer) {
        const zoom = this.worldContainer.scale;
        const newZoom = Phaser.Math.Clamp(zoom - deltaY * 0.001, 0.3, 2);
        this.worldContainer.setScale(newZoom);
      }
    });

    // Start room effect timers
    this.startRoomEffects();

    console.log('🏠 World created with hexagonal rooms!');
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    console.log('📱 Orientation change detected:', gameSize.width, 'x', gameSize.height);

    // Recenter and rescale world
    this.resizeWorld();
  }

  private resizeWorld() {
    if (!this.worldContainer) return;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Center the world container
    this.worldContainer.setPosition(width / 2, height / 2);

    // Calculate zoom to fit all rooms on screen
    // Room layout spans roughly:
    // q: -1 to 2 (4 hexes wide)
    // r: 0 to 2 (3 hexes tall)
    const hexWidth = this.hexSize * Math.sqrt(3);
    const hexHeight = this.hexSize * 2;

    const worldWidth = hexWidth * 4.5;
    const worldHeight = hexHeight * 3;

    // Calculate scale to fit tightly (0.95 = fill 95% of screen)
    const scaleX = (width * 0.95) / worldWidth;
    const scaleY = (height * 0.95) / worldHeight;
    const scale = Math.min(scaleX, scaleY);

    this.worldContainer.setScale(scale);
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

    let interactiveObject: Phaser.GameObjects.GameObject;

    if (hasSprite) {
      const sprite = this.add.image(0, 0, definition.id);
      sprite.setScale(0.03); // Much smaller for tight fit
      container.add(sprite);
      interactiveObject = sprite;
    } else {
      // Fallback circle
      const circle = this.add.circle(0, 0, 8, definition.color);
      circle.setStrokeStyle(1, definition.accentColor);
      container.add(circle);
      interactiveObject = circle;
    }

    // Set depth to render above rooms
    container.setDepth(10);

    // Make interactive for drag-and-drop
    interactiveObject.setInteractive({ useHandCursor: true, draggable: true });

    // Store sprite
    this.creatureSprites.set(creature.id, container);

    if (this.worldContainer) {
      this.worldContainer.add(container);
    }

    // Add drag handlers
    this.setupCreatureDragHandlers(creature.id, container, room);

    // Start wandering animation
    this.startCreatureWandering(creature.id, room);
  }

  private setupCreatureDragHandlers(creatureId: string, container: Phaser.GameObjects.Container, room: HexRoom) {
    const interactiveChild = container.list.find(obj => obj.input?.enabled) as Phaser.GameObjects.GameObject;
    if (!interactiveChild) return;

    // Store original room for this creature
    let currentRoom = room;

    interactiveChild.on('dragstart', (_pointer: Phaser.Input.Pointer) => {
      // Stop wandering animation
      this.tweens.killTweensOf(container);

      // Scale up to bring "closer to camera"
      container.setScale(this.dragScale);
      container.setDepth(1000); // Bring to front

      // Store drag state
      this.draggedCreature = {
        creatureId,
        originalRoom: currentRoom,
        sprite: container,
      };

      console.log(`Picked up ${creatureId} from ${currentRoom.config.name}`);
    });

    interactiveChild.on('drag', (pointer: Phaser.Input.Pointer) => {
      // Use pointer's world coordinates, adjusted for worldContainer position
      if (this.worldContainer) {
        // Pointer world coords are relative to camera, convert to worldContainer local coords
        const localX = (pointer.worldX - this.worldContainer.x) / this.worldContainer.scaleX;
        const localY = (pointer.worldY - this.worldContainer.y) / this.worldContainer.scaleY;

        container.setPosition(localX, localY);
      }
    });

    interactiveChild.on('dragend', (_pointer: Phaser.Input.Pointer) => {
      if (!this.draggedCreature) return;

      // Check if dropped over a valid room
      const targetRoom = this.getRoomAtPosition(container.x, container.y);

      if (targetRoom) {
        // Move creature to new room
        this.moveCreatureToRoom(creatureId, currentRoom, targetRoom);
        currentRoom = targetRoom;

        // Snap to room center and resume wandering
        container.setScale(this.originalScale);
        container.setDepth(0);
        this.startCreatureWandering(creatureId, targetRoom);

        console.log(`Moved ${creatureId} to ${targetRoom.config.name}`);
      } else {
        // Tumble back to original room
        this.tumbleBackToRoom(container, currentRoom);
        console.log(`${creatureId} tumbled back to ${currentRoom.config.name}`);
      }

      // Clear drag state
      this.draggedCreature = undefined;
    });
  }

  private getRoomAtPosition(x: number, y: number): HexRoom | undefined {
    // Convert position to hex coordinate
    const hexCoord = HexUtils.pixelToHex(x, y, this.hexSize);

    // Find room at this coordinate
    const roomKey = this.coordToKey(hexCoord);
    return this.rooms.get(roomKey);
  }

  private moveCreatureToRoom(creatureId: string, fromRoom: HexRoom, toRoom: HexRoom) {
    // Remove from old room
    const index = fromRoom.creatureIds.indexOf(creatureId);
    if (index > -1) {
      fromRoom.creatureIds.splice(index, 1);
    }

    // Add to new room
    if (!toRoom.creatureIds.includes(creatureId)) {
      toRoom.creatureIds.push(creatureId);
    }
  }

  private tumbleBackToRoom(container: Phaser.GameObjects.Container, room: HexRoom) {
    const roomPos = HexUtils.hexToPixel(room.coord, this.hexSize);

    // Tumbling animation - spin and move back
    this.tweens.add({
      targets: container,
      x: roomPos.x,
      y: roomPos.y,
      angle: container.angle + 360, // Full rotation
      scale: this.originalScale,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        container.setDepth(0);
        container.setAngle(0); // Reset rotation
        // Resume wandering
        const creature = this.creatures.get(this.draggedCreature?.creatureId || '');
        if (creature) {
          this.startCreatureWandering(this.draggedCreature?.creatureId || '', room);
        }
      },
    });
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
    }).setInteractive({ useHandCursor: true })
    .setScrollFactor(0)
    .setDepth(1000);

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
    }).setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1000);

    // Instructions
    this.add.text(width / 2, height - 30,
      'Tap & drag creatures | Scroll to zoom', {
      fontSize: '14px',
      color: '#8B4513',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F5DEB3AA',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(1000);
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
