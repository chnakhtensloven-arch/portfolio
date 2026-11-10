import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Hero3DCanvasProps {
  colorTheme?: 'amber' | 'blue' | 'emerald';
  autoRotateSpeed?: number;
  particlesEnabled?: boolean;
}

const THEME_COLORS = {
  amber: {
    primary: 0xf5ce0d, // #F5CE0D
    glow: 0xf8dd1b,    // #F8DD1B
    accent: 0xddac0d,  // #DDAC0D
    particle: 0xf8dd1b, // #F8DD1B
    ambient: 0x121519  // #121519
  },
  blue: {
    primary: 0x38bdf8,
    glow: 0x60a5fa,
    accent: 0x2563eb,
    particle: 0x93c5fd,
    ambient: 0x051322
  },
  emerald: {
    primary: 0x10b981,
    glow: 0x34d399,
    accent: 0x059669,
    particle: 0x6ee7b7,
    ambient: 0x052216
  }
};

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  colorTheme = 'amber',
  autoRotateSpeed = 1,
  particlesEnabled = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    group: THREE.Group;
    materials: THREE.Material[];
    geometries: THREE.BufferGeometry[];
    themeMeshRef: THREE.Mesh[];
    ringsRef: THREE.Mesh[];
    particlesRef?: THREE.Points;
  } | null>(null);

  // Mouse / Pointer normalized coordinates for parallax
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousPointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Setup Scene & Camera
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 3. Renderer with SRGB Color Space & ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // 4. Procedural Studio Environment for Specular Shine
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig (3-point Key, Fill, Rim)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 3.2);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4466aa, 1.8);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(THEME_COLORS[colorTheme].glow, 4.5, 12);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 6. 3D Model Assembly (Composite 3-12 part hierarchy)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const themeMeshRef: THREE.Mesh[] = [];
    const ringsRef: THREE.Mesh[] = [];

    const activeTheme = THEME_COLORS[colorTheme];

    // Core 1: Inner Geometric Polyhedron permanently set to wireframe mode by default
    const coreGeo = new THREE.IcosahedronGeometry(1.65, 1);
    geometries.push(coreGeo);
    const coreMat = new THREE.MeshStandardMaterial({
      color: activeTheme.primary,
      metalness: 0.85,
      roughness: 0.2,
      emissive: activeTheme.accent,
      emissiveIntensity: 0.5,
      wireframe: true
    });
    materials.push(coreMat);
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);
    themeMeshRef.push(coreMesh);

    // Core 2: Inner Glowing Wire Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.72, 1);
    geometries.push(cageGeo);
    const cageMat = new THREE.MeshStandardMaterial({
      color: activeTheme.glow,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      emissive: activeTheme.primary,
      emissiveIntensity: 0.8
    });
    materials.push(cageMat);
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    mainGroup.add(cageMesh);
    themeMeshRef.push(cageMesh);

    // Core 3: Orbiting Torus Ring Alpha (solid metallic glowing ring)
    const ring1Geo = new THREE.TorusGeometry(2.5, 0.045, 16, 100);
    geometries.push(ring1Geo);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: activeTheme.primary,
      metalness: 0.95,
      roughness: 0.15,
      emissive: activeTheme.accent,
      emissiveIntensity: 0.35,
      wireframe: false
    });
    materials.push(ring1Mat);
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI * 0.35;
    ring1Mesh.rotation.y = Math.PI * 0.15;
    mainGroup.add(ring1Mesh);
    ringsRef.push(ring1Mesh);
    themeMeshRef.push(ring1Mesh);

    // Core 4: Orbiting Torus Ring Beta
    const ring2Geo = new THREE.TorusGeometry(2.85, 0.035, 16, 100);
    geometries.push(ring2Geo);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.25,
      emissive: activeTheme.glow,
      emissiveIntensity: 0.2,
      wireframe: false
    });
    materials.push(ring2Mat);
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI * 0.38;
    ring2Mesh.rotation.z = Math.PI * 0.2;
    mainGroup.add(ring2Mesh);
    ringsRef.push(ring2Mesh);
    themeMeshRef.push(ring2Mesh);

    // Core 5: Orbiting Satellites (Tiny diamond nodes)
    const satelliteGeo = new THREE.OctahedronGeometry(0.12);
    geometries.push(satelliteGeo);
    const satelliteMat = new THREE.MeshStandardMaterial({
      color: activeTheme.glow,
      emissive: activeTheme.primary,
      emissiveIntensity: 0.9,
      metalness: 0.8
    });
    materials.push(satelliteMat);

    const satelliteGroup = new THREE.Group();
    mainGroup.add(satelliteGroup);
    const numSatellites = 6;
    for (let i = 0; i < numSatellites; i++) {
      const angle = (i / numSatellites) * Math.PI * 2;
      const dist = 2.5;
      const sat = new THREE.Mesh(satelliteGeo, satelliteMat);
      sat.position.set(Math.cos(angle) * dist, (Math.sin(angle * 2) * 0.4), Math.sin(angle) * dist);
      satelliteGroup.add(sat);
    }

    // 7. Ambient Particle Constellation (Zero external texture)
    let particlesMesh: THREE.Points | undefined;
    if (particlesEnabled && !isSoftwareGl) {
      const particleCount = 240;
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const radius = 3.2 + Math.random() * 3.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        scales[i] = Math.random() * 0.05 + 0.02;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometries.push(particleGeo);

      const particleMat = new THREE.PointsMaterial({
        color: activeTheme.particle,
        size: 0.065,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      materials.push(particleMat);

      particlesMesh = new THREE.Points(particleGeo, particleMat);
      scene.add(particlesMesh);
    }

    sceneRef.current = {
      renderer,
      scene,
      camera,
      group: mainGroup,
      materials,
      geometries,
      themeMeshRef,
      ringsRef,
      particlesRef: particlesMesh
    };

    // 8. Event Handlers: Mouse tracking and Interaction
    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      previousPointerPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - previousPointerPos.current.x;
        const deltaY = e.clientY - previousPointerPos.current.y;
        targetRotation.current.y += deltaX * 0.007;
        targetRotation.current.x += deltaY * 0.007;
        previousPointerPos.current = { x: e.clientX, y: e.clientY };
      } else {
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotation.current.x = ny * 0.45;
        targetRotation.current.y = nx * 0.65;
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // 10. Silky Damping Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Exponential damping on user tilt
      currentRotation.current.x = THREE.MathUtils.damp(
        currentRotation.current.x,
        targetRotation.current.x,
        6,
        delta
      );
      currentRotation.current.y = THREE.MathUtils.damp(
        currentRotation.current.y,
        targetRotation.current.y,
        6,
        delta
      );

      // Continuous autonomous rotation
      const baseSpin = elapsedTime * 0.35 * autoRotateSpeed;
      mainGroup.rotation.y = baseSpin + currentRotation.current.y;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.15 + currentRotation.current.x;

      // Orbiting rings counter-rotation
      if (ring1Mesh) ring1Mesh.rotation.z += 0.008 * autoRotateSpeed;
      if (ring2Mesh) ring2Mesh.rotation.y -= 0.006 * autoRotateSpeed;
      if (satelliteGroup) satelliteGroup.rotation.y += 0.012 * autoRotateSpeed;

      // Gentle floating bob
      mainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

      // Particles ambient drift
      if (particlesMesh) {
        particlesMesh.rotation.y = elapsedTime * 0.04;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, []);

  // Update theme colors in-place when props change
  useEffect(() => {
    if (!sceneRef.current) return;
    const activeTheme = THEME_COLORS[colorTheme];

    if (sceneRef.current.particlesRef) {
      (sceneRef.current.particlesRef.material as THREE.PointsMaterial).color.setHex(
        activeTheme.particle
      );
    }
  }, [colorTheme]);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* Three.js Isolated Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Hint Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none px-3.5 py-1.5 rounded-full bg-[#121519]/80 backdrop-blur-md border border-[#2E3137] text-[11px] font-medium text-[#86898B] tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F8DD1B]"></span>
        <span>Interactive 3D Engine · Drag to Rotate</span>
      </div>
    </div>
  );
};
