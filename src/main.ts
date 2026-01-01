import Phaser from 'phaser';
import { gameConfig } from './game/config';

// Initialize the game
const game = new Phaser.Game(gameConfig);

// Prevent scrolling on mobile
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

// Log startup
console.log('🎮 Clockwork Menagerie started!');
console.log('📱 Mobile-first pet raising game');

export default game;
