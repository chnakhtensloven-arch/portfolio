import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ProjectData, Language } from '../../types/portfolio';
import { t } from '../../data/translations';
import { X, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectData | null;
  lang: Language;
  onClose: () => void;
  onOrderProject: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  lang,
  onClose,
  onOrderProject
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  // 3D Canvas for Modal Mockup
  useEffect(() => {
    if (!project || !canvasMountRef.current) return;
    const container = canvasMountRef.current;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Lighting
    const key = new THREE.DirectionalLight(0xffeedd, 3.2);
    key.position.set(4, 4, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x4488ff, 1.5);
    fill.position.set(-4, -2, 3);
    scene.add(fill);

    const rim = new THREE.PointLight(0xf8dd1b, 3, 10);
    rim.position.set(0, 2, -3);
    scene.add(rim);

    // 3D Subject: A floating curved modern showcase slab / device
    const group = new THREE.Group();
    scene.add(group);

    // Load project image texture
    const textureLoader = new THREE.TextureLoader();
    const projectTexture = textureLoader.load(project.image, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
    });

    // Device Body
    const slabGeo = new THREE.BoxGeometry(2.4, 3.1, 0.15);
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0x181c22,
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.8
    });
    const frontMat = new THREE.MeshStandardMaterial({
      map: projectTexture,
      roughness: 0.3,
      metalness: 0.2
    });

    // Apply front screen to front face
    const materials = [
      frameMat, // right
      frameMat, // left
      frameMat, // top
      frameMat, // bottom
      frontMat, // front
      frameMat  // back
    ];

    const slabMesh = new THREE.Mesh(slabGeo, materials);
    group.add(slabMesh);

    // Outer Glowing Halo Ring
    const haloGeo = new THREE.TorusGeometry(2.2, 0.025, 16, 80);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xf5ce0d,
      emissive: 0xf8dd1b,
      emissiveIntensity: 0.8,
      metalness: 0.9
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI * 0.4;
    group.add(haloMesh);

    // Interaction dragging
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      targetRotY += dx * 0.01;
      targetRotX += dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animId = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      group.rotation.y = THREE.MathUtils.damp(
        group.rotation.y,
        targetRotY + (!isDragging ? Math.sin(elapsed * 0.8) * 0.35 : 0),
        5,
        delta
      );
      group.rotation.x = THREE.MathUtils.damp(
        group.rotation.x,
        targetRotX + (!isDragging ? Math.cos(elapsed * 0.6) * 0.15 : 0),
        5,
        delta
      );

      haloMesh.rotation.z += 0.01;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      slabGeo.dispose();
      haloGeo.dispose();
      frameMat.dispose();
      frontMat.dispose();
      haloMat.dispose();
      projectTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121519]/90 backdrop-blur-xl animate-fade-in"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#181c22] border border-[#2E3137] shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-6 sm:p-8 space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#2E3137] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F8DD1B]"></span>
            <span className="text-xs uppercase tracking-widest text-[#F8DD1B] font-bold">
              {t('Project Highlights', lang)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('Close Modal', lang)}
            className="w-10 h-10 rounded-full bg-[#121519] hover:bg-[#2E3137] border border-[#2E3137] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Showcase & Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive 3D Model Viewport */}
          <div className="md:col-span-5 relative rounded-2xl bg-[#121519] border border-[#2E3137] h-72 sm:h-80 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
            <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-full bg-[#121519]/80 border border-[#2E3137] text-[10px] text-[#86898B] font-mono flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-[#F8DD1B]" />
              <span>{t('Drag to rotate, scroll to zoom', lang)}</span>
            </div>
          </div>

          {/* Right: Technical Specs & Performance Proof */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.categoryKeys.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#2E3137] text-[#F8DD1B] border border-[#F8DD1B]/30"
                >
                  {t(cat, lang)}
                </span>
              ))}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t(project.titleKey, lang)}
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              {t(project.descriptionKey, lang)}
            </p>

            <p className="text-[#86898B] text-xs leading-relaxed">
              {t(project.detailsKey, lang)}
            </p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {project.metrics.map((m, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#121519]/80 border border-[#2E3137] text-center"
                >
                  <div className="text-lg font-black text-[#F8DD1B] font-mono">
                    {m.value}
                  </div>
                  <div className="text-[10px] text-[#86898B] mt-0.5 truncate">
                    {t(m.labelKey, lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div className="pt-2 border-t border-[#2E3137] space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-[#86898B] font-bold">
            Features & Strategic Implementations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.deliverablesKeys.map((itemKey) => (
              <div
                key={itemKey}
                className="flex items-center gap-2.5 text-xs text-gray-300 p-2.5 rounded-xl bg-[#121519]/60 border border-[#2E3137]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F8DD1B] shrink-0" />
                <span>{t(itemKey, lang)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-[#2E3137] flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#121519] hover:bg-[#2E3137] text-gray-300 text-xs font-semibold transition"
          >
            {t('Close Modal', lang)}
          </button>

          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-full bg-[#F5CE0D] hover:bg-[#F8DD1B] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,206,13,0.5)] hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>{t('View Project', lang)}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                onOrderProject(t(project.titleKey, lang));
                onClose();
              }}
              className="px-7 py-3 rounded-full bg-[#F5CE0D] hover:bg-[#F8DD1B] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(245,206,13,0.5)] hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>{t('Order Similar Project', lang)}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
