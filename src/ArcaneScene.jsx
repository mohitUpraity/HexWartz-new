import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const palette = {
  stone: 0x211c1c,
  stoneLight: 0x46342d,
  shadow: 0x110d0f,
  roof: 0x1b0e14,
  gold: 0xcda85e,
  window: 0xf4bd66,
};

function material(color, roughness = 0.88, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, ...extra });
}

function box(parent, x, y, z, width, height, depth, mat, rotation = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotation;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function archWindow(parent, x, y, z, width, height) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(-width / 2, height * 0.6);
  shape.quadraticCurveTo(-width / 2, height, 0, height);
  shape.quadraticCurveTo(width / 2, height, width / 2, height * 0.6);
  shape.lineTo(width / 2, 0);
  shape.closePath();
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({
    color: palette.window, transparent: true, opacity: 0.92,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  }));
  mesh.position.set(x, y, z);
  parent.add(mesh);
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(width * 2.8, height * 2.2), new THREE.MeshBasicMaterial({
    color: palette.window, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  halo.position.set(x, y + height * 0.46, z - 0.025);
  parent.add(halo);
}

function tower(parent, x, z, radius, height, options = {}) {
  const group = new THREE.Group();
  parent.add(group);
  const { y = 0, roofHeight = radius * 1.75, sides = 8, stone = palette.stone, texture } = options;
  const towerMat = material(stone, 0.92, texture ? { map: texture, bumpMap: texture, bumpScale: 0.045 } : {});
  const roofMat = material(palette.roof, 0.75, { metalness: 0.18 });
  const trimMat = material(palette.stoneLight, 0.76);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.09, height, sides), towerMat);
  base.position.y = y + height / 2;
  base.castShadow = base.receiveShadow = true;
  group.add(base);

  const lip = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.06, radius * 1.1, 0.17, sides), trimMat);
  lip.position.y = y + height - 0.05;
  lip.castShadow = true;
  group.add(lip);
  const inlay = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.01, 0.025, 6, 32), material(palette.gold, 0.38, { metalness: 0.68, emissive: 0x4b2d15, emissiveIntensity: 0.15 }));
  inlay.position.y = y + height - 0.14;
  inlay.rotation.x = Math.PI / 2;
  group.add(inlay);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(radius * 1.08, roofHeight, sides), roofMat);
  roof.position.y = y + height + roofHeight / 2 - 0.05;
  roof.castShadow = true;
  group.add(roof);
  const finial = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.13, 0.48, 6), material(palette.gold, 0.34, { metalness: 0.62 }));
  finial.position.y = y + height + roofHeight + 0.12;
  group.add(finial);

  for (let i = 0; i < sides; i += 1) {
    const angle = (i / sides) * Math.PI * 2;
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.34, 0.35, radius * 0.34), trimMat);
    merlon.position.set(Math.cos(angle) * radius * 0.94, y + height + 0.18, Math.sin(angle) * radius * 0.94);
    merlon.rotation.y = -angle;
    merlon.castShadow = true;
    group.add(merlon);
  }

  const windowMat = new THREE.MeshBasicMaterial({ color: palette.window, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const windowGeo = new THREE.PlaneGeometry(radius * 0.28, height * 0.23);
  for (let row = 0; row < 2; row += 1) {
    const window = new THREE.Mesh(windowGeo, windowMat);
    window.position.set(0, y + height * (0.31 + row * 0.34), radius * 1.012);
    group.add(window);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(radius * 0.8, height * 0.35), new THREE.MeshBasicMaterial({ color: palette.window, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.set(0, window.position.y + height * 0.12, radius * 1.018);
    group.add(glow);
  }
  group.position.set(x, 0, z);
  return group;
}

function createCastle(scene, stoneTexture) {
  const castle = new THREE.Group();
  scene.add(castle);
  const stoneOptions = { map: stoneTexture, bumpMap: stoneTexture, bumpScale: 0.05 };
  const wall = material(palette.stone, 0.92, stoneOptions);
  const wing = material(0x33282a, 0.94, stoneOptions);
  const trim = material(palette.stoneLight, 0.82, stoneOptions);
  const roof = material(palette.roof, 0.78, { metalness: 0.12 });

  // Back keep and its connecting wings create a readable, layered silhouette.
  box(castle, 0, 1.8, -1.25, 3.5, 5.7, 1.8, wall);
  box(castle, -3.9, 1.1, -1.3, 4.6, 3.9, 1.6, wing);
  box(castle, 3.9, 1.1, -1.3, 4.6, 3.9, 1.6, wing);
  box(castle, 0, 0.25, -0.1, 2.3, 2.6, 1.8, trim);
  box(castle, 0, 0.03, 0.08, 4.7, 0.24, 2.25, trim);

  // A stepped roofline and stone teeth catch the moonlight.
  for (const side of [-1, 1]) {
    box(castle, side * 4.12, 3.16, -1.27, 4.48, 0.18, 1.72, trim);
    for (let i = 0; i < 7; i += 1) {
      box(castle, side * (2.15 + i * 0.65), 3.41, -1.27, 0.31, 0.38, 0.3, trim);
    }
    const roofPiece = new THREE.Mesh(new THREE.ConeGeometry(2.34, 1.5, 4), roof);
    roofPiece.position.set(side * 3.9, 3.98, -1.3);
    roofPiece.rotation.y = Math.PI / 4;
    roofPiece.scale.z = 0.54;
    roofPiece.castShadow = true;
    castle.add(roofPiece);
  }
  box(castle, 0, 4.76, -1.25, 3.58, 0.18, 1.86, trim);
  for (let i = 0; i < 6; i += 1) box(castle, -1.5 + i * 0.6, 5.02, -1.25, 0.29, 0.4, 0.3, trim);

  // Round towers punctuate the far corners and foreground walls.
  tower(castle, -6.1, -1.18, 0.72, 5.4, { y: -1.05, roofHeight: 2.55, stone: 0x292222, texture: stoneTexture });
  tower(castle, 6.1, -1.18, 0.72, 5.4, { y: -1.05, roofHeight: 2.55, stone: 0x292222, texture: stoneTexture });
  // A staggered crown breaks the flat roofline into a layered, distant skyline.
  tower(castle, 0, -1.72, 0.62, 5.5, { y: -0.9, roofHeight: 3.3, stone: 0x403532, texture: stoneTexture });
  tower(castle, -1.85, -1.42, 0.46, 4.5, { y: 0.1, roofHeight: 2.8, stone: 0x39302e, texture: stoneTexture });
  tower(castle, 1.85, -1.42, 0.47, 4.7, { y: 0.1, roofHeight: 2.95, stone: 0x39302e, texture: stoneTexture });
  tower(castle, -3.25, -1.56, 0.37, 4.3, { y: 0, roofHeight: 2.6, stone: 0x33282a, texture: stoneTexture });
  tower(castle, 3.2, -1.56, 0.38, 4.45, { y: 0, roofHeight: 2.75, stone: 0x33282a, texture: stoneTexture });
  tower(castle, -4.85, -0.2, 0.42, 3.45, { y: -1.04, roofHeight: 1.65, stone: 0x21191c, texture: stoneTexture });
  tower(castle, 4.85, -0.2, 0.42, 3.45, { y: -1.04, roofHeight: 1.65, stone: 0x21191c, texture: stoneTexture });

  // Rows of pointed windows make the architecture legible at a distance.
  for (const x of [-4.85, -3.45, -2.8, -1.45, -0.78, 0.78, 1.45, 2.8, 3.45, 4.85]) {
    const isWing = Math.abs(x) > 2.15;
    const z = isWing ? -0.48 : -0.29;
    const levels = isWing ? [0.35, 1.2, 2.05] : [0.45, 1.18, 2.0, 2.88, 3.76];
    levels.forEach((y, i) => {
      if (isWing && (Math.abs(x) > 4.4) !== (i % 2 === 0)) return;
      archWindow(castle, x, y, z, 0.2, 0.42);
    });
  }

  // An arched entrance and a narrow suspended causeway.
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.15), material(0x080609, 0.96));
  door.position.set(0, -0.55, 1.005);
  castle.add(door);
  const bridge = box(castle, 0, -1.12, 2.05, 1.2, 0.17, 4.15, material(0x292125));
  bridge.rotation.x = -0.01;

  return castle;
}

function createOpenBook(scene) {
  const book = new THREE.Group();
  scene.add(book);
  const leather = material(0x3b171b, 0.68, { metalness: 0.12 });
  const page = material(0xb8a47e, 0.93);
  const gold = material(palette.gold, 0.4, { metalness: 0.72 });
  box(book, 0, 0, 0, 3.5, 0.18, 2.35, leather);
  box(book, 0, 0.12, 0, 0.12, 0.12, 2.18, gold);
  const leftPage = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.06, 2.04), page);
  leftPage.position.set(-0.82, 0.17, 0);
  leftPage.rotation.z = -0.08;
  book.add(leftPage);
  const rightPage = leftPage.clone();
  rightPage.position.x = 0.82;
  rightPage.rotation.z = 0.08;
  book.add(rightPage);
  // Fine gilded page edges and a visible embossed cover make the book read at a distance.
  for (const side of [-1, 1]) {
    const pageEdge = box(book, side * 0.83, 0.12, 0, 1.48, 0.08, 2.12, gold);
    pageEdge.position.y = 0.13;
    pageEdge.rotation.z = side * 0.08;
    for (let row = 0; row < 6; row += 1) {
      const line = box(book, side * 0.82, 0.215, -0.62 + row * 0.24, row % 3 === 0 ? 0.82 : 0.68, 0.012, 0.014, material(0x88714a, 0.84));
      line.position.x += side * (row % 2 ? 0.04 : -0.02);
    }
  }
  const sigil = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.025, 8, 48), gold);
  sigil.position.set(0, 0.21, 0.02);
  sigil.rotation.x = Math.PI / 2;
  book.add(sigil);
  book.position.set(0, -1.3, 4.2);
  book.rotation.x = -0.88;
  book.scale.setScalar(0.92);
  return book;
}

function createOwl(scene) {
  const owl = new THREE.Group();
  scene.add(owl);
  const feather = material(0x5a4738, 0.88);
  const lightFeather = material(0xb6a487, 0.92);
  const dark = material(0x211a1a, 0.62);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.72, 20, 16), feather);
  body.scale.set(0.76, 1.12, 0.62);
  body.position.y = -0.12;
  owl.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 16), feather);
  head.position.set(0, 0.66, 0.12);
  owl.add(head);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), lightFeather);
    eye.position.set(side * 0.22, 0.66, 0.63);
    owl.add(eye);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 10), material(0xb0834f, 0.58));
    iris.position.set(side * 0.22, 0.66, 0.79);
    owl.add(iris);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), dark);
    pupil.position.set(side * 0.22, 0.66, 0.89);
    owl.add(pupil);
    const wing = new THREE.Mesh(new THREE.SphereGeometry(0.67, 16, 12), feather);
    wing.scale.set(0.42, 0.96, 0.19);
    wing.position.set(side * 0.65, -0.08, 0.02);
    wing.rotation.z = side * -0.38;
    owl.add(wing);
    owl.userData[`wing${side}`] = wing;
  }
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.26, 5), material(0xc58c48, 0.72));
  beak.position.set(0, 0.37, 0.78);
  beak.rotation.x = Math.PI / 2;
  owl.add(beak);
  owl.position.set(-5.8, 3.6, 1.5);
  owl.scale.setScalar(0.9);
  return owl;
}

function createArc(scene) {
  const arcGroup = new THREE.Group();
  scene.add(arcGroup);
  const gold = new THREE.MeshStandardMaterial({ color: 0xc99b55, roughness: 0.28, metalness: 0.78, emissive: 0x5c3215, emissiveIntensity: 0.24 });
  const halo = new THREE.MeshBasicMaterial({ color: 0x9d632c, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(8.8, 0.035, 8, 160), gold);
  ring.position.set(0, 3.2, -6.5);
  arcGroup.add(ring);
  const ringHalo = new THREE.Mesh(new THREE.TorusGeometry(8.88, 0.16, 8, 160), halo);
  ringHalo.position.copy(ring.position);
  arcGroup.add(ringHalo);
  const vertical = new THREE.Mesh(new THREE.TorusGeometry(9.15, 0.018, 6, 160), gold);
  vertical.position.copy(ring.position);
  vertical.rotation.x = Math.PI / 2;
  vertical.scale.set(0.85, 1, 1);
  arcGroup.add(vertical);
  return arcGroup;
}

function moonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(340, 290, 60, 510, 510, 520);
  gradient.addColorStop(0, '#e8e1d3');
  gradient.addColorStop(0.58, '#aaa9a5');
  gradient.addColorStop(1, '#66717c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);
  let seed = 53;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 420; i += 1) {
    const radius = 3 + random() * 42;
    const x = random() * 1024;
    const y = random() * 1024;
    const shade = Math.floor(52 + random() * 74);
    ctx.fillStyle = `rgba(${shade},${shade + 5},${shade - 3},${0.025 + random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(44,54,49,.09)';
    ctx.lineWidth = 1 + random() * 3;
    ctx.beginPath();
    ctx.arc(x - radius * 0.12, y - radius * 0.1, radius * 0.65, 0.05, Math.PI * 1.8);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function castleStoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const context = canvas.getContext('2d');
  context.fillStyle = '#8b7c73';
  context.fillRect(0, 0, 512, 512);
  let seed = 991;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const rows = 8;
  const rowHeight = 64;
  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 ? -32 : 0;
    for (let col = -1; col < 9; col += 1) {
      const shade = 126 + Math.floor(random() * 42);
      context.fillStyle = `rgb(${shade + 12},${shade + 3},${shade - 2})`;
      context.fillRect(col * 64 + offset + 2, row * rowHeight + 2, 60, 60);
      context.fillStyle = `rgba(28,17,15,${0.12 + random() * 0.12})`;
      context.fillRect(col * 64 + offset + 2, row * rowHeight + 2, 60, 2);
    }
  }
  for (let i = 0; i < 18000; i += 1) {
    const shade = random() > 0.5 ? 255 : 18;
    context.fillStyle = `rgba(${shade},${shade},${shade},${random() * 0.09})`;
    context.fillRect(random() * 512, random() * 512, 1 + random() * 2, 1 + random() * 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.anisotropy = 8;
  return texture;
}

function stars(count, spread, size, color, opacity = 1) {
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = Math.random() * spread * 0.7 - 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    randoms[i] = Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true, depthWrite: false }));
  return points;
}

function createFogTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(256, 64, 10, 256, 64, 250);
  gradient.addColorStop(0, 'rgba(196,206,185,.35)');
  gradient.addColorStop(0.45, 'rgba(155,173,160,.13)');
  gradient.addColorStop(1, 'rgba(110,134,125,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 128);
  return new THREE.CanvasTexture(canvas);
}

export default function ArcaneScene({ progress }) {
  const mount = useRef(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    const host = mount.current;
    if (!host) return undefined;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = motionPreference.matches;
    const onMotionPreference = (event) => { reduceMotion = event.matches; };
    motionPreference.addEventListener('change', onMotionPreference);
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      host.classList.add('scene-unavailable');
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x100d11, 0.026);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 140);
    camera.position.set(0, 1.2, 19);
    camera.lookAt(0, 1.3, -2.5);

    scene.add(new THREE.AmbientLight(0xc3a987, 0.38));
    const moonLight = new THREE.DirectionalLight(0xe5d1aa, 3.6);
    moonLight.position.set(-5, 10, 8);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.set(1024, 1024);
    moonLight.shadow.camera.left = -11;
    moonLight.shadow.camera.right = 11;
    moonLight.shadow.camera.top = 10;
    moonLight.shadow.camera.bottom = -7;
    scene.add(moonLight);
    const torchLight = new THREE.PointLight(0xf0ad59, 28, 18, 2);
    torchLight.position.set(0, 1, 1.8);
    scene.add(torchLight);
    const cursorLight = new THREE.PointLight(0xd2ae72, 3, 12, 2);
    cursorLight.position.set(0, 3, 4);
    scene.add(cursorLight);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(3.85, 48, 48),
      new THREE.MeshStandardMaterial({ map: moonTexture(), roughness: 0.95, metalness: 0, emissive: 0x28232a, emissiveIntensity: 0.12 }),
    );
    moon.position.set(2.65, 6.0, -11);
    scene.add(moon);
    const moonHalo = new THREE.Mesh(
      new THREE.SphereGeometry(4.15, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0xd4d7b8, transparent: true, opacity: 0.035, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    moonHalo.position.copy(moon.position);
    scene.add(moonHalo);

    const castle = createCastle(scene, castleStoneTexture());
    castle.position.x = 2.2;
    castle.position.y = -1.05;
    castle.scale.setScalar(1.05);
    const celestialArc = createArc(scene);
    celestialArc.position.x = 2.2;

    const groundMaterial = material(0x100d10, 1);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 160), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -1.1, -21);
    ground.receiveShadow = true;
    scene.add(ground);

    const treeMaterial = material(0x100d11, 1);
    const treeFar = new THREE.Group();
    scene.add(treeFar);
    for (let i = 0; i < 46; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (7.8 + Math.random() * 12);
      const y = -0.6 + Math.random() * 0.4;
      const z = -3 - Math.random() * 20;
      const height = 2.4 + Math.random() * 5.5;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, height * 0.35, 5), treeMaterial);
      trunk.position.set(x, y + height * 0.12, z);
      treeFar.add(trunk);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.65 + Math.random() * 0.65, height, 6), treeMaterial);
      crown.position.set(x, y + height * 0.48, z);
      crown.rotation.y = Math.random() * Math.PI;
      treeFar.add(crown);
    }

    const starField = stars(1300, 95, 0.045, 0xd8d8bd, 0.86);
    starField.position.y = 4;
    scene.add(starField);
    const motes = stars(200, 22, 0.075, 0xe7bf78, 0.8);
    motes.position.set(0, -0.5, -0.6);
    scene.add(motes);
    const fogTexture = createFogTexture();
    const fogs = [];
    for (let i = 0; i < 4; i += 1) {
      const material = new THREE.MeshBasicMaterial({ map: fogTexture, transparent: true, opacity: 0.34 - i * 0.04, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xa9b8a8 });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(18 + i * 4, 3 + i * 0.5), material);
      plane.position.set((i - 1.5) * 4, -0.5 + i * 0.18, 1 - i * 5);
      plane.rotation.x = -0.04;
      scene.add(plane);
      fogs.push(plane);
    }

    const pointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      if (reduceMotion) return;
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      cursorLight.position.set(pointer.x * 8, 4 - pointer.y * 3, 3.5);
    };
    const onPointerLeave = () => { pointer.x = 0; pointer.y = 0; };
    const unsubscribeProgress = progress?.on('change', (value) => { scrollProgress.current = value; });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });

    const resize = () => {
      const width = host.clientWidth || window.innerWidth;
      const height = host.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = width < 700 ? 47 : 38;
      camera.position.z = width < 700 ? 22.5 : 19;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const sceneStart = performance.now();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - sceneStart) / 1000;
      const scroll = scrollProgress.current;
      currentPointer.x += (pointer.x - currentPointer.x) * 0.035;
      currentPointer.y += (pointer.y - currentPointer.y) * 0.035;
      castle.rotation.y = currentPointer.x * 0.035 + Math.sin(t * 0.08) * 0.006;
      castle.position.y = -1.05 + scroll * 0.55;
      castle.scale.setScalar(1.05 + scroll * 0.42);
      camera.position.x = currentPointer.x * 0.42;
      camera.position.y = 1.2 - currentPointer.y * 0.2 + scroll * 0.3;
      camera.position.z = (window.innerWidth < 700 ? 22.5 : 19) - scroll * 7;
      camera.lookAt(1.1, 1.1 + scroll * 0.45, -2.5);
      moon.position.x = 2.65 - currentPointer.x * 0.35;
      moon.position.y = 6 + scroll * 1.65;
      moonHalo.position.copy(moon.position);
      if (!reduceMotion) celestialArc.rotation.z = -0.018 + Math.sin(t * 0.1) * 0.008;
      if (!reduceMotion) {
        starField.rotation.y = t * 0.0015;
        motes.rotation.y = t * 0.018;
        motes.rotation.x = Math.sin(t * 0.12) * 0.035;
        motes.position.y = -0.5 + Math.sin(t * 0.25) * 0.18;
        fogs.forEach((fog, i) => {
          fog.position.x = (i - 1.5) * 4 + Math.sin(t * (0.1 + i * 0.012) + i) * 1.15;
          fog.material.opacity = 0.25 + Math.sin(t * 0.22 + i) * 0.045;
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      motionPreference.removeEventListener('change', onMotionPreference);
      unsubscribeProgress?.();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((mat) => { if (mat.map) mat.map.dispose(); mat.dispose(); });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="arcane-scene" ref={mount} aria-hidden="true"><div className="scene-wash" /></div>;
}
