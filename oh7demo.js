import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'


// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用软阴影


document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// 添加一个平面作为地面
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // 旋转平面使其水平
const ground_y = -5;
ground.position.y = ground_y; // 将平面下移
ground.receiveShadow = true; // 允许平面接收阴影
scene.add(ground);

// 光源设置
const ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
ambientLight.castShadow = true;
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 5, 0)
scene.add(directionalLight);

// 设置相机位置
camera.position.z = 15;
camera.position.y = 0;
// 旋转相机
const angle90 = THREE.MathUtils.degToRad(90); // 将 30° 转换为弧度
const angleN90 = THREE.MathUtils.degToRad(-90); // 将 30° 转换为弧度
const angle180 = THREE.MathUtils.degToRad(180); // 将 180° 转换为弧度

camera.rotateX(angleN90); // 绕 X 轴旋转 30°
camera.rotateY(angle180); // 绕 Y 轴旋转 180°

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/disc.png');

const particleCount = 10;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);
 
// 初始化所有粒子在中心点，并赋予随机发射方向
for (let i = 0; i < particleCount; i++) {
  // 初始位置设为原点
  positions[i * 3] = 0;
  positions[i * 3 + 1] = 0;
  positions[i * 3 + 2] = -10;
 
  // 随机发射方向（极坐标转直角坐标）
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 0.5;
  
  // 添加随机水平方向速度
  velocities[i * 3] = Math.cos(angle) * speed;
  velocities[i * 3 + 1] = Math.cos(angle) * speed;
  velocities[i * 3 + 2] = Math.sin(angle) * speed;
}
 
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
 
// 创建粒子材质（示例材质）
const particleMaterial = new THREE.PointsMaterial({
  color: 0xFFFF00,
  transparent: true,
  size: 0.1,
});
 
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);
 
function animateParticles() {
  const positions = particleGeometry.attributes.position.array;
  const velocities = particleGeometry.attributes.velocity.array;
 
  for (let i = 0; i < particleCount; i++) {
    // 应用重力（模拟下落效果）
    velocities[i * 3 + 1] -= 0.08;
 
    // 更新位置
    positions[i * 3] += velocities[i * 3];
    positions[i * 3 + 1] += velocities[i * 3 + 1];
    positions[i * 3 + 2] += velocities[i * 3 + 2];
 
    // 边界检测：当粒子落到-5以下时重置
    if (positions[i * 3 + 1] < -5) {
      // 重置到发射点
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
 
      // 重新赋予随机方向
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.5;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = Math.cos(angle) * speed * 2;
      velocities[i * 3 + 2] = Math.sin(angle) * speed;
    }
  }
 
  particleGeometry.attributes.position.needsUpdate = true;
}

// 创建一个组来组合模型
const group = new THREE.Group();
scene.add(group);

// STL 模型路径列表
const modelPaths = [
  'pi.stl',
  'xian.stl',
  'pi.stl'
];

// 固定颜色列表
const colors = [
  0xEE9A00, // 皮
  0x8B4500, // 馅
  0xEE9A00 // 皮
];

// 加载 STL 模型的函数
function loadSTLModel(path, color) {
  return new Promise((resolve, reject) => {
    const loader = new STLLoader();
    loader.load(path, (geometry) => {
      const material = new THREE.MeshStandardMaterial({ color: color }); // 随机颜色
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(0.5,0.5,0.5);
      mesh.castShadow = true; // 允许模型投射阴影
      mesh.receiveShadow = true; // 允许模型接收阴影
      resolve(mesh);
    }, undefined, (error) => {
      reject(error);
    });
  });
}

// 加载所有 STL 模型并添加到场景中
let uppi, downpi, meat;
async function loadAllModels() {
  try{
    uppi = await loadSTLModel(modelPaths[0], colors[0])
  uppi.position.set(0,0.25,0);
  uppi.rotateX(angleN90);
  meat = await loadSTLModel(modelPaths[1], colors[1])
  meat.position.set(0,0,0);
  meat.rotateX(angleN90);
  downpi = await loadSTLModel(modelPaths[2], colors[2])
  downpi.position.set(0,0.1,0);
  downpi.rotateX(angle90);

  group.add(uppi);
  group.add(meat);
  group.add(downpi);

  animate();
  }catch (error) {
    console.error('Failed to load STL models:', error);
  }
  
}
  
// 启动加载过程
loadAllModels();


// 缓动函数：easeInOutQuad
function easeInOutQuad(t) {
  return t < 0.1 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 动画参数
let rotationProgress = 0; // 旋转进度（0 到 1）
const rotationSpeed = 0.02; // 旋转速度

// 动画循环
function animate() {
  requestAnimationFrame(animate);

  // 匀速自转
  // group.rotation.y += 0.05; // 每帧旋转 0.05 弧度

  // 缓入缓出
  // 更新旋转进度
  rotationProgress += rotationSpeed;
  if (rotationProgress > 1) rotationProgress = 0; // 重置进度
  if (rotationProgress > 0.3) animateParticles();

  // 使用缓动函数计算旋转角度
  const easedProgress = easeInOutQuad(rotationProgress);
  group.rotation.y = easedProgress * Math.PI * 2; // 旋转 360 度

  // 渲染场景
  renderer.render(scene, camera);
}


// // 导入stl
// // 加载STL模型
// const loader = new STLLoader();
// loader.load('pi.stl', function (geometry) { // 替换为你的STL文件路径
//   const material = new THREE.MeshStandardMaterial({ color: 0xEEAD0E }); // 材质设置
//   const mesh = new THREE.Mesh(geometry, material);
//   const angleZ = THREE.MathUtils.degToRad(-90); // 将 30° 转换为弧度

//   mesh.rotateX(angleZ);
//   mesh.castShadow = true;
//   mesh.receiveShadow = true;
//   scene.add(mesh);
  
// });