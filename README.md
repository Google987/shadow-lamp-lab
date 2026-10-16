# Shadow Lamp Lab

**Explore form, light, and projection in an interactive 3D workspace.**

Shadow Lamp Lab is a browser-based prototype for experimenting with a 3D
lamp model, a movable light source, and the shadow it casts onto a
virtual wall.

-   **Live demo:** https://3dlamp.alittlecoding.com/
-   **Source code:** https://github.com/Google987/shadow-lamp-lab

## Features

-   **Built-in demo lamp** --- start exploring without uploading a
    model.
-   **3D model upload** --- load STL, OBJ, GLB, or GLTF files.
-   **Interactive camera** --- orbit, zoom, pan, and reset the view.
-   **Model controls** --- adjust scale and rotate the lamp around the
    X, Y, and Z axes.
-   **Light controls** --- adjust the light's height, horizontal
    position, depth, brightness, and color.
-   **Projection wall controls** --- change wall distance, size, and
    color.
-   **Live measurements** --- view normalized model dimensions,
    model-to-wall gap, light-to-wall distance, and an estimated shadow
    size.
-   **PNG export** --- capture an image of the current scene.
-   **Creator and support links** --- find the project's social links
    and optional support methods in the app.

## Run locally

### Requirements

-   Node.js 20.19+ or 22.12+ recommended
-   npm

### Install and start the development server

``` bash
git clone https://github.com/Google987/shadow-lamp-lab.git
cd shadow-lamp-lab
npm install
npm run dev
```

Open the local URL printed by Vite. It is usually:

http://localhost:5173

You can also use the hosted version at https://3dlamp.alittlecoding.com/
without setting up the project locally.

## How to use

1.  Open the app and explore the built-in demo lamp, or upload your own
    3D model.
2.  Adjust the model's scale and rotation to inspect its shape.
3.  Move the light source using the height, horizontal position, and
    depth controls.
4.  Tune the light's brightness and color.
5.  Adjust the projection wall's distance, size, and color.
6.  Use the live measurements as rough scene-level references.
7.  Click **Capture PNG** to export an image of the current view. Use
    **Reset view** to return the camera to its default view.

### Camera controls

-   **Drag:** orbit around the scene
-   **Scroll:** zoom in or out
-   **Right-drag:** pan

### Supported model formats

The upload control accepts **STL, OBJ, GLB, and GLTF** files. The file
picker also accepts `.bin` and `.mtl` files to support relevant model
assets.

For GLTF models that depend on separate textures or binary files,
package the model and its dependencies as a **GLB** where practical for
easier loading.

## Important limitations

Shadow Lamp Lab is an early-stage visual prototype, not a physically
accurate optical simulator.

-   It uses Three.js real-time shadow maps. Tiny perforations and
    complex light projections may not render accurately.
-   Uploaded model geometry is centered and normalized to fit the scene.
    The displayed dimensions use normalized scene units, not guaranteed
    real-world measurements.
-   The estimated shadow size is a rough point-light projection
    estimate, not a physical simulation.
-   The camera recenters on the lamp when a model is loaded.
-   External assets referenced by GLTF files may need to be packaged
    with the model; GLB is often the simplest option.
-   Fonts are loaded from Google Fonts when an internet connection is
    available. The app otherwise runs locally, subject to the
    availability of any external assets a model may require.


## Credits and support

Created by **Arif Khan**.

-   [GitHub repository](https://github.com/Google987/shadow-lamp-lab)
-   [Instagram](https://www.instagram.com/arif_decrypted)
-   [LinkedIn](https://www.linkedin.com/in/arif-decrypted/)
-   [X (Twitter)](https://x.com/arif_decrypted)
-   [Buy Me a Coffee](https://buymeacoffee.com/alittlecoding)

If you find the project useful, consider supporting its continued
development.

------------------------------------------------------------------------

*Shadow Lamp Lab is a visual experimentation tool. Treat its shadow
previews and measurements as approximate rather than engineering-grade
optical results.*
