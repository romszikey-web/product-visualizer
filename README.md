📱 iPhone 17 Pro Concept 3D Visualizer

This project is an ultra-realistic 3D visualizer showcasing a speculative concept design for an "iPhone 17 Pro" using Three.js. Users can interact with the 3D model, rotate it, zoom in, and change the device's color in real-time.

The model features a stylized design with a full-width horizontal camera bar, Dynamic Island, and detailed side buttons, ports, and sensors.

✨ Features

Procedural Geometry: The entire 3D model is built using Three.js geometries (boxes, cylinders, spheres, etc.)—no external 3D model files (like .obj or .gltf) were imported.

Interactive 3D Model: Fully rotatable and zoomable 3D representation of a concept iPhone.

Custom Color Picker: Select from various "Titanium" colors (Blue, Lavender, Sage, Black, White, Bronze).

Realistic Rendering: Uses THREE.MeshStandardMaterial with environment mapping and soft shadows for a high-fidelity, metallic look.

Detailed Design: Includes geometry for the Dynamic Island, camera lenses, LiDAR sensor, USB-C port, and side buttons.

Responsive Layout: Adapts to various screen sizes and supports both mouse and touch input.

Idle Auto-Rotation: The model automatically rotates when idle, pausing when the user interacts with it.

🛠️ Technology Stack

HTML5: Structure and content.

CSS3: Styling and aesthetic layout.

JavaScript (ES6+): Core logic and interactivity.

Three.js (r128): The powerful 3D library used for scene creation, rendering, and model manipulation.

🚀 Getting Started

To view and run this project locally, follow these simple steps:

Clone the Repository:

git clone [Your-GitHub-Repository-URL]
cd iphone-visualizer


Open the File:
This project consists of standard HTML, CSS, and JavaScript files and does not require a build step or backend server. Simply open the index.html file in your web browser:

open index.html
# or navigate to the file path directly in your browser


(Note: For some modern browsers, if Three.js assets fail to load due to file-access security restrictions, you may need to run a simple local web server like python3 -m http.server.)

🖱️ Controls and Interaction

Action

Input (Mouse)

Input (Touch)

Rotate Model

Click and drag

Tap and drag / Swipe

Zoom In/Out

Scroll wheel

(Not currently implemented)

Change Color

Click the color swatch buttons

Tap the color swatch buttons

🎨 Color Options

The visualizer currently includes the following color schemes:

Blue Titanium

Lavender

Sage

Black Titanium

White Titanium

Bronze Titanium

📝 Project Structure

.
├── index.html         # Main structure, UI, and Three.js library inclusion
├── style.css          # Styling for the UI (title, color picker, controls)
└── script.js          # Three.js scene setup, model geometry, lighting, animation loop, and user interaction logic
