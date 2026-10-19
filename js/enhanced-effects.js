/**
 * enhanced-effects.js (Standalone Three.js Engine)
 * - 3D Heart Particle Nebula matching Image 2
 * - Core Glowing Star Flare & Twinkling Cosmos
 * - 3D Particle Text for Sweet Friendship 20/10 Wishes
 * - Compatible with both file:/// and http:// (No ES Module CORS issues)
 */
(function () {
  'use strict';

  let scene, camera, renderer;
  let heartNebula, coreFlare, cosmicStars, textParticleSystem;
  let isInitialized = false;

  const isMobile = window.innerWidth < 768;
  const config = {
    textParticleCount: isMobile ? 55000 : 90000,
    textParticleSize: isMobile ? 0.13 : 0.16,
    heartParticleCount: isMobile ? 26000 : 38000,
    explosionPower: 160,
    gatherSpeed: isMobile ? 0.085 : 0.055,
    depthThickness: isMobile ? 1.0 : 1.4,
    colorStart: '#ffffff',
    colorMid: '#ff69b4',
    colorEnd: '#ff1493'
  };

  let textPositions, targetPositions, textColors, textGeometry;
  let messages = [];
  let currentMsgIndex = 0;
  let lastMsgChangeTime = 0;
  let isExploding = false;
  let isCompleted = false;
  let explosionStartTime = 0;

  function checkIsIPad() {
    const ua = navigator.userAgent || '';
    if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return true;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const minDim = Math.min(w, h);
    const maxDim = Math.max(w, h);
    return (w < h && minDim >= 700 && minDim <= 1024 && maxDim <= 1366);
  }

  const MSG_DURATION = (isMobile || checkIsIPad()) ? 5500 : 5200;

  function createGlowSpriteTexture(innerColor = '#ffffff', outerColor = 'rgba(255, 105, 180, 0)') {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 64, 64);
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.25, 'rgba(255, 220, 240, 0.95)');
    grad.addColorStop(0.5, 'rgba(255, 105, 180, 0.45)');
    grad.addColorStop(0.8, 'rgba(255, 20, 147, 0.15)');
    grad.addColorStop(1, outerColor);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  function createFlareStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64, cy = 64;

    ctx.clearRect(0, 0, 128, 128);

    // Radial core
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
    radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radGrad.addColorStop(0.2, 'rgba(255, 220, 240, 0.95)');
    radGrad.addColorStop(0.45, 'rgba(255, 105, 180, 0.5)');
    radGrad.addColorStop(0.75, 'rgba(255, 20, 147, 0.15)');
    radGrad.addColorStop(1, 'rgba(255, 20, 147, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    // Cross flare horizontal ray with gradient
    const hGrad = ctx.createLinearGradient(cx - 56, cy, cx + 56, cy);
    hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.strokeStyle = hGrad;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(cx - 56, cy);
    ctx.lineTo(cx + 56, cy);
    ctx.stroke();

    // Cross flare vertical ray with gradient
    const vGrad = ctx.createLinearGradient(cx, cy - 56, cx, cy + 56);
    vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.strokeStyle = vGrad;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 56);
    ctx.lineTo(cx, cy + 56);
    ctx.stroke();

    // Diagonal soft rays
    const dGrad1 = ctx.createLinearGradient(cx - 35, cy - 35, cx + 35, cy + 35);
    dGrad1.addColorStop(0, 'rgba(255, 180, 220, 0)');
    dGrad1.addColorStop(0.5, 'rgba(255, 220, 240, 0.7)');
    dGrad1.addColorStop(1, 'rgba(255, 180, 220, 0)');
    ctx.strokeStyle = dGrad1;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 35, cy - 35);
    ctx.lineTo(cx + 35, cy + 35);
    ctx.stroke();

    const dGrad2 = ctx.createLinearGradient(cx - 35, cy + 35, cx + 35, cy - 35);
    dGrad2.addColorStop(0, 'rgba(255, 180, 220, 0)');
    dGrad2.addColorStop(0.5, 'rgba(255, 220, 240, 0.7)');
    dGrad2.addColorStop(1, 'rgba(255, 180, 220, 0)');
    ctx.strokeStyle = dGrad2;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 35, cy + 35);
    ctx.lineTo(cx + 35, cy - 35);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  function initStandaloneEffects() {
    if (isInitialized) return;
    if (typeof THREE === 'undefined') {
      console.warn('THREE not found, waiting for script to load...');
      setTimeout(initStandaloneEffects, 100);
      return;
    }
    isInitialized = true;

    let canvas = document.getElementById('effects-overlay');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'effects-overlay';
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1005;';
      document.body.appendChild(canvas);
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 25, 65);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    // 1. COSMIC BACKGROUND STARS (Twinkling Stardust)
    (function initBackgroundStars() {
      const starCount = 5000;
      const positions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 1400;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1000 - 100;
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.65,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      cosmicStars = new THREE.Points(geom, mat);
      scene.add(cosmicStars);
    })();

    // 2. 3D HEART PARTICLE NEBULA (Matching Image 2)
    (function initHeartNebula() {
      const count = config.heartParticleCount;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const colorWhite = new THREE.Color(0xffffff);
      const colorHotPink = new THREE.Color(0xff2d87);
      const colorRose = new THREE.Color(0xff75a0);
      const colorMagenta = new THREE.Color(0xd63384);
      const colorCosmic = new THREE.Color(0x9c27b0);

      const scale = isMobile ? 1.9 : 2.45;

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        // Heart 2D parametric equation
        const hx = 16 * Math.pow(Math.sin(theta), 3);
        const hy = 13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta);

        // Density distribution: power < 1 concentrates particles around inner core while covering volume
        const r = Math.pow(Math.random(), 0.55);
        const jitterX = (Math.random() - 0.5) * 2.2;
        const jitterY = (Math.random() - 0.5) * 2.2;

        const px = (hx * r + jitterX) * scale;
        const py = (hy * r + jitterY) * scale + 1.5; // Centered
        const pz = (Math.random() - 0.5) * 22 * (1.1 - 0.5 * r) - 6;

        positions[i * 3]     = px;
        positions[i * 3 + 1] = py;
        positions[i * 3 + 2] = pz;

        // Color gradient: Inner core is luminous white-pink, outer boundary is deep rose/cosmic
        let ptCol;
        if (r < 0.25) {
          ptCol = colorWhite.clone().lerp(colorRose, r * 4);
        } else if (r < 0.65) {
          ptCol = colorRose.clone().lerp(colorHotPink, (r - 0.25) * 2.5);
        } else if (r < 0.88) {
          ptCol = colorHotPink.clone().lerp(colorMagenta, (r - 0.65) * 4.3);
        } else {
          ptCol = colorMagenta.clone().lerp(colorCosmic, (r - 0.88) * 8.3);
        }

        // Add subtle brightness shimmer variation
        const shimmer = (Math.random() - 0.5) * 0.12;
        colors[i * 3]     = Math.min(1, Math.max(0, ptCol.r + shimmer));
        colors[i * 3 + 1] = Math.min(1, Math.max(0, ptCol.g + shimmer));
        colors[i * 3 + 2] = Math.min(1, Math.max(0, ptCol.b + shimmer));
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: isMobile ? 0.18 : 0.22,
        map: createGlowSpriteTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      heartNebula = new THREE.Points(geom, mat);
      scene.add(heartNebula);
    })();

    // 3. CENTRAL GLOWING STAR FLARE (The Bright Luminous Core Point in Image 2)
    (function initCoreStarFlare() {
      const flareGroup = new THREE.Group();

      // Dense core particles around (0, -4.5, 0)
      const count = 900;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const rad = Math.pow(Math.random(), 2.2) * 5.5;
        const ang = Math.random() * Math.PI * 2;
        positions[i * 3]     = Math.cos(ang) * rad;
        positions[i * 3 + 1] = Math.sin(ang) * rad - 5.0; // Right below text center
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

        const norm = rad / 5.5;
        colors[i * 3]     = 1.0;
        colors[i * 3 + 1] = 0.85 - norm * 0.5;
        colors[i * 3 + 2] = 0.95 - norm * 0.4;
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.35,
        map: createGlowSpriteTexture('#ffffff', 'rgba(255, 180, 220, 0)'),
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const flarePoints = new THREE.Points(geom, mat);
      flareGroup.add(flarePoints);

      // Central radiant cross-flare sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: createFlareStarTexture(),
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false
      });
      const starSprite = new THREE.Sprite(spriteMat);
      starSprite.position.set(0, -5.0, 0.5);
      starSprite.scale.set(16, 16, 1);
      flareGroup.add(starSprite);

      coreFlare = flareGroup;
      scene.add(coreFlare);
    })();

    // 4. 3D PARTICLE TEXT SYSTEM (High Definition Typography)
    (function initTextParticleSystem() {
      const count = config.textParticleCount;
      textPositions = new Float32Array(count * 3);
      targetPositions = new Float32Array(count * 3);
      textColors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const rad = 25 + 40 * Math.random();
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        textPositions[i * 3]     = rad * Math.sin(ph) * Math.cos(th);
        textPositions[i * 3 + 1] = rad * Math.sin(ph) * Math.sin(th);
        textPositions[i * 3 + 2] = rad * Math.cos(ph);

        targetPositions[i * 3]     = textPositions[i * 3];
        targetPositions[i * 3 + 1] = textPositions[i * 3 + 1];
        targetPositions[i * 3 + 2] = textPositions[i * 3 + 2];

        textColors[i * 3]     = 1.0;
        textColors[i * 3 + 1] = 0.9;
        textColors[i * 3 + 2] = 0.95;
      }

      textGeometry = new THREE.BufferGeometry();
      textGeometry.setAttribute('position', new THREE.BufferAttribute(textPositions, 3));
      textGeometry.setAttribute('color', new THREE.BufferAttribute(textColors, 3));

      const textMaterial = new THREE.PointsMaterial({
        size: config.textParticleSize,
        map: createGlowSpriteTexture('#ffffff', 'rgba(255, 255, 255, 0)'),
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      textParticleSystem = new THREE.Points(textGeometry, textMaterial);
      textParticleSystem.position.set(0, 8, 0);
      scene.add(textParticleSystem);
    })();

    // Listeners for triggers
    window.addEventListener('__textStart', function () {
      window.__textStarted = true;
      startTextMessageSequence();
    }, { once: true });

    window.addEventListener('configLoaded', function () {
      if (window.__textStarted) startTextMessageSequence();
    });

    window.addEventListener('resize', onWindowResize);

    // Fast-forward on tap/click
    window.addEventListener('pointerdown', function () {
      if (lastMsgChangeTime > 0 && !isCompleted && Date.now() - lastMsgChangeTime > 700) {
        if (typeof window.__advanceParticleMsg === 'function') {
          window.__advanceParticleMsg(Date.now());
        }
      }
    });

    animate();
    console.log('✅ [EnhancedEffects] 3D Heart Particle & Text Engine Initialized Successfully!');
  }

  function showGlowingWishText(text) {
    let wishElem = document.getElementById('intro-glowing-wish');
    if (!wishElem) {
      let container = document.getElementById('text-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'text-container';
        document.body.appendChild(container);
      }
      wishElem = document.createElement('div');
      wishElem.id = 'intro-glowing-wish';
      wishElem.className = 'intro-glowing-wish';
      container.appendChild(wishElem);
    }

    wishElem.classList.remove('is-visible');
    wishElem.classList.add('is-exiting');

    setTimeout(() => {
      wishElem.textContent = text;
      wishElem.classList.remove('is-exiting');
      wishElem.classList.add('is-visible');
    }, 220);
  }

  function hideGlowingWishText() {
    const wishElem = document.getElementById('intro-glowing-wish');
    if (wishElem) {
      wishElem.classList.remove('is-visible');
      wishElem.classList.add('is-exiting');
      setTimeout(() => {
        wishElem.style.display = 'none';
      }, 500);
    }
  }

  function startTextMessageSequence() {
    if (textParticleSystem && camera) {
      textParticleSystem.quaternion.copy(camera.quaternion);
    }

    if (window.Heartlove && window.Heartlove.data && window.Heartlove.data.messages && window.Heartlove.data.messages.length > 0) {
      messages = window.Heartlove.data.messages;
    } else if (window.dataChristmasTree && window.dataChristmasTree.data && window.dataChristmasTree.data.messages && window.dataChristmasTree.data.messages.length > 0) {
      messages = window.dataChristmasTree.data.messages;
    } else {
      // Sweet close friendship messages (tớ - cậu)
      messages = [
        "Gửi cậu — người bạn vô cùng đáng yêu và đặc biệt của tớ ✨",
        "Chúc cậu ngày 20/10 ngập tràn niềm vui và luôn tươi cười nhé 🌸",
        "Mong thế giới luôn dịu dàng với cậu, nụ cười rạng rỡ luôn nở trên môi ☀️",
        "Cảm ơn vì đã luôn là một người bạn tuyệt vời mang lại năng lượng tích cực 💖"
      ];
    }

    currentMsgIndex = 0;
    const launchFirstMessage = () => {
      showGlowingWishText(messages[0]);
      rasterizeTextToParticles(messages[0]);
      lastMsgChangeTime = Date.now();
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(launchFirstMessage, 150));
    } else {
      setTimeout(launchFirstMessage, 300);
    }
  }

  function renderTextLetterByLetter(ctx, text, centerX, centerY, spacing, mode) {
    if (spacing <= 0) {
      if (mode === 'fill') ctx.fillText(text, centerX, centerY);
      else ctx.strokeText(text, centerX, centerY);
      return;
    }
    const chars = Array.from(text);
    const totalW = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width + spacing, -spacing);
    let curX = centerX - totalW / 2;
    for (const ch of chars) {
      const w = ctx.measureText(ch).width;
      if (mode === 'fill') ctx.fillText(ch, curX + w / 2, centerY);
      else ctx.strokeText(ch, curX + w / 2, centerY);
      curX += w + spacing;
    }
  }

  function rasterizeTextToParticles(textStr) {
    const isMob = window.innerWidth < 768;
    const cWidth = isMob ? 620 : 1240;
    const cHeight = 520;
    let fontSize = isMob ? 116 : 155;
    const depth = config.depthThickness;

    const rCanvas = document.createElement('canvas');
    rCanvas.width = cWidth;
    rCanvas.height = cHeight;
    const ctx = rCanvas.getContext('2d');
    const fontFam = '"Mali", "Pacifico", "Dancing Script", cursive, sans-serif';
    const letterSpacing = isMob ? 2 : 4;
    const maxLineW = 0.86 * cWidth;

    function wrap(size) {
      ctx.font = `${size}px ${fontFam}`;
      const lines = [];
      const words = textStr.split(' ');
      let line = words[0] || '';
      for (let i = 1; i < words.length; i++) {
        const test = line + ' ' + words[i];
        if (ctx.measureText(test).width + test.length * letterSpacing > maxLineW) {
          lines.push(line);
          line = words[i];
        } else {
          line = test;
        }
      }
      lines.push(line);
      return lines;
    }

    let lines = wrap(fontSize);
    for (let attempt = 0; attempt < 5; attempt++) {
      const lineH = 1.55 * fontSize;
      if (lines.length * lineH > 430) {
        fontSize = Math.floor(fontSize * 0.86);
        lines = wrap(fontSize);
        continue;
      }
      ctx.font = `${fontSize}px ${fontFam}`;
      let tooWide = false;
      for (const l of lines) {
        if (ctx.measureText(l).width + l.length * letterSpacing > maxLineW) {
          tooWide = true;
          break;
        }
      }
      if (!tooWide) break;
      fontSize = Math.floor(fontSize * 0.86);
      lines = wrap(fontSize);
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cWidth, cHeight);
    ctx.font = `${fontSize}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    const lineH = 1.55 * fontSize;
    const startY = 250 - ((lines.length - 1) * lineH) / 2;

    // Stroke for rich neon halo
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = isMob ? 6 : 8;
    for (let i = 0; i < lines.length; i++) {
      renderTextLetterByLetter(ctx, lines[i], cWidth / 2, startY + i * lineH, letterSpacing, 'stroke');
    }
    // Solid fill
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < lines.length; i++) {
      renderTextLetterByLetter(ctx, lines[i], cWidth / 2, startY + i * lineH, letterSpacing, 'fill');
    }

    const imgData = ctx.getImageData(0, 0, cWidth, cHeight).data;
    const points = [];
    for (let py = 0; py < cHeight; py += 2) {
      for (let px = 0; px < cWidth; px += 2) {
        const bright = imgData[4 * (py * cWidth + px)];
        if (bright > 90) points.push({ x: px, y: py, b: bright });
      }
    }

    // 3D scale adaptation
    const aspect = window.innerWidth / window.innerHeight;
    const camDist = 69.64;
    const vFOV = (75 * Math.PI) / 180;
    const visH = 2 * camDist * Math.tan(vFOV / 2);
    const visW = visH * aspect;

    let textScale;
    if (aspect < 1) {
      const targetW = visW * 0.78;
      textScale = Math.min(0.08, targetW / (0.85 * cWidth));
    } else {
      textScale = 0.1;
    }

    const offsetX = (-cWidth * textScale) / 2;
    const offsetY = checkIsIPad() ? visH * 0.05 : 0;
    const colorStart = new THREE.Color(config.colorStart);
    const colorMid   = new THREE.Color(config.colorMid);
    const colorEnd   = new THREE.Color(config.colorEnd);
    const colorAttr  = textGeometry.attributes.color;

    for (let i = 0; i < config.textParticleCount; i++) {
      if (points.length > 0) {
        const pt = points[Math.floor(Math.random() * points.length)];
        targetPositions[i * 3]     = pt.x * textScale + offsetX;
        targetPositions[i * 3 + 1] = -pt.y * textScale + (cHeight * textScale) / 2 + offsetY;
        targetPositions[i * 3 + 2] = (Math.random() - 0.5) * depth;

        const normB = pt.b / 255;
        // Text particles: pure white core to pink glowing edges
        const ptColor = normB > 0.8
          ? colorStart.clone().lerp(colorMid, (1 - normB) * 3)
          : colorMid.clone().lerp(colorEnd, 1 - normB);
        colorAttr.setXYZ(i, ptColor.r, ptColor.g, ptColor.b);
      } else {
        targetPositions[i * 3]     = 40 * (Math.random() - 0.5);
        targetPositions[i * 3 + 1] = 15 * (Math.random() - 0.5) + offsetY;
        targetPositions[i * 3 + 2] = 2 * (Math.random() - 0.5);
        colorAttr.setXYZ(i, 1.0, 0.2, 0.6);
      }
    }
    colorAttr.needsUpdate = true;
  }

  function advanceMsg(timeNow) {
    if (lastMsgChangeTime > 0 && !isCompleted) {
      currentMsgIndex++;
      if (currentMsgIndex < messages.length) {
        // Explode slightly on transition
        for (let i = 0; i < config.textParticleCount; i++) {
          const pow = 40;
          textPositions[i * 3]     += (Math.random() - 0.5) * pow;
          textPositions[i * 3 + 1] += (Math.random() - 0.5) * pow;
          textPositions[i * 3 + 2] += (Math.random() - 0.5) * pow;
        }
        showGlowingWishText(messages[currentMsgIndex]);
        rasterizeTextToParticles(messages[currentMsgIndex]);
        lastMsgChangeTime = timeNow || Date.now();
      } else {
        // Sequence Complete -> Huge Particle Explosion!
        isCompleted = true;
        isExploding = true;
        explosionStartTime = timeNow || Date.now();
        hideGlowingWishText();
        for (let i = 0; i < config.textParticleCount; i++) {
          targetPositions[i * 3]     = 320 * (Math.random() - 0.5);
          targetPositions[i * 3 + 1] = 320 * (Math.random() - 0.5);
          targetPositions[i * 3 + 2] = 320 * (Math.random() - 0.5);
        }
        console.log('✨ [EnhancedEffects] All wishes displayed! Triggering particle explosion...');
      }
    }
  }
  window.__advanceParticleMsg = advanceMsg;

  function animate() {
    requestAnimationFrame(animate);

    const now = Date.now();
    const timeSec = now * 0.001;

    // 1. Cosmic Background Stars Twinkle & Drift
    if (cosmicStars) {
      cosmicStars.rotation.y = timeSec * 0.015;
      cosmicStars.rotation.x = Math.sin(timeSec * 0.01) * 0.02;
    }

    // 2. 3D Heart Particle Nebula Gentle Breathing (Heartbeat)
    if (heartNebula) {
      const breath = 1.0 + 0.032 * Math.sin(timeSec * 1.6);
      heartNebula.scale.set(breath, breath, 1.0 + 0.02 * Math.sin(timeSec * 1.6));
      heartNebula.rotation.z = Math.sin(timeSec * 0.4) * 0.015;
    }

    // 3. Central Core Star Flare Pulse
    if (coreFlare) {
      const flarePulse = 1.0 + 0.08 * Math.sin(timeSec * 3.2);
      coreFlare.scale.set(flarePulse, flarePulse, 1.0);
    }

    // 4. 3D Particle Text Convergence & Animation
    if (textParticleSystem && messages.length > 0) {
      // Billboard directly facing camera
      textParticleSystem.quaternion.copy(camera.quaternion);

      if (!isExploding) {
        const targetY = 0.35 * Math.sin(1.2 * timeSec);
        textParticleSystem.position.x += (0 - textParticleSystem.position.x) * 0.08;
        textParticleSystem.position.y += (targetY - textParticleSystem.position.y) * 0.08;
        textParticleSystem.position.z += (0 - textParticleSystem.position.z) * 0.08;
      }

      const spd = isExploding ? 0.012 : config.gatherSpeed;
      for (let i = 0; i < config.textParticleCount; i++) {
        textPositions[i * 3]     += (targetPositions[i * 3]     - textPositions[i * 3]) * spd;
        textPositions[i * 3 + 1] += (targetPositions[i * 3 + 1] - textPositions[i * 3 + 1]) * spd;
        textPositions[i * 3 + 2] += (targetPositions[i * 3 + 2] - textPositions[i * 3 + 2]) * spd;
      }
      textGeometry.attributes.position.needsUpdate = true;

      // Check auto timer
      if (lastMsgChangeTime > 0 && !isCompleted && now - lastMsgChangeTime > MSG_DURATION) {
        advanceMsg(now);
      }

      // Explosion fade-out & transition
      if (isExploding && explosionStartTime > 0) {
        const elapsed = now - explosionStartTime;
        if (elapsed > 120) {
          const fade = Math.min(1, (elapsed - 120) / 380);
          textParticleSystem.material.opacity = 1 - fade;
        }
        if (elapsed > 500 && isExploding) {
          isExploding = false;
          textParticleSystem.visible = false;
          window.dispatchEvent(new CustomEvent('textMessagesComplete'));
          console.log('🎉 [EnhancedEffects] Explosion complete -> textMessagesComplete fired!');
        }
      }
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // Export to global window
  window.initStandaloneEffects = initStandaloneEffects;

  // Auto-init shortly after document ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initStandaloneEffects, 100));
  } else {
    setTimeout(initStandaloneEffects, 100);
  }
})();
