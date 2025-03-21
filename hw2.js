import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0xffffff, 1 );

document.body.appendChild(renderer.domElement);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


// 光源设置
const ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 平行光
// directionalLight.position.set(5, 10, 7.5).normalize();
// scene.add(directionalLight);

// 相机位置设置
camera.position.z = 5;

 // 加载STL模型
 const loader = new STLLoader();
 loader.load('demo2.stl', function (geometry) { // 替换为你的STL文件路径
     const material = new THREE.MeshStandardMaterial({ color: 0x0077ff }); // 材质设置
     const mesh = new THREE.Mesh(geometry, material);
     scene.add(mesh);

     // 渲染循环
     function animate() {
         requestAnimationFrame(animate);
         mesh.rotation.x += 0.01;
         mesh.rotation.y += 0.01;
         renderer.render(scene, camera);
     }
     animate();
 });

// // 加载 ShaderFrog 的 JSON 文件
// fetch('IceCube.json') // 替换为你的 JSON 文件路径
//     .then(response => response.json())
//     .then(shaderData => {
//         // console.log(shaderData);
//         // 解析 Shader 数据
//         const vertexShader = shaderData.vertex;
//         const fragmentShader = shaderData.fragment;
//         const uniforms = {};
//         console.log(vertexShader);
//         console.log(fragmentShader);

//         // 解析 uniforms
//         for (const key in shaderData.uniforms) {
//             const uniform = shaderData.uniforms[key];
//             switch (uniform.type) {
//                 case 'f': // float
//                     uniforms[key] = { value: parseFloat(uniform.value) };
//                     break;
//                 case 'c': // color (vec3)
//                     uniforms[key] = {
//                         value: new THREE.Color(
//                             uniform.value.r,
//                             uniform.value.g,
//                             uniform.value.b
//                         )
//                     };
//                     break;
//                 case 'v2': // vec2
//                     if (typeof uniform.value === 'object' && uniform.value.x !== undefined) {
//                         uniforms[key] = {
//                             value: new THREE.Vector2(
//                                 parseFloat(uniform.value.x),
//                                 parseFloat(uniform.value.y)
//                             )
//                         };
//                     } else {
//                         console.warn(`Uniform ${key} has invalid value for vec2:`, uniform.value);
//                         uniforms[key] = { value: new THREE.Vector2(0, 0) };
//                     }
//                     break;
//                 case 'v3': // vec3
//                     if (typeof uniform.value === 'object' && uniform.value.x !== undefined) {
//                         uniforms[key] = {
//                             value: new THREE.Vector3(
//                                 parseFloat(uniform.value.x),
//                                 parseFloat(uniform.value.y),
//                                 parseFloat(uniform.value.z)
//                             )
//                         };
//                     } else {
//                         console.warn(`Uniform ${key} has invalid value for vec3:`, uniform.value);
//                         uniforms[key] = { value: new THREE.Vector3(0, 0, 0) };
//                     }
//                     break;
//                 default:
//                     console.warn(`Unsupported uniform type: ${uniform.type}`);
//                     break;
//             }
//         }

//         // 创建 ShaderMaterial
//         const material = new THREE.ShaderMaterial({
//             vertexShader: vertexShader,
//             fragmentShader: fragmentShader,
//             uniforms: uniforms
//         });

//         // 创建几何体并应用 ShaderMaterial
//         const geometry = new THREE.BoxGeometry();
//         const cube = new THREE.Mesh(geometry, material);
//         scene.add(cube);

//         // 设置相机位置
//         camera.position.z = 5;

//         // 渲染循环
//         function animate() {
//             requestAnimationFrame(animate);

//             // 更新 uniform 变量（例如 time）
//             if (material.uniforms.time) {
//                 material.uniforms.time.value = performance.now() / 1000;
//             }

//             controls.update();
//             // 渲染场景
//             renderer.render(scene, camera);
//         }
//         animate();
//     })
//     .catch(error => {
//         console.error('Error loading ShaderFrog JSON:', error);
//     });