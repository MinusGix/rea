# Clockwork Menagerie ⚙️

A mobile-first bio-mechanical pet raising game inspired by Digimon World Championship.

## 🎮 Play Now

**Live Demo**: Will be available at `https://<username>.github.io/rea/` after first deployment

## 📱 Phone Testing Workflow

This project is designed for **phone-first development**:

1. **Make changes** (via Claude or direct code edits)
2. **Commit & push** to any branch
3. **Wait ~1 minute** for GitHub Actions to build
4. **Open on your phone**: Visit the GitHub Pages URL
5. **Test immediately** in your mobile browser

No app installation needed! Just refresh the page to see new changes.

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000 on your phone (same network)
```

### Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Current Features (v0.1.0)

- ✅ Basic menu system
- ✅ Simple creature rendering (Hop Spring placeholder)
- ✅ Interaction system (tap to pet)
- ✅ Feed, Play, Train actions
- ✅ Hunger & Happiness stats
- ✅ Mobile-optimized touch controls
- ✅ Auto-deployment pipeline

## 🔮 Planned Features

### Core Gameplay
- [ ] Full creature data system
- [ ] Evolution system (stat-based, care-based, event-based)
- [ ] Multiple creature families (Spring, Steam, Hydro, Electric, Pneumatic)
- [ ] Merging evolution paths with variants
- [ ] Save/load system (LocalStorage)
- [ ] Time-based progression (age, hunger decay)

### Creatures
- [ ] 5+ evolution families
- [ ] 50+ total creatures
- [ ] Sprite-based artwork with cardboard aesthetic
- [ ] Mesh deformation animations
- [ ] Particle effects (steam, sparks, water)

### Features
- [ ] Collection screen
- [ ] Achievement system
- [ ] Battle system (side activity)
- [ ] Training mini-games
- [ ] Creature roster (5-6 active creatures)
- [ ] Cloud save sync (optional)

### Polish
- [ ] Sound effects
- [ ] Background music
- [ ] Cardboard texture shaders
- [ ] Plastic stand rendering
- [ ] UI improvements
- [ ] PWA support (offline play, home screen install)

## 🏗️ Project Structure

```
rea/
├── .github/workflows/    # CI/CD automation
├── src/
│   ├── main.ts          # Entry point
│   ├── game/
│   │   ├── config.ts    # Phaser configuration
│   │   └── scenes/      # Game scenes
│   ├── creatures/       # Creature system (planned)
│   ├── ui/              # UI components (planned)
│   └── data/            # Game data (planned)
├── public/              # Static assets
└── dist/                # Build output (auto-generated)
```

## 🎨 Design Documents

- **GAME_DESIGN.md** - Overall game design and mechanics
- **CREATURE_DESIGNS.md** - Detailed creature evolution families
- **TECHNICAL_ARCHITECTURE.md** - Technical decisions and architecture

## 🧪 Tech Stack

- **Game Engine**: Phaser 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Deployment**: GitHub Pages (auto-deploy)
- **Storage**: LocalStorage (browser-based saves)

## 📝 Development Workflow

### Adding New Features

1. Create/modify files in `src/`
2. Test locally with `npm run dev`
3. Commit changes
4. Push to trigger auto-deployment
5. Test on phone via GitHub Pages URL

### Quick Iteration

```bash
# Option 1: Test locally on phone (same WiFi)
npm run dev
# Visit http://<your-computer-ip>:3000 on phone

# Option 2: Push and use deployed version
git add .
git commit -m "feature: add XYZ"
git push
# Wait ~1 min, then refresh GitHub Pages URL on phone
```

## 🐛 Known Issues

- [ ] No actual creature sprites yet (using placeholder shapes)
- [ ] Stats don't persist (no save system)
- [ ] No time-based mechanics
- [ ] Evolution system not implemented

## 📄 License

ISC

## 🚀 Next Steps

1. Implement creature data system
2. Add sprite rendering (generated AI art)
3. Build evolution logic
4. Create save/load system
5. Add more creature families

---

**Built with 💙 for mobile-first pet raising**
