/**
 * love-rain-standalone.js (VIP Love Rain Engine)
 * Recreating 100% of 20-10-gift's authentic Love Rain experience:
 * 1. PhotoRain: 30 beautiful photo frames of the girl continuously falling from sky to bottom in an infinite loop
 * 2. Hr: 112+ typography friendship wishes continuously raining down with glowing gradients
 * 3. kr: 100 glowing hearts continuously falling with breathing pulse opacity
 * 4. Centerpiece Plaque: Glassmorphic quote card with orbiting galaxy ring
 * 5. Full 360° OrbitControls: Drag/swipe to rotate around the entire falling universe, scroll/pinch to zoom
 * 6. 100% Standalone (Three.js r128), zero external bundler or CORS issues
 */
(function () {
  'use strict';

  let scene, camera, renderer, controls;
  let photoSprites = [];
  let wishSprites = [];
  let heartSprites = [];
  let centralCardMesh, orbitParticleRing;
  let isRunning = false;
  let startTime = 0;

  const DEFAULT_PHOTOS = [
    'assets/image/photo1.png',
    'assets/image/photo2.png',
    'assets/image/photo3.png',
    'assets/image/photo4.png',
    'assets/image/photo5.png',
    'assets/image/photo6.png',
    'assets/image/photo7.png',
    'assets/image/photo8.jpg',
    'assets/image/photo9.jpg',
    'assets/image/photo10.png'
  ];

  const FRIENDSHIP_WISHES = [
    '20/10 Rực Rỡ & Xinh Đẹp Nhé 🌸',
    'Luôn Tươi Cười & Hạnh Phúc Cậu Nha ✨',
    'Mong Cậu Luôn Được Yêu Thương 💕',
    'Người Bạn Siêu Đáng Yêu Của Tớ ☀️',
    'Học Tập Tốt & Gặp Nhiều May Mắn 🍀',
    'Mỗi Ngày Đều Là Một Niềm Vui 💖',
    'Bình Yên & Rạng Rỡ Mỗi Ngày 🌷',
    'Tỏa Sáng Theo Cách Riêng Của Cậu 🌟',
    'Chúc cậu một ngày 20/10 ngập tràn niềm vui 🌸',
    'Mong thế giới này luôn dịu dàng với cậu ☀️',
    'Hãy luôn tự tin, yêu đời và tỏa sáng nhé ✨',
    'Dù bận rộn cũng nhớ luôn chăm sóc bản thân nha 💖'
  ];

  /**
   * Process photo into rounded corner aesthetic texture with glowing border
   * Exactly matching PhotoTexLoader in 20-10-gift
   */
  function processPhotoToTexture(img) {
    const pad = 18;
    const maxEdge = 512;
    const imgAspect = (img.width && img.height) ? (img.width / img.height) : 1;
    let targetW, targetH;

    if (imgAspect >= 1) {
      targetW = maxEdge;
      targetH = Math.round(maxEdge / imgAspect);
    } else {
      targetH = maxEdge;
      targetW = Math.round(maxEdge * imgAspect);
    }

    const cr = Math.min(36, Math.max(16, Math.round(Math.min(targetW, targetH) * 0.08)));
    const canvasW = targetW + pad * 2;
    const canvasH = targetH + pad * 2;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');

    // Rounded clipping path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pad + cr, pad);
    ctx.lineTo(pad + targetW - cr, pad);
    ctx.quadraticCurveTo(pad + targetW, pad, pad + targetW, pad + cr);
    ctx.lineTo(pad + targetW, pad + targetH - cr);
    ctx.quadraticCurveTo(pad + targetW, pad + targetH, pad + targetW - cr, pad + targetH);
    ctx.lineTo(pad + cr, pad + targetH);
    ctx.quadraticCurveTo(pad, pad + targetH, pad, pad + targetH - cr);
    ctx.lineTo(pad, pad + cr);
    ctx.quadraticCurveTo(pad, pad, pad + cr, pad);
    ctx.closePath();
    ctx.clip();

    // Image drawing with slight contrast boost
    ctx.filter = 'contrast(1.15) saturate(1.18)';
    ctx.drawImage(img, pad, pad, targetW, targetH);
    ctx.filter = 'none';

    // Soft multiply overlay for deep warm tint
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(pad, pad, targetW, targetH);
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();

    // Radiant glowing white-rose border
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pad + cr, pad);
    ctx.lineTo(pad + targetW - cr, pad);
    ctx.quadraticCurveTo(pad + targetW, pad, pad + targetW, pad + cr);
    ctx.lineTo(pad + targetW, pad + targetH - cr);
    ctx.quadraticCurveTo(pad + targetW, pad + targetH, pad + targetW - cr, pad + targetH);
    ctx.lineTo(pad + cr, pad + targetH);
    ctx.quadraticCurveTo(pad, pad + targetH, pad, pad + targetH - cr);
    ctx.lineTo(pad, pad + cr);
    ctx.quadraticCurveTo(pad, pad, pad + cr, pad);
    ctx.closePath();

    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.shadowColor = 'rgba(255, 105, 180, 0.8)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.aspectRatio = canvasW / canvasH;
    return texture;
  }

  /**
   * Create Glowing Heart Texture for kr
   */
  function createHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64, cy = 60;

    // Outer glow layers
    const glowLayers = [
      { blur: 24, color: 'rgba(255, 80, 160, 0.65)' },
      { blur: 14, color: 'rgba(255, 140, 190, 0.55)' },
      { blur: 6,  color: 'rgba(255, 210, 230, 0.45)' }
    ];

    function drawHeartPath() {
      ctx.beginPath();
      ctx.moveTo(cx, cy + 32);
      ctx.bezierCurveTo(cx - 38, cy + 8, cx - 44, cy - 24, cx - 22, cy - 32);
      ctx.bezierCurveTo(cx - 4, cy - 36, cx, cy - 14, cx, cy - 10);
      ctx.bezierCurveTo(cx, cy - 14, cx + 4, cy - 36, cx + 22, cy - 32);
      ctx.bezierCurveTo(cx + 44, cy - 24, cx + 38, cy + 8, cx, cy + 32);
      ctx.closePath();
    }

    for (const g of glowLayers) {
      ctx.shadowBlur = g.blur;
      ctx.shadowColor = g.color;
      ctx.fillStyle = g.color;
      drawHeartPath();
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    const grad = ctx.createLinearGradient(0, cy - 35, 0, cy + 35);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#ff99cc');
    grad.addColorStop(1, '#ff3388');
    ctx.fillStyle = grad;
    drawHeartPath();
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  /**
   * Soft circular glow texture for stardust particles
   */
  function createParticleDotTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.25, 'rgba(255, 220, 240, 0.95)');
    grad.addColorStop(0.5, 'rgba(255, 105, 180, 0.45)');
    grad.addColorStop(0.8, 'rgba(255, 20, 147, 0.15)');
    grad.addColorStop(1, 'rgba(255, 20, 147, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  /**
   * Create Floating Typography Wish Text Texture
   */
  function createWishTexture(text, index) {
    const canvas = document.createElement('canvas');
    canvas.width = 680;
    canvas.height = 110;
    const ctx = canvas.getContext('2d');
    const r = 28;

    // Check text width to adjust font size if needed
    ctx.font = '600 28px "Mali", sans-serif';
    let fontSize = 28;
    const maxW = 620;
    while (ctx.measureText(text).width > maxW && fontSize > 20) {
      fontSize -= 2;
      ctx.font = `600 ${fontSize}px "Mali", sans-serif`;
    }

    // Translucent glass capsule background
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(680 - r, 0);
    ctx.quadraticCurveTo(680, 0, 680, r);
    ctx.lineTo(680, 110 - r);
    ctx.quadraticCurveTo(680, 110, 680 - r, 110);
    ctx.lineTo(r, 110);
    ctx.quadraticCurveTo(0, 110, 0, 110 - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    const bgGrad = ctx.createLinearGradient(0, 0, 680, 110);
    if (index % 2 === 0) {
      bgGrad.addColorStop(0, 'rgba(42, 12, 36, 0.88)');
      bgGrad.addColorStop(1, 'rgba(68, 16, 52, 0.88)');
    } else {
      bgGrad.addColorStop(0, 'rgba(20, 20, 48, 0.88)');
      bgGrad.addColorStop(1, 'rgba(52, 22, 60, 0.88)');
    }
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Glowing border
    ctx.strokeStyle = (index % 2 === 0) ? 'rgba(255, 160, 210, 0.75)' : 'rgba(160, 220, 255, 0.75)';
    ctx.lineWidth = 3.2;
    ctx.stroke();
    ctx.restore();

    // Typography
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${fontSize}px "Mali", sans-serif`;
    ctx.shadowColor = (index % 2 === 0) ? 'rgba(255, 105, 180, 0.9)' : 'rgba(100, 210, 255, 0.9)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 340, 55);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  /**
   * Create Central Quote Card Texture
   */
  function createCentralQuoteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');

    const r = 26;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(1024 - r, 0);
    ctx.quadraticCurveTo(1024, 0, 1024, r);
    ctx.lineTo(1024, 560 - r);
    ctx.quadraticCurveTo(1024, 560, 1024 - r, 560);
    ctx.lineTo(r, 560);
    ctx.quadraticCurveTo(0, 560, 0, 560 - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 560);
    bgGrad.addColorStop(0, 'rgba(38, 10, 36, 0.92)');
    bgGrad.addColorStop(0.5, 'rgba(24, 8, 26, 0.95)');
    bgGrad.addColorStop(1, 'rgba(48, 12, 44, 0.92)');
    ctx.fillStyle = bgGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 182, 218, 0.8)';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff7ab6';
    ctx.font = '600 34px "Mali", sans-serif';
    ctx.fillText('✨ Gửi Cậu — Người Bạn Đáng Yêu Của Tớ ✨', 512, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 35px "Mali", sans-serif';
    ctx.fillText('“Mong thế giới này luôn dịu dàng với cậu,', 512, 185);
    ctx.fillText('như cách cậu luôn mang lại niềm vui', 512, 245);
    ctx.fillText('và sự ấm áp đến mọi người xung quanh.”', 512, 305);

    ctx.fillStyle = '#ffb3d9';
    ctx.font = '600 30px "Mali", sans-serif';
    ctx.fillText('💕 Chúc Cậu Ngày 20/10 Thật Tuyệt Vời & Hạnh Phúc! 💕', 512, 410);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '400 24px "Mali", sans-serif';
    ctx.fillText('— Happy Vietnamese Women’s Day 20/10 —', 512, 480);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  function startStandaloneLoveRain() {
    if (isRunning) return;
    isRunning = true;
    startTime = Date.now();

    console.log('🚀 [LoveRainStandalone] Launching Authentic Infinite 3D Love Rain...');

    // 1. Clean up old elements
    const oldReality = document.getElementById('tiny-reality-scene');
    if (oldReality) oldReality.style.display = 'none';
    const oldBloom = document.getElementById('flower-bloom-screen');
    if (oldBloom) oldBloom.style.display = 'none';
    const oldIntro = document.getElementById('intro-screen');
    if (oldIntro) oldIntro.style.display = 'none';
    const effOverlay = document.getElementById('effects-overlay');
    if (effOverlay) effOverlay.style.display = 'none';

    const appEl = document.getElementById('app');
    if (!appEl) {
      console.error('No #app element found');
      return;
    }

    appEl.innerHTML = '';
    appEl.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10;pointer-events:auto;';

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    appEl.appendChild(canvas);

    // 2. Three.js Setup (FOV 85 matching original wide immersive feeling)
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(0, 0, 32);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 3. OrbitControls 360°
    if (typeof THREE.OrbitControls === 'function') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.45;
      controls.minDistance = 10;
      controls.maxDistance = 65;
      controls.enablePan = true;
    }

    // 4. Background Star Universe
    (function initStarField() {
      const starCount = 4000;
      const positions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 1400;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1400;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1400;
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        map: createParticleDotTexture(),
        color: 0xffffff,
        size: 0.9,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const stars = new THREE.Points(geom, mat);
      scene.add(stars);
    })();

    // 5. Central Plaque & Orbiting Galaxy Ring
    (function initCenterpiece() {
      const cardTex = createCentralQuoteTexture();
      const cardGeo = new THREE.PlaneGeometry(28, 15.3);
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTex,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });
      centralCardMesh = new THREE.Mesh(cardGeo, cardMat);
      centralCardMesh.position.set(0, 0, 0);
      scene.add(centralCardMesh);

      // Orbiting sparkle ring
      const ringCount = 1200;
      const ringPos = new Float32Array(ringCount * 3);
      for (let i = 0; i < ringCount; i++) {
        const rad = 17 + Math.random() * 8;
        const ang = (i / ringCount) * Math.PI * 2;
        ringPos[i * 3]     = Math.cos(ang) * rad;
        ringPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
        ringPos[i * 3 + 2] = Math.sin(ang) * rad;
      }
      const ringGeo = new THREE.BufferGeometry();
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
      const ringMat = new THREE.PointsMaterial({
        map: createParticleDotTexture(),
        color: 0xff85c2,
        size: 0.5,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      orbitParticleRing = new THREE.Points(ringGeo, ringMat);
      scene.add(orbitParticleRing);
    })();

    // 6. Pre-generate Textures for Wishes & Hearts
    const heartTex = createHeartTexture();
    const wishTextures = FRIENDSHIP_WISHES.map((txt, idx) => createWishTexture(txt, idx));

    // 7. Initialize Falling Photos (PhotoRain)
    let photoUrls = [];
    if (window.EMBEDDED_PHOTOS && window.EMBEDDED_PHOTOS.length > 0) {
      photoUrls = window.EMBEDDED_PHOTOS;
    } else if (window.LOVEGIFT_IMAGES && window.LOVEGIFT_IMAGES.length > 0) {
      photoUrls = window.LOVEGIFT_IMAGES;
    } else if (window.Heartlove && window.Heartlove.data && window.Heartlove.data.images && window.Heartlove.data.images.length > 0) {
      photoUrls = window.Heartlove.data.images;
    } else {
      photoUrls = DEFAULT_PHOTOS;
    }

    // Load photo HTML images then process into textures
    const processedTextures = [];
    let loadedCount = 0;

    photoUrls.forEach((url, i) => {
      const img = new Image();
      img.onload = () => {
        processedTextures[i] = processPhotoToTexture(img);
        loadedCount++;
        if (loadedCount === photoUrls.length) {
          spawnPhotoRain(processedTextures);
        }
      };
      img.onerror = () => {
        console.warn('Could not load photo:', url);
        // Fallback placeholder
        const fallback = document.createElement('canvas');
        fallback.width = 400; fallback.height = 400;
        const fctx = fallback.getContext('2d');
        fctx.fillStyle = '#ff69b4'; fctx.fillRect(0,0,400,400);
        processedTextures[i] = new THREE.CanvasTexture(fallback);
        loadedCount++;
        if (loadedCount === photoUrls.length) {
          spawnPhotoRain(processedTextures);
        }
      };
      img.src = url;
    });

    /**
     * Spawn 30 PhotoRain Sprites that fall continuously in 3D
     * Exactly following PhotoRain algorithm from 20-10-gift
     */
    function spawnPhotoRain(textures) {
      photoSprites = [];
      const zLayers = [-8, 8, 24, 40, 56];
      const xCols = [-32, -19, -6, 7, 20, 33];
      const total = zLayers.length * xCols.length; // 30 photos
      let idx = 0;

      for (let r = 0; r < zLayers.length; r++) {
        for (let c = 0; c < xCols.length; c++) {
          const tex = textures[idx % textures.length];
          const startX = xCols[c] + (c % 2 === 0 ? 1.5 : -1.5);
          const startZ = zLayers[r] + (r % 2 === 0 ? 2 : -2);
          const speed = 4.8 + ((r * 3 + c * 7) % 5) * 0.65;
          const offsetY = (idx / total) * 110;
          const seed = r * 13 + c * 17;

          const baseSize = 8.6;
          const aspect = tex.aspectRatio || 1;
          const scaleX = aspect >= 1 ? baseSize : baseSize * aspect;
          const scaleY = aspect >= 1 ? baseSize / aspect : baseSize;

          const spriteMat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            depthWrite: false,
            alphaTest: 0.05
          });
          const sprite = new THREE.Sprite(spriteMat);
          sprite.scale.set(scaleX, scaleY, 1);
          sprite.position.set(startX, 65, startZ);

          sprite.userData = {
            startX: startX,
            startZ: startZ,
            speed: speed,
            offsetY: offsetY,
            seed: seed,
            topY: 65,
            bottomY: -45,
            range: 110
          };

          scene.add(sprite);
          photoSprites.push(sprite);
          idx++;
        }
      }
      console.log('✅ [LoveRainStandalone] 30 Continuous Falling Photos Initialized!');
    }

    /**
     * Spawn 112 Typography Friendship Wishes (Hr)
     * Continuous waterfall of glowing wishes raining down
     */
    function spawnWishRain() {
      wishSprites = [];
      const rows = 8;
      const cols = 14;
      const total = rows * cols; // 112 falling wishes
      let idx = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tex = wishTextures[idx % wishTextures.length];
          const xStep = 5.2;
          const zStep = 8.5;
          const startX = -34 + c * xStep + (r % 2 === 0 ? 1.2 : -1.2);
          const startZ = -14 + r * zStep;
          const speed = 5.2 + (idx % 6) * 0.55;
          const offsetY = (idx / total) * 115;
          const seed = r * 19 + c * 23;

          const spriteMat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            opacity: 0.94,
            depthWrite: false
          });
          const sprite = new THREE.Sprite(spriteMat);
          sprite.scale.set(13.5, 2.4, 1);
          sprite.position.set(startX, 70, startZ);

          sprite.userData = {
            startX: startX,
            startZ: startZ,
            speed: speed,
            offsetY: offsetY,
            seed: seed,
            topY: 70,
            bottomY: -45,
            range: 115
          };

          scene.add(sprite);
          wishSprites.push(sprite);
          idx++;
        }
      }
      console.log('✅ [LoveRainStandalone] 112 Continuous Falling Wishes (Hr) Initialized!');
    }
    spawnWishRain();

    /**
     * Spawn 100 Glowing Hearts (kr)
     * Continuous rain of pulsing hearts
     */
    function spawnHeartRain() {
      heartSprites = [];
      const rows = 10;
      const cols = 10;
      const total = rows * cols; // 100 falling hearts
      let idx = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const startX = -32 + c * 6.5 + (r % 2 === 0 ? 1.5 : -1.5);
          const startZ = -10 + r * 6.5;
          const speed = 5.5 + Math.random() * 5.0;
          const offsetY = (idx / total) * 110;
          const pulseOffset = Math.random() * Math.PI * 2;
          const seed = r * 11 + c * 31;

          const spriteMat = new THREE.SpriteMaterial({
            map: heartTex,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            alphaTest: 0.05
          });
          const sprite = new THREE.Sprite(spriteMat);
          const scale = 2.4 + Math.random() * 0.8;
          sprite.scale.set(scale, scale, 1);
          sprite.position.set(startX, 68, startZ);

          sprite.userData = {
            startX: startX,
            startZ: startZ,
            speed: speed,
            offsetY: offsetY,
            pulseOffset: pulseOffset,
            seed: seed,
            topY: 68,
            bottomY: -42,
            range: 110
          };

          scene.add(sprite);
          heartSprites.push(sprite);
          idx++;
        }
      }
      console.log('✅ [LoveRainStandalone] 100 Continuous Falling Hearts (kr) Initialized!');
    }
    spawnHeartRain();

    // 8. Interactive Gesture Guide
    showGestureGuide();

    // 9. Main Continuous Animation Loop
    function render() {
      requestAnimationFrame(render);

      const now = Date.now();
      const elapsed = (now - startTime) * 0.001;

      // Update 360 OrbitControls
      if (controls) {
        controls.update();
      }

      // Centerpiece Plaque & Galaxy Ring
      if (centralCardMesh) {
        centralCardMesh.position.y = Math.sin(elapsed * 1.5) * 0.5;
        // Central plaque billboard faces camera
        centralCardMesh.quaternion.copy(camera.quaternion);
      }
      if (orbitParticleRing) {
        orbitParticleRing.rotation.y = elapsed * 0.2;
        orbitParticleRing.position.y = Math.sin(elapsed * 1.5) * 0.5;
      }

      // 1. Continuous Falling Photo Rain
      for (let i = 0; i < photoSprites.length; i++) {
        const p = photoSprites[i];
        const u = p.userData;
        if (!u) continue;

        // Continuous falling calculation: topY down to bottomY, infinitely modulo range
        const y = u.topY - ((elapsed * u.speed + u.offsetY) % u.range);
        p.position.y = y;
        p.position.x = u.startX + Math.sin(elapsed * 0.7 + u.seed) * 0.9;
        // Gentle 2D sway rotation for sprite
        p.material.rotation = Math.sin(elapsed * 0.5 + u.seed) * 0.07;
      }

      // 2. Continuous Falling Typography Wishes (Hr)
      for (let i = 0; i < wishSprites.length; i++) {
        const w = wishSprites[i];
        const u = w.userData;
        if (!u) continue;

        const y = u.topY - ((elapsed * u.speed + u.offsetY) % u.range);
        w.position.y = y;
        w.position.x = u.startX + Math.sin(elapsed * 0.6 + u.seed) * 0.6;
        w.material.rotation = Math.sin(elapsed * 0.4 + u.seed) * 0.04;
      }

      // 3. Continuous Falling Glowing Hearts (kr)
      for (let i = 0; i < heartSprites.length; i++) {
        const h = heartSprites[i];
        const u = h.userData;
        if (!u) continue;

        const y = u.topY - ((elapsed * u.speed + u.offsetY) % u.range);
        h.position.y = y;
        h.position.x = u.startX + Math.sin(elapsed * 0.8 + u.seed) * 0.7;
        // Breathing pulse opacity: 0.68 -> 1.0
        h.material.opacity = 0.68 + 0.32 * (0.5 + 0.5 * Math.sin(elapsed * 2.2 + u.pulseOffset));
      }

      renderer.render(scene, camera);
    }

    render();
    window.addEventListener('resize', onResize);

    function onResize() {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }
  }

  function showGestureGuide() {
    if (document.getElementById('gesture-guide-360')) return;
    const guide = document.createElement('div');
    guide.id = 'gesture-guide-360';
    guide.style.cssText = 'position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(20px);z-index:9999;opacity:0;transition:opacity 0.8s cubic-bezier(0.22,1,0.36,1),transform 0.8s cubic-bezier(0.22,1,0.36,1);pointer-events:none;user-select:none;';
    guide.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:9px 22px;background:rgba(25,8,32,0.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1.5px solid rgba(255,182,218,0.65);border-radius:999px;box-shadow:0 8px 30px rgba(255,46,126,0.38);color:#fff0f7;font:600 13px/1.3 'Mali','Quicksand',sans-serif;letter-spacing:0.3px;">
        <svg viewBox="0 0 48 48" style="width:26px;height:26px;flex-shrink:0;animation:guideRot 3.5s linear infinite;" fill="none">
          <path d="M24 8 C14 8 6 15 6 24 C6 30 10 36 16 38" stroke="#ff7ab6" stroke-width="3" stroke-linecap="round"/>
          <path d="M12 40 L16 38 L14 34" fill="#ff7ab6"/>
          <path d="M24 40 C34 40 42 33 42 24 C42 18 38 12 32 10" stroke="#ff7ab6" stroke-width="3" stroke-linecap="round"/>
          <path d="M36 8 L32 10 L34 14" fill="#ff7ab6"/>
          <circle cx="24" cy="24" r="5" fill="#ffffff"/>
        </svg>
        <span>Chạm & vuốt để xoay 360° • Cuộn/zoom để ngắm mưa ảnh & lời chúc 💕</span>
      </div>
      <style>@keyframes guideRot{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}</style>
    `;
    document.body.appendChild(guide);

    setTimeout(() => {
      guide.style.opacity = '1';
      guide.style.transform = 'translateX(-50%) translateY(0)';
    }, 600);

    const dismiss = () => {
      guide.style.opacity = '0';
      guide.style.transform = 'translateX(-50%) translateY(20px)';
      ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((e) => {
        window.removeEventListener(e, dismiss);
      });
      setTimeout(() => {
        if (guide && guide.parentNode) guide.parentNode.removeChild(guide);
      }, 900);
    };

    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((e) => {
      window.addEventListener(e, dismiss, { passive: true, once: true });
    });
  }

  // Global export
  window.startStandaloneLoveRain = startStandaloneLoveRain;

})();
