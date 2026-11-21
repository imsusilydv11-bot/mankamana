import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { detectSoftwareWebGL } from './threeUtils';

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);

export function Ambient3DBanner() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisabled(true);
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setDisabled(true);
      return;
    }

    let viewW = container.clientWidth || window.innerWidth;
    let viewH = container.clientHeight || 320;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(viewW, viewH);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, viewW / Math.max(viewH, 1), 0.1, 60);

    const hemi = new THREE.HemisphereLight(0xf6ecd9, 0x1a1714, 0.65);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffe4b3, 1.45);
    key.position.set(5, 6, 5);
    scene.add(key);

    const pointerLight = new THREE.PointLight(0xc8a055, 2.2, 12, 1.5);
    pointerLight.position.set(2, 1, 3);
    scene.add(pointerLight);

    // Composite Architectural Brass & Obsidian Kinetic Rings
    const sculpture = new THREE.Group();

    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xc8a055,
      metalness: 0.92,
      roughness: 0.2,
      clearcoat: 0.65,
    });
    const darkBronzeMat = new THREE.MeshStandardMaterial({
      color: 0x3b2d21,
      metalness: 0.75,
      roughness: 0.34,
    });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.03, 16, 72), brassMat);
    outerRing.rotation.x = 0.55;
    sculpture.add(outerRing);

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.024, 16, 64), darkBronzeMat);
    innerRing.rotation.y = 0.75;
    sculpture.add(innerRing);

    const frameOcta = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), brassMat);
    sculpture.add(frameOcta);

    scene.add(sculpture);

    // Floating ambient warm dust particles via InstancedMesh
    const dustCount = 22;
    const dustGeo = new THREE.SphereGeometry(0.022, 8, 8);
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0xdcb973,
      transparent: true,
      opacity: 0.38,
    });
    const dust = new THREE.InstancedMesh(dustGeo, dustMat, dustCount);
    const seeds = Array.from({ length: dustCount }, (_, i) => ({
      x: ((i % 8) - 3.5) * 1.45 + Math.sin(i * 4.1) * 0.35,
      y: (Math.floor(i / 8) - 1) * 1.05 + Math.cos(i * 2.9) * 0.28,
      z: (Math.sin(i * 6.2) - 0.5) * 2.0,
      speed: 0.28 + (i % 4) * 0.09,
      phase: i * 0.85,
    }));
    seeds.forEach((s, i) => {
      _pos.set(s.x, s.y, s.z);
      _mat4.compose(_pos, _quat, _scale);
      dust.setMatrixAt(i, _mat4);
    });
    dust.computeBoundingSphere();
    scene.add(dust);

    let baseCamZ = 7.5;
    let baseSculptureY = 0;

    const applyResponsiveLayout = (w: number, h: number) => {
      viewW = Math.max(w, 1);
      viewH = Math.max(h, 1);
      const aspect = viewW / viewH;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(viewW, viewH);

      const isCompact = viewW < 768 || aspect < 1.0;

      if (isCompact) {
        // Pull camera back on portrait/mobile containers so geometry never clips edges
        baseCamZ = Math.min(13.0, Math.max(8.5, 7.2 / Math.max(aspect, 0.45) * 0.62));
        const mobileScale = Math.max(0.54, Math.min(0.8, viewW / 540));
        sculpture.scale.setScalar(mobileScale);
        // Position neatly toward upper-right header band rather than slicing mid-screen cards
        baseSculptureY = viewH > 500 ? 1.95 : 0.25;
        sculpture.position.set(aspect < 0.7 ? 0.55 : 1.4, baseSculptureY, -1.0);
      } else {
        baseCamZ = 7.5;
        sculpture.scale.setScalar(Math.min(1, viewW / 1100 + 0.15));
        baseSculptureY = viewH > 430 ? 0.95 : 0.05;
        sculpture.position.set(Math.min(3.1, aspect * 1.35), baseSculptureY, -0.8);
      }

      camera.position.set(0, 0.25, baseCamZ);
      camera.lookAt(0, 0, 0);
    };

    applyResponsiveLayout(viewW, viewH);

    let pointerX = 0;
    let pointerY = 0;
    let isVisible = true;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        applyResponsiveLayout(rect.width, rect.height);
      }
    });
    resizeObserver.observe(container);

    const onResize = () => {
      if (!container) return;
      applyResponsiveLayout(container.clientWidth || window.innerWidth, container.clientHeight || 320);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setDisabled(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 90);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 90);
        }
      };
      frameId = window.setTimeout(poll, 6);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (isVisible) {
        sculpture.rotation.y = THREE.MathUtils.damp(
          sculpture.rotation.y,
          pointerX * 0.45 + elapsed * 0.15,
          4,
          dt
        );
        sculpture.rotation.x = THREE.MathUtils.damp(
          sculpture.rotation.x,
          pointerY * 0.28,
          4,
          dt
        );
        sculpture.position.y = baseSculptureY + Math.sin(elapsed * 0.85) * 0.08;

        outerRing.rotation.z = elapsed * 0.14;
        innerRing.rotation.x = -elapsed * 0.2;
        frameOcta.rotation.y = elapsed * 0.35;

        pointerLight.position.x = THREE.MathUtils.damp(pointerLight.position.x, pointerX * 4.5, 5, dt);
        pointerLight.position.y = THREE.MathUtils.damp(pointerLight.position.y, -pointerY * 2.5, 5, dt);

        camera.position.x = THREE.MathUtils.damp(camera.position.x, pointerX * 0.32, 3.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.25 - pointerY * 0.18, 3.5, dt);
        camera.position.z = baseCamZ;
        camera.lookAt(0, 0, 0);

        for (let i = 0; i < dustCount; i++) {
          const s = seeds[i];
          _pos.set(
            s.x + Math.sin(elapsed * s.speed + s.phase) * 0.2 + pointerX * 0.14,
            s.y + Math.cos(elapsed * s.speed * 0.8 + s.phase) * 0.14 - pointerY * 0.12,
            s.z
          );
          _mat4.compose(_pos, _quat, _scale);
          dust.setMatrixAt(i, _mat4);
        }
        dust.instanceMatrix.needsUpdate = true;

        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      brassMat.dispose();
      darkBronzeMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      sculpture.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (disabled) return null;

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full opacity-45 md:opacity-65"
    />
  );
}
