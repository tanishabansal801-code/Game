# Fashion Battle v2

A playable mobile-first fashion competition prototype built with React, Phaser 3 and Vite.

## Features
- Phaser canvas game scene
- Fashion challenge themes
- Timed dress-up round
- Selectable dresses, hairstyles, shoes and accessories
- Coin economy and unlockable wardrobe items
- Runway entrance animation
- Rival score, results and rewards
- Local progress saved on the device

## Run locally
```bash
npm install
npm run dev
```

## Build web assets
```bash
npm run build
```

## Android packaging
This project includes Capacitor configuration. The GitHub Actions workflow in `.github/workflows/build-apk.yml` builds a debug APK in the cloud.

## Current art limitation
The first playable build uses a stylized procedural 2D paper-doll character drawn in Phaser. The game loop and wardrobe are functional. Replace the character drawing with licensed or custom layered 2D model artwork for the intended photorealistic fashion-game appearance.
