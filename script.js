console.log("🚀 iPhone 17 Pro Visualizer Starting...");

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;

const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true
});
container.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lighting
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffeedd, 0.8);
fillLight.position.set(-5, 3, 3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xaaccff, 0.6);
rimLight.position.set(0, 2, -5);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Environment map
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
scene.add(cubeCamera);

console.log("✅ Scene and lighting created");

// Helper function for rounded rectangles
function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

// iPhone dimensions
const phoneWidth = 7;
const phoneHeight = 15;
const phoneDepth = 0.8;
const cornerRadius = 0.7;

const iphoneGroup = new THREE.Group();

console.log("📱 Creating iPhone body...");

// Phone body
const bodyShape = createRoundedRectShape(phoneWidth, phoneHeight, cornerRadius);
const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
  depth: phoneDepth,
  bevelEnabled: true,
  bevelThickness: 0.15,
  bevelSize: 0.15,
  bevelSegments: 16,
  curveSegments: 32,
});
bodyGeometry.translate(0, 0, -phoneDepth / 2);

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a90e2,
  metalness: 0.9,
  roughness: 0.2,
  envMap: cubeRenderTarget.texture,
  envMapIntensity: 1.0
});

const phoneMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
phoneMesh.castShadow = true;
phoneMesh.receiveShadow = true;
phoneMesh.name = 'body';
iphoneGroup.add(phoneMesh);

console.log("✅ Body created");

// SCREEN - Pure black, always stays black
console.log("🖥️ Creating screen (pure black)...");
const screenShape = createRoundedRectShape(
  phoneWidth - 0.3,
  phoneHeight - 0.3,
  cornerRadius - 0.1
);
const screenGeometry = new THREE.ExtrudeGeometry(screenShape, {
  depth: 0.05,
  bevelEnabled: false
});
screenGeometry.translate(0, 0, phoneDepth / 2 + 0.1);

const screenMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.FrontSide
});

const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
screenMesh.name = 'screen';
iphoneGroup.add(screenMesh);

console.log("✅ Screen created - Color:", screenMaterial.color.getHexString());

// DYNAMIC ISLAND
console.log("🏝️ Creating Dynamic Island...");
const islandWidth = 2.5;
const islandHeight = 0.7;
const islandRadius = islandHeight / 2;
const islandShape = createRoundedRectShape(islandWidth, islandHeight, islandRadius);
const islandGeometry = new THREE.ExtrudeGeometry(islandShape, {
  depth: 0.1,
  bevelEnabled: false
});
islandGeometry.translate(0, phoneHeight / 2 - 1.5, phoneDepth / 2 + 0.15);

const islandMaterial = new THREE.MeshStandardMaterial({
  color: 0x050505,
  metalness: 0.3,
  roughness: 0.7
});

const islandMesh = new THREE.Mesh(islandGeometry, islandMaterial);
islandMesh.name = 'island';
iphoneGroup.add(islandMesh);

console.log("✅ Dynamic Island created");

// FRONT CAMERA (visible in Dynamic Island)
console.log("📷 Creating front camera...");
const frontCameraGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 32);
const frontCameraMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  metalness: 0.8,
  roughness: 0.2
});
const frontCamera = new THREE.Mesh(frontCameraGeometry, frontCameraMaterial);
frontCamera.rotation.x = Math.PI / 2;
frontCamera.position.set(-0.7, phoneHeight / 2 - 1.5, phoneDepth / 2 + 0.2);
frontCamera.name = 'frontCamera';
iphoneGroup.add(frontCamera);

// Front camera lens (FIXED - removed thickness property)
const frontLensGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32);
const frontLensMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x001133,
  metalness: 0,
  roughness: 0,
  transmission: 0.95
});
const frontLens = new THREE.Mesh(frontLensGeometry, frontLensMaterial);
frontLens.rotation.x = Math.PI / 2;
frontLens.position.set(-0.7, phoneHeight / 2 - 1.5, phoneDepth / 2 + 0.22);
frontLens.name = 'frontLens';
iphoneGroup.add(frontLens);

console.log("✅ Front camera created");

// FACE ID SENSOR
console.log("🔴 Creating Face ID sensor...");
const faceIDGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
const faceIDMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0a0a,
  metalness: 0.6,
  roughness: 0.4,
  emissive: 0x330000,
  emissiveIntensity: 0.3
});
const faceIDSensor = new THREE.Mesh(faceIDGeometry, faceIDMaterial);
faceIDSensor.rotation.x = Math.PI / 2;
faceIDSensor.position.set(0.7, phoneHeight / 2 - 1.5, phoneDepth / 2 + 0.2);
faceIDSensor.name = 'faceID';
iphoneGroup.add(faceIDSensor);

console.log("✅ Face ID sensor created");

// USB-C CHARGING PORT (FIXED - positioned OUTSIDE body, clearly visible)
console.log("🔌 Creating USB-C charging port...");
const portWidth = 0.8;
const portHeight = 0.25;
const portDepth = 0.2;

// Port outer frame
const portGeometry = new THREE.BoxGeometry(portWidth, portHeight, portDepth);
const portMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  metalness: 0.7,
  roughness: 0.3
});
const chargingPort = new THREE.Mesh(portGeometry, portMaterial);
chargingPort.position.set(0, -phoneHeight / 2 + 0.2, -portDepth / 2);
chargingPort.name = 'port';
iphoneGroup.add(chargingPort);

// Port connector inside (visible metal pins)
const connectorGeometry = new THREE.BoxGeometry(portWidth * 0.6, portHeight * 0.5, portDepth * 0.4);
const connectorMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888,
  metalness: 0.95,
  roughness: 0.05
});
const portConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
portConnector.position.set(0, -phoneHeight / 2 + 0.2, -portDepth / 4);
portConnector.name = 'connector';
iphoneGroup.add(portConnector);

console.log("✅ Charging port created - VISIBLE at bottom");

// APPLE LOGO (FIXED - positioned OUTSIDE back, clearly visible)
console.log("🍎 Creating Apple logo...");

// Create apple body with ExtrudeGeometry for 3D effect
const appleCircleShape = new THREE.Shape();
appleCircleShape.arc(0, 0, 0.7, 0, Math.PI * 2, false);

const appleGeometry = new THREE.ExtrudeGeometry(appleCircleShape, {
  depth: 0.08,
  bevelEnabled: true,
  bevelThickness: 0.02,
  bevelSize: 0.02,
  bevelSegments: 8
});

const appleLogoMaterial = new THREE.MeshStandardMaterial({
  color: 0x356a9a,
  metalness: 0.95,
  roughness: 0.05,
  envMap: cubeRenderTarget.texture,
  envMapIntensity: 2.0
});

const appleLogoMesh = new THREE.Mesh(appleGeometry, appleLogoMaterial);
appleLogoMesh.position.set(0, 1, -phoneDepth / 2 - 0.15);
appleLogoMesh.name = 'appleLogo';
iphoneGroup.add(appleLogoMesh);

// Apple bite (cutout effect)
const biteCircleShape = new THREE.Shape();
biteCircleShape.arc(0, 0, 0.3, 0, Math.PI * 2, false);
const biteGeometry = new THREE.ExtrudeGeometry(biteCircleShape, {
  depth: 0.12,
  bevelEnabled: false
});
const biteMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0a0a,
  metalness: 0.1,
  roughness: 0.9
});
const biteMesh = new THREE.Mesh(biteGeometry, biteMaterial);
biteMesh.position.set(0.5, 1.15, -phoneDepth / 2 - 0.15);
biteMesh.name = 'appleBite';
iphoneGroup.add(biteMesh);

// Apple leaf
const leafGeometry = new THREE.ConeGeometry(0.12, 0.25, 8);
const leafMesh = new THREE.Mesh(leafGeometry, appleLogoMaterial);
leafMesh.rotation.z = Math.PI / 4;
leafMesh.position.set(0.1, 1.8, -phoneDepth / 2 - 0.15);
leafMesh.name = 'appleLeaf';
iphoneGroup.add(leafMesh);

console.log("✅ Apple logo created - VISIBLE on back");

// ====================================================================
// CAMERA BAR (iPhone 17 Pro style - FULL WIDTH HORIZONTAL BAR)
// ====================================================================
console.log("📸 Creating iPhone 17 Pro camera bar...");

const cameraBarWidth = phoneWidth - 1;  // Nearly full width
const cameraBarHeight = 2.5;
const cameraBarDepth = 0.35;
const cameraBarRadius = 0.4;

const cameraBarShape = createRoundedRectShape(
  cameraBarWidth,
  cameraBarHeight,
  cameraBarRadius
);

const cameraBarGeometry = new THREE.ExtrudeGeometry(cameraBarShape, {
  depth: cameraBarDepth,
  bevelEnabled: true,
  bevelThickness: 0.04,
  bevelSize: 0.04,
  bevelSegments: 8
});
cameraBarGeometry.translate(
  0,
  phoneHeight / 2 - 2,
  -phoneDepth / 2 - cameraBarDepth / 2
);

const cameraBarMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a90e2,
  metalness: 0.9,
  roughness: 0.2,
  envMap: cubeRenderTarget.texture,
  envMapIntensity: 1.0
});

const cameraBarMesh = new THREE.Mesh(cameraBarGeometry, cameraBarMaterial);
cameraBarMesh.castShadow = true;
cameraBarMesh.name = 'cameraBar';
iphoneGroup.add(cameraBarMesh);

console.log("✅ Camera bar created (full-width horizontal)");

// REAR CAMERA LENSES - iPhone 17 Pro: 3 lenses in horizontal row
console.log("📷 Creating rear camera lenses (iPhone 17 Pro arrangement)...");
const lensRadius = 0.55;
const lensDepth = 0.12;

// Horizontal arrangement: left, center-left, center-right
const lensPositions = [
  [-1.8, 0],     // Far left
  [-0.6, 0],     // Center-left
  [0.6, 0]       // Center-right
];

const lensGeometry = new THREE.CylinderGeometry(lensRadius, lensRadius, lensDepth, 32);
const lensMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  metalness: 0.9,
  roughness: 0.05,
  envMap: cubeRenderTarget.texture,
  envMapIntensity: 1.5
});

const lensGlassGeometry = new THREE.CylinderGeometry(lensRadius * 0.85, lensRadius * 0.85, lensDepth * 0.4, 32);
const lensGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x001122,
  metalness: 0,
  roughness: 0,
  transmission: 0.9
});

lensPositions.forEach(([x, y], index) => {
  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(
    x,
    phoneHeight / 2 - 2 + y,
    -phoneDepth / 2 - cameraBarDepth - lensDepth / 2 + 0.1
  );
  lens.castShadow = true;
  lens.name = `lens${index}`;
  iphoneGroup.add(lens);

  const lensGlass = new THREE.Mesh(lensGlassGeometry, lensGlassMaterial);
  lensGlass.rotation.x = Math.PI / 2;
  lensGlass.position.set(
    x,
    phoneHeight / 2 - 2 + y,
    -phoneDepth / 2 - cameraBarDepth - lensDepth * 0.3 + 0.1
  );
  lensGlass.name = `lensGlass${index}`;
  iphoneGroup.add(lensGlass);
});

console.log("✅ Rear camera lenses created (horizontal arrangement)");

// LED FLASH (far right of camera bar)
console.log("💡 Creating LED flash...");
const flashRadius = 0.3;
const flashDepth = 0.1;

const flashGeometry = new THREE.CylinderGeometry(flashRadius, flashRadius, flashDepth, 32);
const flashMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.3,
  roughness: 0.2,
  emissive: 0xffffcc,
  emissiveIntensity: 0.5
});

const flashMesh = new THREE.Mesh(flashGeometry, flashMaterial);
flashMesh.rotation.x = Math.PI / 2;
flashMesh.position.set(
  2.2,
  phoneHeight / 2 - 2,
  -phoneDepth / 2 - cameraBarDepth - flashDepth / 2 + 0.1
);
flashMesh.name = 'flash';
iphoneGroup.add(flashMesh);

console.log("✅ LED flash created");

// LiDAR Sensor (right side of camera bar)
const lidarRadius = 0.22;
const lidarGeometry = new THREE.CylinderGeometry(lidarRadius, lidarRadius, 0.08, 32);
const lidarMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0a0a,
  metalness: 0.8,
  roughness: 0.3,
  emissive: 0x001100,
  emissiveIntensity: 0.2
});
const lidarMesh = new THREE.Mesh(lidarGeometry, lidarMaterial);
lidarMesh.rotation.x = Math.PI / 2;
lidarMesh.position.set(
  1.5,
  phoneHeight / 2 - 2,
  -phoneDepth / 2 - cameraBarDepth - 0.04 + 0.1
);
lidarMesh.name = 'lidar';
iphoneGroup.add(lidarMesh);

console.log("✅ LiDAR sensor created");

// SIDE BUTTONS
console.log("🔘 Creating side buttons...");
const buttonMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a2a2a,
  metalness: 0.9,
  roughness: 0.3
});

// Power button (right side)
const powerButtonGeometry = new THREE.BoxGeometry(0.15, 1.8, 0.3);
const powerButton = new THREE.Mesh(powerButtonGeometry, buttonMaterial);
powerButton.position.set(phoneWidth / 2 + 0.08, 2.5, 0);
powerButton.castShadow = true;
powerButton.name = 'powerButton';
iphoneGroup.add(powerButton);

// Volume buttons (left side)
const volumeButtonGeometry = new THREE.BoxGeometry(0.15, 1, 0.3);
const volumeUpButton = new THREE.Mesh(volumeButtonGeometry, buttonMaterial);
volumeUpButton.position.set(-phoneWidth / 2 - 0.08, 3.5, 0);
volumeUpButton.castShadow = true;
volumeUpButton.name = 'volumeUp';
iphoneGroup.add(volumeUpButton);

const volumeDownButton = new THREE.Mesh(volumeButtonGeometry, buttonMaterial);
volumeDownButton.position.set(-phoneWidth / 2 - 0.08, 2, 0);
volumeDownButton.castShadow = true;
volumeDownButton.name = 'volumeDown';
iphoneGroup.add(volumeDownButton);

// Action button
const actionButtonGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
const actionButton = new THREE.Mesh(actionButtonGeometry, buttonMaterial);
actionButton.position.set(-phoneWidth / 2 - 0.08, 5.2, 0);
actionButton.castShadow = true;
actionButton.name = 'actionButton';
iphoneGroup.add(actionButton);

console.log("✅ Side buttons created");

scene.add(iphoneGroup);

console.log("✅ iPhone group added to scene");
console.log("📊 Total meshes in iPhone:", iphoneGroup.children.length);

// Mouse controls
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let isAutoRotating = true;
let idleTimer = null;

const canvas = renderer.domElement;

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  isAutoRotating = false;
  clearTimeout(idleTimer);
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    targetRotation.y += deltaX * 0.005;
    targetRotation.x += deltaY * 0.005;
    targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.x));
    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  idleTimer = setTimeout(() => { isAutoRotating = true; }, 3000);
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  camera.position.z += e.deltaY * 0.05;
  camera.position.z = Math.max(8, Math.min(25, camera.position.z));
  isAutoRotating = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { isAutoRotating = true; }, 3000);
});

// Touch support
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    isAutoRotating = false;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
});

canvas.addEventListener('touchmove', (e) => {
  if (isDragging && e.touches.length === 1) {
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;
    targetRotation.y += deltaX * 0.005;
    targetRotation.x += deltaY * 0.005;
    targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.x));
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
});

canvas.addEventListener('touchend', () => {
  isDragging = false;
  idleTimer = setTimeout(() => { isAutoRotating = true; }, 3000);
});

// Color change functionality
const colors = {
  blue: { body: 0x4a90e2, logo: 0x356a9a },
  lavender: { body: 0xc8b3e6, logo: 0x9a82b8 },
  sage: { body: 0xa8c69f, logo: 0x7a9471 },
  black: { body: 0x2c2c2c, logo: 0x1a1a1a },
  white: { body: 0xe8e8e8, logo: 0xcccccc },
  bronze: { body: 0xb87333, logo: 0x8a5424 }
};

document.querySelectorAll('.color-btn').forEach(button => {
  button.addEventListener('click', () => {
    console.log("🎨 Color button clicked:", button.dataset.color);
    
    document.querySelectorAll('.color-btn').forEach(btn => 
      btn.classList.remove('active')
    );
    button.classList.add('active');
    
    const colorName = button.dataset.color;
    const colorSet = colors[colorName];

    // Change body and camera bar color
    iphoneGroup.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'body' || child.name === 'cameraBar') {
          child.material.color.setHex(colorSet.body);
          console.log("Changed", child.name, "to body color");
        } else if (child.name === 'appleLogo' || child.name === 'appleLeaf') {
          child.material.color.setHex(colorSet.logo);
          console.log("Changed", child.name, "to logo color");
        }
      }
    });

    console.log("✅ Color change complete");
  });
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (isAutoRotating) {
    targetRotation.y += 0.002;
  }

  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

  iphoneGroup.rotation.x = currentRotation.x;
  iphoneGroup.rotation.y = currentRotation.y;

  renderer.render(scene, camera);
}

console.log("🎬 Starting animation loop...");
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log("✅ iPhone 17 Pro Visualizer Ready!");