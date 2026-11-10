import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SKILLS_DATA } from '../../data/portfolioData';
import { Language } from '../../types/portfolio';
import { t } from '../../data/translations';

interface SkillOrb3DProps {
  lang: Language;
}

export const SkillOrb3D: React.FC<SkillOrb3DProps> = ({ lang }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.replaceChildren(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Central wireframe sphere cage in #2E3137
    const sphereGeo = new THREE.SphereGeometry(2.2, 18, 18);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x2e3137,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);

    // Glowing Skill Nodes positioned on Fibonacci sphere in #F5CE0D / #F8DD1B
    const nodeGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const numSkills = SKILLS_DATA.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    SKILLS_DATA.forEach((skill, i) => {
      const y = 1 - (i / (numSkills - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const scale = 2.2;
      const nodePos = new THREE.Vector3(x * scale, y * scale, z * scale);

      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0xf5ce0d,
        emissive: 0xf8dd1b,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.9
      });

      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.copy(nodePos);
      group.add(mesh);

      // Connecting line from center
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        nodePos
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xf8dd1b,
        transparent: true,
        opacity: 0.22
      });
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
    });

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.5);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    // Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0;
    let rotY = 0;

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let animId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      group.rotation.y = THREE.MathUtils.damp(
        group.rotation.y,
        rotY + (!isDragging ? elapsed * 0.25 : 0),
        5,
        delta
      );
      group.rotation.x = THREE.MathUtils.damp(
        group.rotation.x,
        rotX + (!isDragging ? Math.sin(elapsed * 0.4) * 0.2 : 0),
        5,
        delta
      );

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      sphereGeo.dispose();
      sphereMat.dispose();
      nodeGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] rounded-3xl bg-[#181c22] border border-[#2E3137] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Orbital Hint */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#121519]/80 backdrop-blur-md border border-[#2E3137] text-[11px] font-semibold text-[#F8DD1B]">
        3D Interactive Skill Constellation
      </div>

      <div className="absolute bottom-4 text-center pointer-events-none px-4 py-1.5 rounded-full bg-[#121519]/80 border border-[#2E3137] text-[10px] text-[#86898B]">
        {t('Drag to rotate, scroll to zoom', lang)}
      </div>
    </div>
  );
};
