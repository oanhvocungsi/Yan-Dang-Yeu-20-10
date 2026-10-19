/**
 * ══════════════════════════════════════════════════════════════════════════
 * MASTER CANVAS FLORAL BLOOM ENGINE (RE-ANIMATED FROM USER CODE & TIKTOK 3)
 * Xoắn ốc vàng Fibonacci, Đa tầng cánh mẫu đơn/hoa hồng, Tan biến vật lý 60fps
 * ══════════════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  // 1. TẠO SPRITE HOA HỒNG / MẪU ĐƠN NHIỀU LỚP CÁNH (OFFSCREEN CANVAS)
  const flowerSprites = [];

  function createFlowerSprite(palette) {
    const size = 260;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;

    // Bóng đổ mềm phía dưới bông hoa
    ctx.save();
    const shadowGrad = ctx.createRadialGradient(cx, cy + 6, 15, cx, cy + 6, size * 0.48);
    shadowGrad.addColorStop(0, 'rgba(45, 5, 25, 0.42)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy + 6, size * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Các tầng cánh hoa từ ngoài vào trong
    const rings = [
      { count: 9, radius: 92, pWidth: 56, pLength: 68, tilt: 0.15 },
      { count: 8, radius: 74, pWidth: 50, pLength: 58, tilt: 0.35 },
      { count: 7, radius: 56, pWidth: 44, pLength: 48, tilt: 0.6 },
      { count: 6, radius: 38, pWidth: 34, pLength: 36, tilt: 0.85 },
      { count: 5, radius: 22, pWidth: 24, pLength: 25, tilt: 1.1 }
    ];

    rings.forEach((ring, rIdx) => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2 + ring.tilt + (rIdx * 0.4);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        const grad = ctx.createRadialGradient(0, -ring.radius * 0.35, 2, 0, -ring.radius * 0.5, ring.pLength);
        grad.addColorStop(0, palette.inner);
        grad.addColorStop(0.55, palette.mid);
        grad.addColorStop(0.92, palette.outer);
        grad.addColorStop(1, palette.edge);

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(120, 20, 55, 0.18)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;

        ctx.beginPath();
        ctx.moveTo(0, -ring.radius * 0.15);
        ctx.bezierCurveTo(
          -ring.pWidth * 0.85, -ring.radius * 0.45,
          -ring.pWidth * 0.65, -ring.radius - ring.pLength * 0.35,
          0, -ring.radius - ring.pLength * 0.25
        );
        ctx.bezierCurveTo(
          ring.pWidth * 0.65, -ring.radius - ring.pLength * 0.35,
          ring.pWidth * 0.85, -ring.radius * 0.45,
          0, -ring.radius * 0.15
        );
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();
      }
    });

    // Nhụy / Tâm hoa
    const centerGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, 22);
    centerGrad.addColorStop(0, palette.core);
    centerGrad.addColorStop(0.6, palette.inner);
    centerGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();

    if (palette.stamens) {
      for (let s = 0; s < 14; s++) {
        const sa = (s / 14) * Math.PI * 2;
        const sr = 8 + (s % 3) * 5;
        const sx = cx + Math.cos(sa) * sr;
        const sy = cy + Math.sin(sa) * sr;
        ctx.strokeStyle = 'rgba(255, 230, 180, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return c;
  }

  // 5 tông màu hoa (Hồng phấn, Trắng kem, Đỏ nhung, Hồng đào, Mẫu đơn)
  const palettes = [
    { core: '#ff8fab', inner: '#ffb3c6', mid: '#ffccd5', outer: '#fff0f3', edge: '#ffe5ec', stamens: false },
    { core: '#ffc2d1', inner: '#ffe5ec', mid: '#fff8f6', outer: '#ffffff', edge: '#f8edeb', stamens: false },
    { core: '#800f2f', inner: '#c9184a', mid: '#ff4d6d', outer: '#ff758f', edge: '#ff8fa3', stamens: false },
    { core: '#ff758f', inner: '#ffa6b6', mid: '#ffd6e0', outer: '#fff0f5', edge: '#ffffff', stamens: true },
    { core: '#e05780', inner: '#ff85a1', mid: '#fbb1bd', outer: '#fae0e4', edge: '#fff5f7', stamens: true }
  ];

  palettes.forEach(p => flowerSprites.push(createFlowerSprite(p)));

  // Easing tạo độ nảy khi cánh hoa bung ra
  function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  // 2. HÀM CHÍNH KHỞI TẠO CẢNH HOA NỞ MASTER BLOOM
  window.startBloomingBouquetScene = function (onComplete) {
    const screen = document.getElementById('blooming-bouquet-screen');
    const starCanvas = document.getElementById('starfield-bloom');
    const wallCanvas = document.getElementById('flower-wall-canvas');
    const introTrigger = document.getElementById('intro-trigger');
    const seedCanvas = document.getElementById('seed-rose');
    const continueBtn = document.getElementById('continue-bloom-btn');
    const portal = document.getElementById('portal-glow-item');

    if (!screen || !wallCanvas) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    // Hiển thị màn hình
    screen.style.transition = 'opacity 1.2s ease';
    screen.style.opacity = '0';
    screen.style.display = 'flex';
    void screen.offsetWidth;
    screen.classList.add('active');
    screen.style.opacity = '1';

    // Vẽ cụm hoa mồi ở tâm
    if (seedCanvas) {
      const seedCtx = seedCanvas.getContext('2d');
      seedCtx.clearRect(0, 0, seedCanvas.width, seedCanvas.height);
      seedCtx.drawImage(flowerSprites[1], 30, 20, 180, 180);
      seedCtx.drawImage(flowerSprites[0], 15, 35, 195, 195);
    }

    // Cài đặt canvas sao trời
    const sCtx = starCanvas ? starCanvas.getContext('2d') : null;
    let stars = [];
    let starRaf = null;

    function resizeStarfield() {
      if (!starCanvas) return;
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      stars = Array.from({ length: 140 }, () => ({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.006
      }));
    }
    resizeStarfield();

    function renderStars() {
      if (!sCtx) return;
      sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      stars.forEach(st => {
        st.alpha += st.speed;
        const a = (Math.sin(st.alpha) + 1) * 0.45 + 0.1;
        sCtx.fillStyle = `rgba(255, 230, 245, ${a})`;
        sCtx.beginPath();
        sCtx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        sCtx.fill();
      });
      starRaf = requestAnimationFrame(renderStars);
    }
    renderStars();

    // Cài đặt Canvas tường hoa
    const wCtx = wallCanvas.getContext('2d');
    let flowers = [];
    let animState = 'idle'; // 'idle' | 'blooming' | 'full' | 'dissolving' | 'done'
    let bloomStartTime = 0;
    let dissolveStartTime = 0;
    let wallRaf = null;

    function resizeWall() {
      wallCanvas.width = window.innerWidth;
      wallCanvas.height = window.innerHeight;
    }
    resizeWall();

    function generateFlowerWall() {
      flowers = [];
      const cx = wallCanvas.width / 2;
      const cy = wallCanvas.height / 2;
      const maxDist = Math.hypot(cx, cy) + 140;
      const totalFlowers = window.innerWidth <= 600 ? 180 : 260;
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Xoắn ốc vàng Fibonacci

      for (let i = 0; i < totalFlowers; i++) {
        const ratio = i / totalFlowers;
        const r = Math.sqrt(ratio) * maxDist;
        const theta = i * goldenAngle;

        const x = cx + Math.cos(theta) * r + (Math.random() - 0.5) * 35;
        const y = cy + Math.sin(theta) * r + (Math.random() - 0.5) * 35;

        const rand = Math.random();
        let spriteIdx = 0;
        if (rand < 0.36) spriteIdx = 0;
        else if (rand < 0.64) spriteIdx = 1;
        else if (rand < 0.76) spriteIdx = 2;
        else if (rand < 0.88) spriteIdx = 3;
        else spriteIdx = 4;

        const delay = Math.pow(ratio, 0.82) * 3400 + Math.random() * 260;

        flowers.push({
          x, y,
          sprite: flowerSprites[spriteIdx],
          targetSize: (window.innerWidth <= 600 ? 110 : 140) + Math.random() * 80,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.25,
          delay,
          duration: 680 + Math.random() * 280,
          dissolveDelay: ((y / wallCanvas.height) * 650) + Math.random() * 350,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -0.8 - Math.random() * 1.5
        });
      }
    }

    function startBloomAnimation() {
      if (animState === 'blooming') return;
      if (continueBtn) continueBtn.classList.remove('visible');
      if (introTrigger) {
        introTrigger.style.opacity = '0';
        introTrigger.style.pointerEvents = 'none';
      }
      if (portal) portal.style.opacity = '0';

      generateFlowerWall();
      bloomStartTime = performance.now();
      animState = 'blooming';
    }

    function startDissolveAnimation() {
      if (animState !== 'full' && animState !== 'blooming') return;
      if (continueBtn) continueBtn.classList.remove('visible');
      dissolveStartTime = performance.now();
      animState = 'dissolving';
    }

    function animateFlowerWall(now) {
      wCtx.clearRect(0, 0, wallCanvas.width, wallCanvas.height);

      if (animState === 'blooming' || animState === 'full') {
        const elapsed = now - bloomStartTime;
        let allFinished = true;

        for (let i = 0; i < flowers.length; i++) {
          const f = flowers[i];
          const localTime = elapsed - f.delay;
          if (localTime <= 0) {
            allFinished = false;
            continue;
          }

          const t = Math.min(1, localTime / f.duration);
          if (t < 1) allFinished = false;

          const scale = easeOutBack(t);
          const currentSize = f.targetSize * scale;
          const currentRot = f.rotation + (1 - t) * f.rotSpeed;

          wCtx.save();
          wCtx.translate(f.x, f.y);
          wCtx.rotate(currentRot);
          wCtx.globalAlpha = Math.min(1, t * 1.4);
          wCtx.drawImage(f.sprite, -currentSize / 2, -currentSize / 2, currentSize, currentSize);
          wCtx.restore();
        }

        if (elapsed > 3300 && continueBtn && !continueBtn.classList.contains('visible')) {
          continueBtn.classList.add('visible');
        }

        if (allFinished && animState === 'blooming') {
          animState = 'full';
        }
      } else if (animState === 'dissolving') {
        const elapsed = now - dissolveStartTime;
        let anyVisible = false;

        for (let i = 0; i < flowers.length; i++) {
          const f = flowers[i];
          const localTime = elapsed - f.dissolveDelay;

          let alpha = 1, scale = 1, dx = 0, dy = 0;
          if (localTime > 0) {
            const p = Math.min(1, localTime / 900);
            alpha = 1 - p;
            scale = 1 + p * 0.28;
            dx = f.vx * localTime * 0.08;
            dy = f.vy * localTime * 0.08;
          }

          if (alpha > 0.01) {
            anyVisible = true;
            const currentSize = f.targetSize * scale;
            wCtx.save();
            wCtx.translate(f.x + dx, f.y + dy);
            wCtx.rotate(f.rotation);
            wCtx.globalAlpha = alpha;
            wCtx.drawImage(f.sprite, -currentSize / 2, -currentSize / 2, currentSize, currentSize);
            wCtx.restore();
          }
        }

        if (!anyVisible) {
          animState = 'done';
          cleanupAndFinish();
          return;
        }
      }

      wallRaf = requestAnimationFrame(animateFlowerWall);
    }
    wallRaf = requestAnimationFrame(animateFlowerWall);

    let isFinished = false;
    function cleanupAndFinish() {
      if (isFinished) return;
      isFinished = true;

      screen.style.transition = 'opacity 1.2s ease';
      screen.style.opacity = '0';

      setTimeout(() => {
        screen.classList.remove('active');
        screen.style.display = 'none';

        if (wallRaf) cancelAnimationFrame(wallRaf);
        if (starRaf) cancelAnimationFrame(starRaf);
        flowers = [];

        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 1200);
    }

    if (introTrigger) introTrigger.addEventListener('click', startBloomAnimation);
    if (continueBtn) continueBtn.addEventListener('click', startDissolveAnimation);

    // Tự động kích hoạt nở sau 800ms
    setTimeout(() => {
      if (animState === 'idle') startBloomAnimation();
    }, 800);

    // Tự động tan hoa chuyển cảnh sau 9.5s nếu người dùng không bấm nút
    setTimeout(() => {
      if (animState !== 'done' && animState !== 'dissolving') {
        startDissolveAnimation();
      }
    }, 9500);
  };
})();
