"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { projects } from "./orbit-data";

function makeRenderer(container) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  return renderer;
}

function addSharedLights(scene, accent = 0x7cfc00) {
  scene.add(new THREE.AmbientLight(0x22222a, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9);
  rim.position.set(-5, 2, -4);
  scene.add(rim);
  const accentLight = new THREE.PointLight(accent, 4.4, 20, 1.6);
  accentLight.position.set(0, 2, 4);
  scene.add(accentLight);
  return accentLight;
}

function addGrid(scene) {
  const group = new THREE.Group();
  for (let i = 0; i < 3; i += 1) {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 32, 30, 30),
      new THREE.MeshBasicMaterial({
        color: 0x1a1a1f,
        wireframe: true,
        transparent: true,
        opacity: 0.28 - i * 0.08,
      }),
    );
    plane.position.z = -6 - i * 2;
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -3 - i * 0.4;
    group.add(plane);
  }
  scene.add(group);
  return group;
}

function setupLanding(scene) {
  scene.fog = new THREE.Fog(0x0a0a0b, 6, 22);
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  const knotGeo = new THREE.TorusKnotGeometry(0.9, 0.3, 240, 32, 2, 3);
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4f4f2,
    metalness: 0.95,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  heroGroup.add(knot);

  const wire = new THREE.Mesh(
    knotGeo,
    new THREE.MeshBasicMaterial({
      color: 0x7cfc00,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    }),
  );
  wire.scale.setScalar(1.015);
  heroGroup.add(wire);

  const satellites = [];
  [
    { geo: new THREE.IcosahedronGeometry(0.22), r: 2.4, phase: 0, speed: 0.4, tilt: 0.1, color: 0xf4f4f2, metalness: 1, roughness: 0.25 },
    { geo: new THREE.BoxGeometry(0.35, 0.35, 0.35), r: 2.9, phase: 1.8, speed: 0.3, tilt: -0.2, color: 0x111111, metalness: 0.2, roughness: 0.9 },
    { geo: new THREE.SphereGeometry(0.14, 24, 24), r: 3.3, phase: 3.3, speed: 0.55, tilt: 0.35, color: 0x7cfc00, emissive: true },
    { geo: new THREE.OctahedronGeometry(0.18), r: 2, phase: 4.9, speed: -0.35, tilt: -0.15, color: 0xf4f4f2, metalness: 0.9, roughness: 0.3 },
    { geo: new THREE.TorusGeometry(0.28, 0.03, 16, 64), r: 3.6, phase: 2.4, speed: 0.22, tilt: 0.5, color: 0xf4f4f2, metalness: 0.9, roughness: 0.2 },
  ].forEach((item) => {
    const material = new THREE.MeshPhysicalMaterial({
      color: item.color,
      metalness: item.metalness ?? 0,
      roughness: item.roughness ?? 0.4,
      emissive: item.emissive ? item.color : 0x000000,
      emissiveIntensity: item.emissive ? 1.2 : 0,
    });
    const mesh = new THREE.Mesh(item.geo, material);
    mesh.userData = item;
    heroGroup.add(mesh);
    satellites.push(mesh);
  });

  return { heroGroup, satellites };
}

function setupProjects(scene) {
  scene.fog = new THREE.Fog(0x0a0a0b, 9, 28);
  const ring = new THREE.Group();
  scene.add(ring);
  const radius = 5.2;

  projects.forEach((project, index) => {
    const group = new THREE.Group();
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2.6, 0.08),
      new THREE.MeshPhysicalMaterial({
        color: 0xf4f4f2,
        metalness: 0.1,
        roughness: 0.55,
      }),
    );
    group.add(slab);

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = project.tone;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111214";
    ctx.font = '500 36px "Inter Tight", sans-serif';
    ctx.fillText(project.name, 28, 560);
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.fillText(project.type.toUpperCase(), 28, 596);
    ctx.strokeStyle = "#111214";
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
    ctx.beginPath();
    ctx.arc(256, 240, 120 - index * 6, 0, Math.PI * 2);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.88, 2.48),
      new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
    );
    face.position.z = 0.041;
    group.add(face);

    const angle = (index / projects.length) * Math.PI * 2;
    group.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
    group.rotation.y = angle;
    group.userData = { angle, index };
    ring.add(group);
  });

  const totem = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.04, 16, 120),
    new THREE.MeshPhysicalMaterial({
      color: 0x7cfc00,
      emissive: 0x7cfc00,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    }),
  );
  scene.add(totem);

  return { ring, totem };
}

function setupJournal(scene) {
  scene.fog = new THREE.Fog(0x0a0a0b, 8, 30);
  const waveGroup = new THREE.Group();
  scene.add(waveGroup);
  const geometry = new THREE.PlaneGeometry(22, 6, 180, 30);
  const basePositions = geometry.attributes.position.array.slice();

  const wave = new THREE.Mesh(
    geometry,
    new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1f,
      metalness: 0.2,
      roughness: 0.4,
      clearcoat: 0.6,
      side: THREE.DoubleSide,
    }),
  );
  wave.rotation.x = -0.6;
  wave.position.y = -0.8;
  waveGroup.add(wave);

  const wire = new THREE.Mesh(
    geometry.clone(),
    new THREE.MeshBasicMaterial({
      color: 0x7cfc00,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    }),
  );
  wire.rotation.x = -0.6;
  wire.position.y = -0.78;
  waveGroup.add(wire);

  return { waveGroup, geometry, wireGeometry: wire.geometry, basePositions };
}

function setupContact(scene) {
  scene.fog = new THREE.Fog(0x0a0a0b, 10, 30);
  const graph = new THREE.Group();
  scene.add(graph);
  const nodes = [];
  const lines = [];

  for (let i = 0; i < 24; i += 1) {
    const r = 3.4 + Math.random() * 1.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.8;
    const accent = i % 6 === 0;
    const node = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.09 + Math.random() * 0.1),
      new THREE.MeshPhysicalMaterial({
        color: accent ? 0x7cfc00 : 0xf0f0ee,
        metalness: accent ? 0 : 0.8,
        roughness: 0.3,
        emissive: accent ? 0x7cfc00 : 0x000000,
        emissiveIntensity: accent ? 1.1 : 0,
      }),
    );
    node.userData = {
      basePos: new THREE.Vector3(
        Math.cos(theta) * Math.cos(phi) * r,
        Math.sin(phi) * r * 0.6,
        Math.sin(theta) * Math.cos(phi) * r,
      ),
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
    };
    node.position.copy(node.userData.basePos);
    graph.add(node);
    nodes.push(node);
  }

  for (let i = 0; i < nodes.length - 1; i += 1) {
    const points = [nodes[i].position, nodes[(i + 3) % nodes.length].position];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: 0x3a3a3c, transparent: true, opacity: 0.55 }),
    );
    graph.add(line);
    lines.push(line);
  }

  return { graph, nodes, lines };
}

export function OrbitScene({ variant }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.6, variant === "landing" ? 7 : 11);
    const renderer = makeRenderer(container);
    addSharedLights(scene);
    const grid = addGrid(scene);

    let payload;
    if (variant === "landing") payload = setupLanding(scene);
    if (variant === "projects") payload = setupProjects(scene);
    if (variant === "journal") payload = setupJournal(scene);
    if (variant === "contact") payload = setupContact(scene);

    const pointer = { x: 0, y: 0 };
    const onMouseMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    let frameId = 0;
    const animate = (time) => {
      const t = time * 0.001;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const s = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.04;
      camera.position.y += ((variant === "journal" ? 1.2 : 0.6) - pointer.y * 0.2 - camera.position.y) * 0.04;
      camera.position.z += (((variant === "landing" ? 7 : 11) - s * (variant === "landing" ? 1.5 : 2.5)) - camera.position.z) * 0.04;
      camera.lookAt(0, Math.sin(s * Math.PI) * 0.2, 0);

      grid.position.z = s * 4;
      grid.rotation.z = s * 0.1;

      if (variant === "landing") {
        payload.heroGroup.rotation.y = s * Math.PI * 2.2 + t * 0.12 + pointer.x * 0.08;
        payload.heroGroup.rotation.x = Math.sin(s * Math.PI * 1.2) * 0.6 + pointer.y * 0.08;
        payload.heroGroup.scale.setScalar(1 + Math.sin(s * Math.PI) * 0.06);
        payload.satellites.forEach((mesh, index) => {
          const item = mesh.userData;
          const angle = t * item.speed + item.phase + s * Math.PI * 1.5;
          mesh.position.set(
            Math.cos(angle) * item.r,
            Math.sin(angle * 0.7 + item.phase) * 0.6 + item.tilt,
            Math.sin(angle) * item.r,
          );
          mesh.rotation.x += 0.01 + index * 0.002;
          mesh.rotation.y += 0.012;
        });
      }

      if (variant === "projects") {
        payload.ring.rotation.y = s * Math.PI * 2.1 + t * 0.04 + pointer.x * 0.1;
        payload.ring.rotation.x = Math.sin(s * Math.PI) * 0.15 + pointer.y * 0.05;
        payload.ring.children.forEach((card, index) => {
          card.position.y = Math.sin(t * 0.7 + index) * 0.05;
          card.rotation.z = Math.sin(t * 0.8 + index * 1.3) * 0.02;
        });
        payload.totem.rotation.x += 0.01;
        payload.totem.rotation.y += 0.02;
      }

      if (variant === "journal") {
        const { geometry, wireGeometry, basePositions, waveGroup } = payload;
        const pos = geometry.attributes.position.array;
        const wirePos = wireGeometry.attributes.position.array;
        const freq = 0.3 + s * 0.6;
        const amp = 0.35 + s * 0.9;
        for (let i = 0; i < pos.length; i += 3) {
          const bx = basePositions[i];
          const by = basePositions[i + 1];
          const z = Math.sin(bx * freq + t * 0.8) * amp * 0.5 + Math.cos(by * freq * 0.6 + t * 0.4) * amp * 0.35;
          pos[i + 2] = z;
          wirePos[i + 2] = z;
        }
        geometry.attributes.position.needsUpdate = true;
        wireGeometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        waveGroup.rotation.y = s * Math.PI * 0.6 + pointer.x * 0.1;
        waveGroup.rotation.z = Math.sin(s * Math.PI) * 0.08;
        waveGroup.position.y = -0.4 - s * 0.6;
      }

      if (variant === "contact") {
        payload.graph.rotation.y = s * Math.PI * 1.2 + t * 0.05 + pointer.x * 0.1;
        payload.graph.rotation.x = Math.sin(s * Math.PI) * 0.15 + pointer.y * 0.05;
        payload.nodes.forEach((node) => {
          const { basePos, phase, speed } = node.userData;
          node.position.x = basePos.x + Math.cos(t * speed + phase) * 0.25;
          node.position.y = basePos.y + Math.sin(t * speed + phase) * 0.15;
          node.position.z = basePos.z + Math.sin(t * speed * 0.7 + phase) * 0.2;
        });
        payload.lines.forEach((line, index) => {
          const a = payload.nodes[index].position;
          const b = payload.nodes[(index + 3) % payload.nodes.length].position;
          line.geometry.setFromPoints([a, b]);
        });
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [variant]);

  return <div ref={ref} className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true" />;
}
