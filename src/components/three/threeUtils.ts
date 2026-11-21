import * as THREE from 'three';

export function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function createWoodTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#5B3A21';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 64; i++) {
      const x = i * 8;
      ctx.fillStyle = i % 2 === 0 ? '#4D301A' : '#6B4629';
      ctx.fillRect(x, 0, 6, 512);
      ctx.fillStyle = 'rgba(20, 10, 4, 0.25)';
      ctx.fillRect(x + 6, 0, 2, 512);
    }
    for (let y = 0; y < 512; y += 3) {
      ctx.fillStyle = `rgba(0,0,0,${(Math.sin(y * 0.14) * 0.04 + 0.05).toFixed(3)})`;
      ctx.fillRect(0, y, 512, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createTravertineTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EAE2D6';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 40; i++) {
      const y = (i * 13) % 512;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(180,165,145,0.18)' : 'rgba(255,250,242,0.22)';
      ctx.fillRect(0, y, 512, 3);
    }
    ctx.strokeStyle = 'rgba(140, 125, 105, 0.22)';
    ctx.lineWidth = 2;
    for (let gx = 0; gx <= 512; gx += 128) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, 512);
      ctx.stroke();
    }
    for (let gy = 0; gy <= 512; gy += 128) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(512, gy);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createWovenRugTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#CFC4B4';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 4) {
      ctx.fillStyle = y % 8 === 0 ? 'rgba(90,78,64,0.12)' : 'rgba(255,255,255,0.14)';
      ctx.fillRect(0, y, 256, 2);
    }
    for (let x = 0; x < 256; x += 6) {
      ctx.fillStyle = 'rgba(110,95,78,0.08)';
      ctx.fillRect(x, 0, 2, 256);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = maxAnisotropy;
  return tex;
}
