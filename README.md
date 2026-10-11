# Shadow Lamp Lab

A local browser prototype for exploring a 3D lamp model and a light source.

## Requirements
- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite, usually http://localhost:5173.

## Features
- Demo perforated lampshade
- STL, OBJ, GLB and GLTF model upload
- Interactive orbit, zoom and pan
- Light position, brightness and color controls
- Wall distance and color controls
- PNG screenshot export

## Important limitations
This is an early visual prototype. It uses Three.js real-time shadow maps, which are not a physically accurate ray-tracing solution for tiny perforations or complex optical projections. Uploaded model geometry is centered and normalized to fit the scene, and the camera recenters on the lamp. GLTF files that reference separate external textures or binary files may need to be packaged as GLB for easiest loading. Fonts are loaded from Google Fonts when internet is available; the app itself otherwise runs locally.

## Next improvements
1. Validate projection quality against a real lamp.
2. Add proper point-light shadow tuning and a projection-camera view.
3. Add measurement units and model scale calibration.
4. Consider a dedicated ray-based shadow renderer for detailed perforations.
