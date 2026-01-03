# 🎨 Adding Your Hop Spring Sprite

## Quick Setup

1. **Save your generated image** as `hop_spring.png`

2. **Add it to the project**:
   ```
   public/assets/sprites/hop_spring.png
   ```

3. **Commit and push**:
   ```bash
   git add public/assets/sprites/hop_spring.png
   git commit -m "Add Hop Spring sprite artwork"
   git push origin claude/mobile-pet-game-design-tO9UL
   ```

4. **Wait ~1 minute** for GitHub Actions to build

5. **Refresh your phone** - you should see your beautiful creature! 🎉

## What Will Happen

- **Raising Scene**: Your sprite will replace the placeholder circles
- **Collection View**: Sprite appears in the card grid
- **Detail Modal**: Larger sprite when you tap the card

## Scale Settings

The sprite is scaled down from your 2048x2048 image:
- **Raising Scene**: 0.25x scale (~512px)
- **Collection Cards**: 0.08x scale (~164px)
- **Detail View**: 0.15x scale (~307px)

## If It Doesn't Work

Check the browser console (on desktop) for:
- `🎨 Loading 1 creature sprites...` (BootScene)
- `🎨 Rendered sprite for hop_spring` (RaisingScene)

If you see `⚠️ No sprite found`, double-check the file path and name.

## Next Sprites

As you generate more creatures, just add them with the same pattern:
- `leap_coil.png`
- `spring_tank.png`
- `rocket_hopper.png`
- etc.

All sprites will auto-load!
