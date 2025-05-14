# AddChai Game

A fun and engaging 2D game developed for AddChai Agency. This game features a character selection system, dynamic combat mechanics, and an exciting boss battle experience.

## 🎮 Game Features

- **Character Selection**: Choose from 11 unique characters including Warrior, Mage, Archer, Knight, Ninja, Paladin, Rogue, Berserker, Monk, Druid, and Warlock
- **Dynamic Combat**: Engage in fast-paced combat with shooting mechanics and power-ups
- **Boss Battle**: Face off against a challenging boss with increasing difficulty
- **Power-up System**: Collect AddChai power-ups to enhance your shooting capabilities
- **Health System**: Monitor your health with a visual heart indicator system
- **Timer**: Track your gameplay time and compete for the best completion time
- **Parallax Background**: Immersive background with parallax scrolling effects

## 🚀 How to Play

1. **Character Selection**:
   - Use LEFT/RIGHT arrow keys or click the arrows to navigate through characters
   - Press ENTER or click the "Select Character" button to confirm your choice

2. **Game Controls**:
   - Arrow Keys: Move your character
   - Space Bar: Shoot weapons
   - Collect AddChai power-ups to increase shooting speed

3. **Objective**:
   - Defeat the boss by shooting it while avoiding its attacks
   - Manage your health (3 hearts) and defeat the boss before it defeats you

## 🛠️ Technical Details

The game is built using:
- p5.js for game rendering and physics
- JavaScript for game logic
- Custom sprite sheets and assets

## 📦 Asset Structure

```
asset/
├── character/
│   ├── Character Sheet3.png
│   ├── life.png
│   └── reloadicon.png
├── map/
│   ├── addchai1.png
│   ├── addchai2.png
│   ├── addchai3.png
│   ├── addchai4.png
│   └── back_player.jpg
├── monster/
│   ├── health_above.png
│   └── health_below.png
├── addchai.png
├── Blastt.png
├── Playerr.png
├── Weaponn.png
└── William.png
```

## 🎯 Game Mechanics

- **Shooting System**: 
  - Base fire rate with cooldown indicator
  - Power-up system for increased fire rate
  - Visual feedback for weapon cooldown

- **Health System**:
  - Player: 3 hearts
  - Boss: 10 health points with visual health bar

- **Power-ups**:
  - AddChai power-ups temporarily increase shooting speed
  - Visual timer for power-up duration

## 🏆 Victory Conditions

- Defeat the boss by reducing its health to 0
- Game tracks and displays your completion time
- Press ENTER to restart after game over

## 🔄 Game States

1. Character Selection
2. Main Game
3. Game Over (Victory/Defeat)

## 📝 Notes

This game is a testing project for AddChai Agency, showcasing various game mechanics and features that can be implemented in future projects.

## 🎨 Credits

Developed for AddChai Agency 