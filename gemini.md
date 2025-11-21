# iPhone 17 3D Visualizer

This project is a 3D visualizer for the iPhone 17, created using the Three.js library. It allows users to interact with a 3D model of the phone, including rotating it, zooming, and changing its color.

## Project Structure

The project is composed of three main files:

*   `index.html`: This is the main entry point of the application. It sets up the basic HTML structure, including a header, a container for the 3D canvas, and the control elements for customization.
*   `style.css`: This file contains all the styles for the application. It uses a modern design with a gradient background, blurred glass effects, and a responsive layout that adapts to different screen sizes.
*   `script.js`: This is the core of the application. It uses the Three.js library to create the 3D scene, set up the camera and renderer, add lighting, and create the iPhone model. It also handles user interactions, such as rotating the model with the mouse and zooming with the scroll wheel.

## Key Terminology

To ensure consistency and clarity, here are the definitions of the key terms and variables used in the project:

*   **`scene`**: A `Three.js` `Scene` object that acts as a container for all the 3D objects, lights, and cameras in the application.
*   **`camera`**: A `Three.js` `PerspectiveCamera` object that defines the viewpoint from which the scene is rendered. It is set up to mimic the way the human eye perceives depth.
*   **`renderer`**: A `Three.js` `WebGLRenderer` object that is responsible for rendering the 3D scene and displaying it within an HTML `<canvas>` element.
*   **`canvas-container`**: The HTML `div` element with the `id="canvas-container"`. This element serves as the container for the `renderer`'s canvas, where the 3D visualization is displayed.
*   **`iphoneGroup`**: A `Three.js` `Group` object that holds all the individual components (meshes) of the iPhone model. This allows the entire phone to be manipulated (e.g., rotated, scaled) as a single entity.
*   **`color-btn`**: The HTML `button` elements with the class `color-btn`. These buttons are used in the control panel to allow the user to select a color for the iPhone model. Each button has a `data-color` attribute that specifies the color to be applied.