# Future Features & Design Notes

## Creature Social System (Planned)

### Multi-Creature Rooms
- **Single hex rooms**: Max 3 creatures (2 for medical room)
- **Multi-hex rooms** (like Track): Can hold more creatures
- Not all creatures can use room benefits simultaneously
  - Example: Medical room treats 2 at a time, others wait
  - Gym equipment limited, creates queue system

### Creature Interactions
Creatures in the same room will interact with each other:
- **Playfighting**: Boosts happiness and builds relationship
- **Training together**: Learn from each other, stat influence
- **Resting together**: Comfort bonus
- **Eating together**: Social eating behavior
- **Showing off**: Display evolved forms to others

### Relationship & Personality System

#### Personality Traits (Future)
Each creature has:
- **Temperament**: Aggressive, Friendly, Shy, Energetic, Lazy, Curious
- **Preferences**: Favorite room types, activity preferences
- **Social needs**: Loner, Social butterfly, Selective friend

#### Opinion System
Creatures develop opinions about other creatures based on:
- **Personality compatibility**: Some temperaments clash, others bond
- **Species differences**:
  - Same species → Natural affinity (+relationship gain)
  - Different types (Clockwork vs Steam) → Neutral or curious
  - Similar evolution paths → Kinship bonus
- **Interaction history**:
  - Positive interactions (play together) → Friendship grows
  - Negative interactions (fight over resources) → Rivalry develops
  - Time spent together → Familiarity increases

#### Relationship Levels
- **Strangers** (0-20): Awkward, minimal interaction
- **Acquaintances** (21-40): Polite, basic cooperation
- **Friends** (41-70): Happy together, stat bonuses when near
- **Best Friends** (71-90): Strong bond, evolution synergy
- **Rivals** (-50 to 0): Avoid each other, compete for attention
- **Nemesis** (< -50): Active avoidance, stress when together

#### Gameplay Impact
- **Stat bonuses**: Friends training together get better gains
- **Evolution influence**: Best friends might unlock special dual evolution paths
- **Happiness modifiers**:
  - Being with friends → +happiness over time
  - Being with rivals → -happiness, +stress
- **Learning**: Younger creatures learn faster from older friends
- **Breeding** (if implemented): Only compatible personalities breed
- **Room preferences**: Creatures may follow friends to their favorite rooms

### Room Expansion & Building

#### Facility Concept
- Start with 3-4 basic rooms
- **Unlock rooms** through:
  - Player level/progress
  - Evolution milestones
  - Resource gathering
  - Achievements

#### Room Quality Tiers
- **Basic**: Standard effects
- **Improved**: +50% effects, better aesthetics
- **Advanced**: +100% effects, special features
- **Premium**: Unique bonuses, cosmetic upgrades

#### Room Upgrades
- **Size expansion**: Single hex → Double hex
- **Capacity**: More creature slots
- **Equipment**: Better training gear, faster healing
- **Aesthetics**: Visual improvements, themes

### Resource Management (Future)
- **Building points**: Earned through creature training
- **Materials**: Collected from creature activities
- **Special items**: Unlock unique room types

### Multi-Creature Gameplay Flow
1. **Morning**: Creatures wake up, some grumpy, some energetic
2. **Cafeteria rush**: Social eating, relationship building
3. **Activity time**: Split up to favorite rooms
4. **Social hour**: Creatures visit friends in other rooms
5. **Evening**: Return to bedroom, bedtime routines
6. **Night**: Sleep cycles, dreams (background stat regeneration)

## Technical TODOs

### Immediate
- [ ] Add room capacity limits
- [ ] Implement creature-to-creature distance checking
- [ ] Add interaction triggers when creatures are close

### Short-term
- [ ] Design personality trait system
- [ ] Create relationship database structure
- [ ] Implement basic interaction animations

### Long-term
- [ ] AI for autonomous creature behavior
- [ ] Relationship graph visualization
- [ ] Evolution paths influenced by friendships
- [ ] Multi-creature evolution (pair evolution)

## Visual Design Notes

### Creature Indicators
- **Mood icons** above creatures (happy, angry, tired)
- **Relationship hearts** between friends
- **Speech bubbles** for interactions
- **Thought bubbles** showing desires

### Room Improvements Needed
- Better graphics for rooms (currently simple colored hexes)
- Room decoration items
- Furniture and equipment visuals
- Creature paths/trails showing movement

## Balancing Considerations

### Avoid Micromanagement
- Most interactions should be autonomous
- Player guides rather than controls
- Set room assignments, creatures handle the rest

### Keep It Fun
- Relationships should feel natural, not forced
- Positive interactions more common than negative
- Rivalries add drama but shouldn't stress player

---

*Last updated: 2026-01-11*
*This is a living document - add ideas as they come!*
