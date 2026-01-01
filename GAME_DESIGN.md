# Mobile Pet Game - Design Document

## Core Concept
A mobile-first creature raising game inspired by Digimon World Championship, featuring:
- Multiple creatures with branching evolution paths
- Evolution influenced by raising methods, interactions, and care
- 2D board game aesthetic (cardboard cutouts on plastic stands)
- Simple, exaggerated Live2D-style animations

---

## Theme: Bio-Mechanical Creatures ⚙️🔧

**Chosen Direction**: Mix of organic and mechanical parts - wind-up toys meets living creatures

### Why This Works
- Perfect fit for board game aesthetic (toy-like quality)
- Unique visual identity that stands out
- Mix mechanical elements with elemental powers (steam-powered, hydro-mechanical, etc.)
- Cohesive world: "Clockwork Menagerie" or "Gear Garden"

### Creature Types
Bio-mechanical creatures powered by different energy sources:
- **Clockwork** (wind-up, gears, springs)
- **Steam-Powered** (fire/heat element)
- **Hydro-Mechanical** (water-powered)
- **Electric** (battery/tesla coil powered)
- **Pneumatic** (air-powered)
- **Kinetic** (motion-powered, flywheel)

### Evolution Philosophy
- Creatures gain more complex mechanisms as they evolve
- Baby forms: Simple toys (single gear, basic spring)
- Teen forms: Multiple moving parts
- Adult forms: Intricate clockwork systems
- **Merging branches**: Different paths can converge to similar forms with stat/color variants
- **Variant system**: Same creature model, different paint jobs and stat distributions

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
- **Stage 1**: Baby (0-3 days) - Simple mechanisms
- **Stage 2**: Child (3-7 days) - First branching (2-3 paths)
- **Stage 3**: Teen (7-14 days) - Major branching (some paths merge here)
- **Stage 4**: Adult (14+ days) - Final forms (variants possible)
- **Stage 5**: ??? Special/Ultimate forms (rare conditions)

### Merging Evolution Paths
Some evolution branches **converge** to create variants:
- Same base form, different colors/materials
- Stat distribution varies (Speed vs Strength variant)
- Special moves/abilities differ
- Example: Training for Speed or Strength might give you "Raptor Mk.II" but one is chrome (speed) and one is bronze (strength)

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

## Design Decisions ✓

1. **Theme**: Bio-mechanical creatures ✓
2. **Scope**: Ambitious - 50+ creatures with merging evolution paths ✓
3. **Active creatures**: 5-6 at once (limit on active roster) ✓
4. **Battle focus**: Side activity, not core loop ✓
5. **Tech stack**: JavaScript or Godot (web export for phone testing) ✓
6. **Development workflow**: Phone-first - test quickly via web builds ✓

## Questions Still to Answer

1. **Story/narrative**: Is there a world/plot, or pure gameplay focus?
2. **Multiplayer depth**: Async only, or real-time features?
3. **Color palette**: Warm/inviting, rich/saturated, or muted/earthy?
4. **Starting creatures**: How many options at game start?

---

## Next Steps

Once we decide on theme and scope:
1. Create creature design concepts (3-5 evolution families)
2. Design stat system and evolution formulas
3. Mockup UI screens
4. Build technical prototype
5. Create art style guide
6. Implement first playable creature

