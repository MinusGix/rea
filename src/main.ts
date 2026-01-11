import Phaser from 'phaser';
import { gameConfig } from './game/config';

// Initialize the game
const game = new Phaser.Game(gameConfig);

// Prevent scrolling on mobile
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

// Force scale manager refresh on orientation change (mobile fix)
window.addEventListener('orientationchange', () => {
  console.log('🔄 Orientation changed! Refreshing scale manager...');
  setTimeout(() => {
    game.scale.refresh();
  }, 100); // Small delay to let browser finish rotating
});

// Also listen to resize events as backup
window.addEventListener('resize', () => {
  console.log('📐 Window resized! Refreshing scale manager...');
  game.scale.refresh();
});

// Log startup
console.log('🎮 Clockwork Menagerie started!');
console.log('📱 Mobile-first pet raising game');

export default game;
