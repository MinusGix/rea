# Mobile Pet Game - Design Document

## Core Concept
A mobile-first creature raising game inspired by Digimon World Championship, featuring:
- Multiple creatures with branching evolution paths
- Evolution influenced by raising methods, interactions, and care
- 2D board game aesthetic (cardboard cutouts on plastic stands)
- Simple, exaggerated Live2D-style animations

---

## Theme Options to Explore

### Option 1: Mythical Creatures
- **Concept**: Creatures from various mythologies (dragons, phoenixes, kitsune, griffins)
- **Pros**: Rich existing lore, wide variety, familiar yet magical
- **Cons**: May feel scattered without cohesive worldbuilding
- **Evolution examples**: Hatchling → Whelp → Drake → Dragon/Wyrm/Wyvern

### Option 2: Elemental Beings
- **Concept**: Creatures embodying natural elements (fire, water, earth, air, lightning, ice, etc.)
- **Pros**: Clear visual identity, easy to balance, natural type advantages
- **Cons**: Might feel generic
- **Evolution examples**: Spark → Bolt Beast → Thunder Titan / Storm Serpent

### Option 3: Bio-Mechanical Creatures
- **Concept**: Mix of organic and mechanical parts (think wind-up toys meets living creatures)
- **Pros**: Fits board game aesthetic perfectly, unique visual style
- **Cons**: Narrower appeal
- **Evolution examples**: Cog Critter → Gear Beast → Clock Dragon

### Option 4: Pocket Ecosystems
- **Concept**: Creatures that represent whole ecosystems (forest, desert, ocean, sky)
- **Pros**: Educational angle, unique concept, visual variety
- **Cons**: Harder to make cohesive
- **Evolution examples**: Seedling → Grove Guardian → Ancient Forest Spirit

### Option 5: Emotions/Concepts
- **Concept**: Abstract creatures representing feelings or ideas
- **Pros**: Unique, philosophical, broad design freedom
- **Cons**: Harder to make visually distinct, may be too abstract
- **Evolution examples**: Joy Spark → Laughter Spirit → Euphoria Entity

---

## Evolution System Design

### Evolution Triggers
1. **Stat-based**: Strength, Intelligence, Speed, Friendship, Discipline
2. **Care-based**:
   - Training regimen (combat vs. mental vs. agility)
   - Diet (what you feed them)
   - Rest patterns (sleep schedule)
   - Playtime activities
3. **Event-based**:
   - Winning battles/competitions
   - Special interactions with other creatures
   - Discovering special items
   - Time-based milestones
4. **Branching paths**:
   - Multiple evolution options at each stage
   - Some evolutions are permanent branches (can't get back to other paths)
   - Rare/special evolutions with specific conditions

### Evolution Stages
- **Stage 1**: Baby (0-3 days)
- **Stage 2**: Child (3-7 days) - First branching
- **Stage 3**: Teen (7-14 days) - Major branching
- **Stage 4**: Adult (14+ days) - Final forms
- **Stage 5**: ??? Special/Ultimate forms (rare conditions)

---

## Core Gameplay Loops

### Daily Care Cycle
1. Wake up creature
2. Feed breakfast
3. Training session
4. Play/Interaction
5. Battle/Competition (optional)
6. Feed dinner
7. Put to sleep

### Training Activities
- **Combat Training**: Increases Strength, affects evolution toward warrior types
- **Mental Training**: Increases Intelligence, affects evolution toward mage/support types
- **Agility Training**: Increases Speed, affects evolution toward scout/swift types
- **Bonding Activities**: Increases Friendship, affects evolution toward companion types

### Social Features
- **Playdates**: Creatures interact, learn behaviors
- **Battles**: Competitive or friendly sparring
- **Trading**: Share creatures or items
- **Breeding**: Combine traits from two creatures (optional)

---

## Art Style & Visual Design

### Board Game Aesthetic
- **Creatures**: Flat illustrated characters with subtle depth
  - Cardboard texture overlay
  - Slight shadow beneath "stand"
  - Rounded edges like die-cut cardboard
- **Stands**: 3D plastic-looking bases
  - Translucent or solid colors
  - Slight glossy shader
- **UI Elements**: Board game components
  - Stat cards look like game cards
  - Menus look like game boards
  - Dice for randomness
  - Tokens for resources

### Animation Style
- **Live2D-inspired**: Mesh deformation for simple movement
- **Exaggerated motions**: Squash and stretch, big bounces
- **Idle animations**: Gentle breathing, occasional blinks
- **Action animations**: Big windup, fast motion, big recovery
- **Emotions**: Large expression changes (sparkly eyes, sweat drops, hearts)

### Color Palette
- **Option A**: Warm, inviting (pastels and bright primaries)
- **Option B**: Rich, saturated (deep colors like vintage board games)
- **Option C**: Muted, earthy (craft paper and natural tones)

---

## Technical Considerations

### Mobile-First Design
- **Portrait orientation**: One-handed play primary
- **Simple taps**: Minimal complex gestures
- **Large touch targets**: Accessible buttons/interactive areas
- **Offline capable**: Core gameplay works without connection
- **Battery efficient**: Careful with animation loops

### Platform Targets
- iOS and Android
- Potential web version for wider accessibility

### Tech Stack Options
- **Game Engine**: Unity, Godot, or Phaser (web-based)
- **Art Tools**: Spine, Live2D, or custom sprite animation
- **Backend**: Firebase, Supabase, or custom Node.js server

---

## Progression & Retention

### Player Progression
- **Creature Collection**: Gotta raise 'em all
- **Evolution Completion**: Fill the evolution tree
- **Achievements**: Special care methods, rare evolutions
- **Rankings**: Competition leaderboards

### Monetization (Optional)
- **Premium creatures**: Special starter creatures
- **Cosmetics**: Decorations, stands, accessories
- **Time skips**: Speed up waiting (carefully balanced)
- **Collection slots**: More creatures at once

---

## Questions to Answer

1. **What theme resonates most with you?** (Or should we combine elements?)
2. **How complex should the evolution system be?** (10 creatures vs. 50 vs. 150+?)
3. **Primary focus**: Single creature care vs. collecting many?
4. **Competitive or casual?** How important are battles/competitions?
5. **Story/narrative**: Is there a world/plot, or pure gameplay focus?
6. **Multiplayer depth**: Async only, or real-time features?

---

## Next Steps

Once we decide on theme and scope:
1. Create creature design concepts (3-5 evolution families)
2. Design stat system and evolution formulas
3. Mockup UI screens
4. Build technical prototype
5. Create art style guide
6. Implement first playable creature

