const scene = new THREE.Scene();

scene.background = new THREE.Color(0xa8b7fd);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(5, 10, 7);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight2.position.set(-5, -5, -5);
scene.add(directionalLight2);

const iphoneGroup = new THREE.Group();

const bodyGeomentry = new THREE.BoxGeometry(3, 6, 0.4);
const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1C1C1E,
    metalness: 0.8,
    roughness: 0.2
});
const body = new THREE.Mesh(bodyGeomentry, bodyMaterial);
body.castShadow = true;
body.receiveShadow = true;
iphoneGroup.add(body);

const screenGeometry = new THREE.BoxGeometry(2.8, 5.7, 0.05);
const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    metalness: 0.1,
    roughness: 0.1,
    emissive: 0x111111,
    emissiveIntensity: 0.3
});
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.z = 0.225;
iphoneGroup.add(screen);

const cameraBumpGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.15)
const cameraBumpMaterial = new THREE.MeshStandardMaterial({
    color: 0x1C1C1E,
    metalness: 0.9,
    roughness: 0.1
});
const cameraBump = new THREE.Mesh(cameraBumpGeometry, cameraBumpMaterial);
cameraBump.position.set(-0.9, 2, -0.275);
iphoneGroup.add(cameraBump);

const lensGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32);
const lensMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.9,
    roughness: 0.05
});

const lens1 = new THREE.Mesh(lensGeometry, lensMaterial);
lens1.rotation.x = Math.PI / 2;
lens1.position.set(-1.2, 2.3, -0.325);

const lens2  = new THREE.Mesh(lensGeometry, lensMaterial);
lens2.rotation.x = Math.PI / 2;
lens2.position.set(0.6, 2.3, -0.325);

const lens3 = new THREE.Mesh(lensGeometry, lensMaterial);
lens3.rotation.x = Math.PI / 2;
lens3.position.set(-0.9, 1.7, -0.325);

iphoneGroup.add(lens1, lens2, lens3);

const buttonGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.05);
const buttonMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0.8,
    roughness: 0.3
});
const powerButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
powerButton.position.set(1.55, 1, 0);

const volumeUp = new THREE.Mesh(buttonGeometry, buttonMaterial);
volumeUp.position.set(-1.55, 1.5, 0);

const volumeDown = new THREE.Mesh(buttonGeometry, buttonMaterial);
volumeDown.position.set(-1.55, 0.5, 0);

iphoneGroup.add(powerButton, volumeUp, volumeDown);
scene.add(iphoneGroup);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
})

renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    iphoneGroup.rotation.y += deltaX * 0.01;
    iphoneGroup.rotation.x += deltaY * 0.01;
    
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();

    camera.position.z += e.deltaY * 0.01;
    camera.position.z = Math.max(8, Math.min(25, camera.position.z));
});

const colorButtons = document.querySelectorAll('.color-btn');

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const newColor = button.getAttribute('data-color');
        body.material.color.set(newColor);
        cameraBump.material.color.set(newColor);
    });
});

function animate() {
    requestAnimationFrame(animate);

    // Auto-rotation
    if (!isDragging) {
        iphoneGroup.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});