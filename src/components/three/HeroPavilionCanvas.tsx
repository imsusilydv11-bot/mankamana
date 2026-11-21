import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createWoodTexture, detectSoftwareWebGL } from './threeUtils';

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);

export function HeroPavilionCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setWebglUnavailable(true);
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
      setWebglUnavailable(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(5.4, 2.3, 9.2);

    // Warm architectural three-point lighting + dynamic cursor PointLight
    const hemi = new THREE.HemisphereLight(0xf6ead6, 0x1e1915, 0.65);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffe1b0, 1.85);
    keyLight.position.set(7, 9, 6);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc8a055, 1.1);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const cursorLight = new THREE.PointLight(0xffcf77, 3.2, 14, 1.6);
    cursorLight.position.set(2.5, 1.8, 3.2);
    scene.add(cursorLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const woodTex = createWoodTexture(maxAniso);

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x26211c,
      roughness: 0.72,
      metalness: 0.1,
    });
    const teakMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.46,
      metalness: 0.08,
    });
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xc8a055,
      metalness: 0.94,
      roughness: 0.16,
      clearcoat: 0.75,
    });
    const lanternGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffdf9e,
      emissive: 0xffb347,
      emissiveIntensity: 1.9,
      roughness: 0.25,
    });

    // Composite Architectural Hospitality Pavilion & Floating Orbital Chandelier (12+ parts)
    const pavilion = new THREE.Group();
    const placePavilion = (w: number) => {
      if (w < 768) {
        pavilion.position.set(0.5, -0.3, -1.8);
        pavilion.scale.setScalar(0.76);
      } else {
        pavilion.position.set(2.55, -0.65, -0.8);
        pavilion.scale.setScalar(1);
      }
    };
    placePavilion(width);

    const step = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.12, 3.7), stoneMat);
    step.position.y = 0.06;
    pavilion.add(step);

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.24, 3.3), stoneMat);
    plinth.position.y = 0.18;
    pavilion.add(plinth);

    const colPositions: [number, number][] = [
      [-1.95, -1.2],
      [1.95, -1.2],
      [-1.95, 1.2],
      [1.95, 1.2],
    ];
    colPositions.forEach(([cx, cz]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.35, 0.16), teakMat);
      col.position.set(cx, 1.48, cz);
      pavilion.add(col);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.24), brassMat);
      cap.position.set(cx, 2.64, cz);
      pavilion.add(cap);
    });

    const eave = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.16, 3.6), teakMat);
    eave.position.y = 2.75;
    pavilion.add(eave);

    const brassTrim = new THREE.Mesh(new THREE.BoxGeometry(5.24, 0.04, 3.64), brassMat);
    brassTrim.position.y = 2.66;
    pavilion.add(brassTrim);

    const upperRoof = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.2, 2.7), stoneMat);
    upperRoof.position.y = 2.93;
    pavilion.add(upperRoof);

    // Suspended warm brass architectural lanterns
    [-1.0, 0, 1.0].forEach((lx, idx) => {
      const len = idx === 1 ? 0.42 : 0.56;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len, 8), brassMat);
      rod.position.set(lx, 2.62 - len / 2, 1.15);
      pavilion.add(rod);

      const lantern = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.065, 0.2, 12),
        lanternGlowMat
      );
      lantern.position.set(lx, 2.62 - len - 0.1, 1.15);
      pavilion.add(lantern);
    });

    // Kinetic brass orbital halo rising above pavilion courtyard
    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0, 1.55, 0);
    const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.018, 12, 72), brassMat);
    orbitRing.rotation.x = Math.PI / 2 - 0.28;
    orbitGroup.add(orbitRing);
    pavilion.add(orbitGroup);

    scene.add(pavilion);

    // Floating warm golden bokeh motes via InstancedMesh
    const moteCount = 46;
    const moteGeo = new THREE.SphereGeometry(0.026, 8, 8);
    const moteMat = new THREE.MeshBasicMaterial({
      color: 0xe6c47f,
      transparent: true,
      opacity: 0.52,
    });
    const motes = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
    const moteSeeds = Array.from({ length: moteCount }, (_, i) => ({
      x: (Math.sin(i * 12.7) * 0.5 + 0.22) * 8.5,
      y: ((i * 0.18) % 3.8) + 0.1,
      z: Math.cos(i * 7.3) * 4.2,
      speed: 0.24 + (i % 5) * 0.08,
      phase: i * 0.85,
    }));
    moteSeeds.forEach((m, i) => {
      _pos.set(m.x, m.y, m.z);
      _mat4.compose(_pos, _quat, _scale);
      motes.setMatrixAt(i, _mat4);
    });
    motes.computeBoundingSphere();
    scene.add(motes);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let pointerX = 0;
    let pointerY = 0;
    let scrollFactor = 0;

    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scrollFactor = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      placePavilion(w);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Responsive Mouse 3D Camera Parallax + Scroll Zoom
      const targetCamX = 5.4 + pointerX * 0.95 - scrollFactor * 1.25;
      const targetCamY = 2.3 - pointerY * 0.48 + scrollFactor * 0.65;
      const targetCamZ = 9.2 - scrollFactor * 1.6;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4.2, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4.2, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4.2, dt);
      camera.lookAt(0.85, 1.1, -0.45);

      // Mouse-driven 3D rotation on architectural pavilion & kinetic brass ring
      pavilion.rotation.y = THREE.MathUtils.damp(
        pavilion.rotation.y,
        -0.36 + pointerX * 0.2 + Math.sin(elapsed * 0.22) * 0.06,
        3.8,
        dt
      );
      pavilion.rotation.x = THREE.MathUtils.damp(pavilion.rotation.x, pointerY * 0.08, 3.8, dt);
      orbitGroup.rotation.y = elapsed * 0.22 + pointerX * 0.35;

      // Dynamic cursor spotlight illuminates architectural timber & brass trims
      cursorLight.position.x = THREE.MathUtils.damp(cursorLight.position.x, 2.2 + pointerX * 3.8, 6, dt);
      cursorLight.position.y = THREE.MathUtils.damp(cursorLight.position.y, 1.8 - pointerY * 2.2, 6, dt);

      for (let i = 0; i < moteCount; i++) {
        const m = moteSeeds[i];
        _pos.set(
          m.x + Math.sin(elapsed * m.speed + m.phase) * 0.28 + pointerX * 0.25,
          m.y + Math.cos(elapsed * m.speed * 0.8 + m.phase) * 0.2 - pointerY * 0.18,
          m.z
        );
        _mat4.compose(_pos, _quat, _scale);
        motes.setMatrixAt(i, _mat4);
      }
      motes.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      woodTex.dispose();
      stoneMat.dispose();
      teakMat.dispose();
      brassMat.dispose();
      lanternGlowMat.dispose();
      moteGeo.dispose();
      moteMat.dispose();
      pavilion.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglUnavailable) {
    return null;
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
    />
  );
}
