import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const viewport = document.querySelector('#viewport');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#171a20');

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(7, 5, 9);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
viewport.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xdde7ff, 0x29211b, 1.3));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(4, 8, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -8;
keyLight.shadow.camera.right = 8;
keyLight.shadow.camera.top = 8;
keyLight.shadow.camera.bottom = -8;
scene.add(keyLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ color: '#22262d', roughness: 0.92 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.15;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(20, 40, 0x454b55, 0x30353d);
grid.position.y = -2.14;
scene.add(grid);

const wallMaterial = new THREE.MeshStandardMaterial({ color: '#e8dfd0', roughness: 0.95, side: THREE.DoubleSide });
const wall = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), wallMaterial);
wall.position.set(0, 1, -5);
wall.receiveShadow = true;
scene.add(wall);

const pointLight = new THREE.PointLight('#ffc777', 38, 18, 1.5);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.shadow.bias = -0.001;
scene.add(pointLight);
const bulb = new THREE.Mesh(
  new THREE.SphereGeometry(0.09, 20, 16),
  new THREE.MeshBasicMaterial({ color: '#ffd49a' })
);
scene.add(bulb);

const lampGroup = new THREE.Group();
scene.add(lampGroup);
let loadedModel = null;

function makeDemoLamp() {
  const group = new THREE.Group();
  const outerMat = new THREE.MeshStandardMaterial({
    color: '#d6c2a5', roughness: 0.65, metalness: 0.04,
    side: THREE.DoubleSide
  });
  // Open, tapered shade with a repeating pattern of slots.
  const radiusBottom = 1.35, radiusTop = 0.9, height = 2.5;
  const segments = 96, rows = 12;
  const positions = [], indices = [];
  for (let row = 0; row <= rows; row++) {
    const y = -height / 2 + height * row / rows;
    const t = row / rows;
    const radius = radiusBottom + (radiusTop - radiusBottom) * t;
    for (let col = 0; col <= segments; col++) {
      const angle = (col / segments) * Math.PI * 2;
      positions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < segments; col++) {
      const a = row * (segments + 1) + col;
      const b = a + segments + 1;
      // Leave alternating openings to suggest a perforated prototype.
      if ((col % 6 !== 0 && col % 6 !== 1) || row % 2 === 0) {
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const shade = new THREE.Mesh(geometry, outerMat);
  shade.castShadow = true;
  shade.receiveShadow = true;
  group.add(shade);

  const rimMat = new THREE.MeshStandardMaterial({ color: '#b99e7b', roughness: 0.65 });
  const bottomRim = new THREE.Mesh(new THREE.TorusGeometry(radiusBottom, 0.045, 8, 96), rimMat);
  bottomRim.rotation.x = Math.PI / 2;
  bottomRim.position.y = -height / 2;
  group.add(bottomRim);
  const topRim = new THREE.Mesh(new THREE.TorusGeometry(radiusTop, 0.035, 8, 96), rimMat);
  topRim.rotation.x = Math.PI / 2;
  topRim.position.y = height / 2;
  group.add(topRim);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.18, 48), rimMat);
  base.position.y = -height / 2 - 0.11;
  base.castShadow = true;
  group.add(base);
  return group;
}

function clearModel() {
  if (loadedModel) {
    lampGroup.remove(loadedModel);
    loadedModel.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material?.dispose();
      }
    });
  }
  loadedModel = null;
}
function showDemo() {
  clearModel();
  loadedModel = makeDemoLamp();
  lampGroup.add(loadedModel);
  document.querySelector('#modelStatus').textContent = 'Showing the built-in demo lamp';
}
showDemo();

function fitModelToScene(object) {
  // Normalize the imported model around its own bounds, then put it at the
  // lamp's scene origin. This prevents source-file coordinates from placing
  // the model far away from the wall or camera.
  object.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) throw new Error('This model contains no visible geometry.');

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(maxDim) || maxDim <= 0) {
    throw new Error('Could not determine this model’s dimensions.');
  }

  // Reset object transform before applying a consistent center and scale.
  object.position.set(0, 0, 0);
  object.scale.setScalar(1);
  object.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(object);
  const originalCenter = box.getCenter(new THREE.Vector3());
  const fitScale = 2.6 / maxDim;
  object.scale.setScalar(fitScale);
  // Important: position is applied after scale in Three.js transforms.
  // Scale the center offset too, otherwise models with non-zero source
  // coordinates still appear far away from the scene origin.
  object.position.copy(originalCenter).multiplyScalar(-fitScale);
  object.updateMatrixWorld(true);

  // Imported files can contain nested meshes and materials; make them
  // renderable and enable shadow casting/receiving throughout the hierarchy.
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    if (!child.material || child.material.type === 'MeshBasicMaterial') {
      child.material = new THREE.MeshStandardMaterial({
        color: '#d6c2a5', roughness: 0.72, side: THREE.DoubleSide
      });
    } else {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
      }
    }
  });

  // Keep the scene framing centered on the lamp, regardless of file origin.
  lampGroup.position.set(0, 0, 0);
  pointLight.position.set(0, 0, 0);
  bulb.position.copy(pointLight.position);
  controls.target.set(0, 0, 0);
  camera.position.set(5.2, 3.5, 7.2);
  controls.update();
}

const fileInput = document.querySelector('#modelFile');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  const status = document.querySelector('#modelStatus');
  status.textContent = `Loading ${file.name}…`;
  try {
    let object;
    if (ext === 'stl') {
      const geometry = new STLLoader().parse(await file.arrayBuffer());
      geometry.computeVertexNormals();
      object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
        color: '#d6c2a5', roughness: 0.72, side: THREE.DoubleSide
      }));
    } else if (ext === 'obj') {
      object = new OBJLoader().parse(await file.text());
    } else if (ext === 'glb' || ext === 'gltf') {
      const url = URL.createObjectURL(file);
      try {
        const gltf = await new GLTFLoader().loadAsync(url);
        object = gltf.scene;
      } finally {
        URL.revokeObjectURL(url);
      }
    } else {
      throw new Error('Choose an STL, OBJ, GLB, or GLTF file.');
    }
    clearModel();
    fitModelToScene(object);
    loadedModel = object;
    lampGroup.add(object);
    status.textContent = `Loaded ${file.name}`;
  } catch (error) {
    status.textContent = error.message || 'Could not load this model.';
  }
});

function connectRange(id, outId, format, callback) {
  const input = document.getElementById(id);
  const output = document.getElementById(outId);
  const update = () => {
    const value = Number(input.value);
    output.textContent = format(value);
    callback(value);
  };
  input.addEventListener('input', update);
  update();
}
connectRange('lightHeight', 'lightHeightOut', v => v.toFixed(1), v => {
  pointLight.position.y = v; bulb.position.y = v;
});
connectRange('lightX', 'lightXOut', v => v.toFixed(1), v => {
  pointLight.position.x = v; bulb.position.x = v;
});
connectRange('brightness', 'brightnessOut', v => `${v}%`, v => {
  pointLight.intensity = v * 0.55;
});
connectRange('wallDistance', 'wallDistanceOut', v => `${v.toFixed(1)} m`, v => {
  wall.position.z = -v;
});
document.querySelector('#lightColor').addEventListener('input', e => {
  pointLight.color.set(e.target.value);
  bulb.material.color.set(e.target.value);
});
document.querySelector('#wallColor').addEventListener('input', e => wallMaterial.color.set(e.target.value));
document.querySelector('#resetModelBtn').addEventListener('click', () => {
  fileInput.value = '';
  showDemo();
});
document.querySelector('#homeViewBtn').addEventListener('click', () => {
  camera.position.set(7, 5, 9);
  controls.target.set(0, 0, 0);
  controls.update();
});
document.querySelector('#screenshotBtn').addEventListener('click', () => {
  renderer.render(scene, camera);
  const link = document.createElement('a');
  link.download = 'shadow-lamp-preview.png';
  link.href = renderer.domElement.toDataURL('image/png');
  link.click();
});

function resize() {
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
new ResizeObserver(resize).observe(viewport);
resize();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
