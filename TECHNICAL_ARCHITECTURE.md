# Technical Architecture - Phone-First Development

## Core Requirement: Phone-Based Development Workflow

**Goal**: Develop during class downtime on phone → Ask Claude to implement → Test quickly on phone

### Workflow
1. **On phone**: Message Claude with feature request
2. **Claude**: Implements code, commits, pushes
3. **GitHub Actions**: Auto-builds and deploys
4. **On phone**: Test via web browser immediately
5. **Iterate**: Report bugs, request changes, repeat

---

## Technology Stack Decision

### Option 1: Phaser.js (Recommended) ⭐

**Why Phaser:**
- Pure JavaScript/TypeScript - works in any browser
- Excellent 2D game framework with built-in physics
- Great documentation and examples
- Easy to test on phone browsers
- No compilation needed (or fast Vite build)
- WebGL + Canvas support

**Stack:**
```
Frontend: Phaser 3 + TypeScript + Vite
State Management: Zustand or simple game state classes
Storage: LocalStorage for saves (+ optional cloud sync)
Deployment: GitHub Pages (instant, free)
Build: Vite (fast builds < 10 seconds)
```

**Pros:**
- Fastest iteration cycle
- Works on ANY device with a browser
- No app store approvals
- Easy debugging with browser dev tools
- Can add PWA support later for "app-like" feel

**Cons:**
- Limited to web (but can wrap with Capacitor later for app stores)
- Performance not as good as native (but fine for 2D)

---

### Option 2: Godot with Web Export

**Why Godot:**
- Free and open-source
- Built-in animation tools
- GDScript is Python-like (easy)
- Can export to web (HTML5)
- Can also export to mobile apps later

**Stack:**
```
Engine: Godot 4.x
Language: GDScript (or C# if you prefer)
Deployment: GitHub Pages (HTML5 export)
Build: Godot headless build in GitHub Actions
```

**Pros:**
- More "game engine" features built-in
- Easier visual scene editing
- Can export to mobile apps natively

**Cons:**
- Longer build times (need to export in CI)
- Harder to debug on phone (no browser dev tools)
- Godot web exports can be large (60MB+ initial load)
- Less iterative for phone testing

---

## Recommended Choice: **Phaser.js + TypeScript + Vite**

### Why This is Best for Phone Development:
1. **Instant testing**: Push code → GitHub Actions builds in 30 sec → refresh phone browser
2. **Browser dev tools**: Can debug right on phone (Chrome mobile dev tools)
3. **No export step**: Direct JavaScript runs immediately
4. **Small bundle size**: ~2MB initial load
5. **TypeScript**: Type safety while keeping fast iteration

---

## Project Structure

```
rea/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Auto-deploy to GitHub Pages
├── src/
│   ├── main.ts                 # Entry point
│   ├── game/
│   │   ├── Game.ts             # Main game class
│   │   ├── scenes/
│   │   │   ├── MenuScene.ts
│   │   │   ├── RaisingScene.ts # Main creature care scene
│   │   │   ├── BattleScene.ts
│   │   │   └── CollectionScene.ts
│   │   └── config.ts           # Phaser config
│   ├── creatures/
│   │   ├── Creature.ts         # Base creature class
│   │   ├── CreatureData.ts     # Creature definitions
│   │   ├── Evolution.ts        # Evolution system
│   │   └── stats.ts            # Stat calculations
│   ├── ui/
│   │   ├── Card.ts             # Stat card UI
│   │   ├── Button.ts
│   │   └── Menu.ts
│   ├── data/
│   │   ├── creatures.json      # Creature database
│   │   └── evolutions.json     # Evolution tree data
│   └── assets/
│       ├── sprites/            # Creature images
│       ├── ui/                 # UI elements
│       └── sounds/             # Sound effects
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Development Workflow Details

### Step 1: Initial Setup (One-time)

```bash
# Initialize Node project
npm init -y

# Install dependencies
npm install phaser
npm install -D vite typescript @types/node

# Configure TypeScript
# Configure Vite
# Set up GitHub Actions workflow
```

### Step 2: GitHub Actions Auto-Deploy

**`.github/workflows/deploy.yml`**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, claude/* ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Result**: Every push auto-deploys to `https://<username>.github.io/rea/`

### Step 3: Mobile Testing Workflow

1. **Make code changes** (Claude implements feature)
2. **Commit & Push** to branch
3. **Wait ~30-60 seconds** for GitHub Actions
4. **Open on phone**: `https://<username>.github.io/rea/`
5. **Test immediately**
6. **Report issues** via phone to Claude

---

## Data Architecture

### Save System
```typescript
interface SaveData {
  version: string;
  creatures: {
    id: string;
    name: string;
    type: string;
    stats: Stats;
    age: number; // in hours
    evolution_stage: number;
    last_fed: timestamp;
    last_trained: timestamp;
    happiness: number;
  }[];
  inventory: Item[];
  player_stats: {
    total_raised: number;
    achievements: string[];
  };
}
```

**Storage**:
- **Primary**: LocalStorage (instant, offline)
- **Backup** (optional later): Cloud save via simple API

### Creature Data Format

```typescript
interface CreatureDefinition {
  id: string; // "hop_spring_001"
  name: string; // "Hop Spring"
  type: "clockwork" | "steam" | "hydro" | "electric" | "pneumatic";
  stage: 1 | 2 | 3 | 4 | 5;
  base_stats: Stats;
  sprite: string; // path to sprite
  animations: AnimationConfig;
  evolutions: {
    target_id: string;
    conditions: EvolutionCondition[];
  }[];
}
```

### Evolution Conditions

```typescript
type EvolutionCondition =
  | { type: "age", hours: number }
  | { type: "stat", stat: string, value: number }
  | { type: "training", training_type: string, count: number }
  | { type: "item", item_id: string }
  | { type: "battle_wins", count: number };
```

---

## Rendering & Animation

### Creature Rendering
- **Sprite-based**: Start with static images
- **Bone animation** (optional later): Spine or DragonBones
- **Shader effects**: Cardboard texture overlay, shadow

### Board Game Aesthetic Implementation

```typescript
// Cardboard texture shader
const cardboardEffect = {
  texture: 'cardboard_texture.png',
  blendMode: 'multiply',
  opacity: 0.3
};

// Plastic stand
const standSprite = {
  tint: creature.type_color,
  alpha: 0.7,
  shader: 'glossy'
};

// Drop shadow beneath creature
const shadow = {
  offset_y: 10,
  blur: 5,
  opacity: 0.3
};
```

---

## Performance Considerations

### Mobile Performance Targets
- **60 FPS** on modern phones (2020+)
- **30 FPS minimum** on older devices
- **< 50MB** total download size
- **< 2 second** initial load time

### Optimization Strategies
- Sprite atlases (combine images)
- Lazy load creatures not in active roster
- Minimize DOM manipulation
- Use object pooling for particles/effects
- Compress audio files

---

## Progressive Enhancement Plan

### Phase 1: Core Prototype (MVP)
- Single creature raising
- Basic stat system
- Simple evolution (1-2 families)
- Cardboard aesthetic (texture overlay only)
- LocalStorage saves

### Phase 2: Content Expansion
- 3-5 evolution families
- Training minigames
- Basic battle system
- Collection screen
- Achievement system

### Phase 3: Polish & Features
- Full 50+ creature roster
- Advanced animations (mesh deformation)
- Sound effects & music
- Social features (share creatures)
- Cloud saves

### Phase 4: Mobile App (Optional)
- Wrap with Capacitor/Cordova
- Native notifications
- App store deployment
- In-app purchases (if monetizing)

---

## Testing Strategy

### Manual Testing (Primary for Phone Development)
- Test on phone after every deploy
- Check different screen sizes (phone, tablet)
- Test touch interactions
- Verify offline functionality

### Automated Testing (Later)
- Unit tests for stat calculations
- Integration tests for evolution system
- Visual regression tests for UI

---

## Next Steps

1. ✅ Choose tech stack: **Phaser + TypeScript + Vite**
2. Initialize project structure
3. Set up GitHub Actions deployment
4. Create basic Phaser game loop
5. Implement first creature (Hop Spring)
6. Test deployment and phone access
7. Iterate!

---

## Alternative: Quick Start with Template

Use existing Phaser + Vite template:
```bash
npm create vite@latest rea -- --template vanilla-ts
cd rea
npm install phaser
# Modify template for game structure
```

This gets you running in **< 5 minutes**.
