/**
 * ══════════════════════════════════════════════════════════════════════════
 * SNOOPY STORYBOARD 3D CHOREOGRAPHY & COMPANION SYSTEM (20/10 EDITION)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Diễn hoạt 3D Snoopy từ hình ảnh gốc được người dùng cung cấp:
 * 1. "này em gì ơi"       -> Snoopy Hiii (vẫy 2 ngón) [snoopy-hi.png]
 * 2. "Đệ guộc của bạn N"  -> Snoopy chỉ ngón tay vào mình [snoopy-point.png]
 * 3. "chờ xíu ..."        -> Snoopy stopp (giơ biển STOP) [snoopy-stop.png]
 * 4. "được rồi bấm đi ạ"  -> Snoopy chỉ vào chữ bấm đi [snoopy-point.png]
 * 5. "ui em đẹp quá"      -> Snoopy ngại ngùng (đỏ mặt /// \\\) [snoopy-blush.png]
 *
 * Sau đó: Thu nhỏ mượt mà lên góc trên bên trái màn hình đứng múa đến hết!
 * Tại Cảnh ảnh 1 (smile-stage): 1 Snoopy trên góc trái múa + 1 Snoopy tặng hoa "FOR YOU"
 * Tiny Eyes: Giữ nguyên vẹn 100% màu xanh cyan/aqua neon, không đổi màu vàng/hồng.
 */
(function () {
  'use strict';

  const SNOOPY_BUBBLE_REACTIONS = [
    { text: "Love you! 💕", icon: "💖" },
    { text: "20/10 thật vui nha! 🌸", icon: "💐" },
    { text: "Hehe đáng yêu quá! ✨", icon: "⭐" },
    { text: "Tặng em nè! 🎁", icon: "🎀" },
    { text: "Mãi mỉm cười nhé! 🐾", icon: "🐾" },
    { text: "Cậu tuyệt nhất luôn! 💖", icon: "🌟" }
  ];

  let currentBubbleTimeout = null;
  let currentPose = 1;
  let isShrunkToCorner = false;
  let mouseMoveTimer = null;

  // 1. TẠO DIỄN VIÊN SNOOPY 3D ĐỨNG BÊN PHẢI MÀN HÌNH
  function createSnoopyStoryboardActor() {
    if (document.getElementById('snoopy-storyboard-actor')) return;

    const actor = document.createElement('div');
    actor.id = 'snoopy-storyboard-actor';
    actor.setAttribute('aria-label', 'Snoopy 3D diễn xuất kịch bản 20/10');

    actor.innerHTML = `
      <!-- Khối bao 3D với hiệu ứng nổi khối & chiều sâu không gian -->
      <div class="snoopy-3d-wrapper" id="snoopy-3d-wrapper">
        <!-- 1. Hiii: Vẫy 2 ngón tay -->
        <img src="assets/image/snoopy-hi.png" alt="Snoopy Hii" class="snoopy-pose-img pose-1 active" id="snoopy-pose-1">

        <!-- 2. Đệ guộc bạn N: Chỉ tay tự hào -->
        <img src="assets/image/snoopy-point.png" alt="Snoopy Đệ guộc bạn N" class="snoopy-pose-img pose-2" id="snoopy-pose-2">

        <!-- 3. Stopp: Giơ bàn tay STOP từ từ -->
        <img src="assets/image/snoopy-stop.png" alt="Snoopy STOP" class="snoopy-pose-img pose-3" id="snoopy-pose-3">

        <!-- 4. Chỉ vào chữ bấm đi -->
        <img src="assets/image/snoopy-point.png" alt="Snoopy chỉ vào chữ bấm đi" class="snoopy-pose-img pose-4" id="snoopy-pose-4">

        <!-- 5. Ngại ngùng: Hai má hồng /// \\\\ -->
        <img src="assets/image/snoopy-blush.png" alt="Snoopy ngại ngùng" class="snoopy-pose-img pose-5" id="snoopy-pose-5">

        <!-- Bóng đổ 3D tiếp đất -->
        <div class="snoopy-3d-shadow"></div>
      </div>

      <!-- Huy hiệu Comic 3D nổi phía trước -->
      <div class="snoopy-story-badge" id="snoopy-story-badge">
        <span class="badge-icon" id="snoopy-badge-icon">👋</span>
        <span class="badge-text" id="snoopy-badge-text">Hii~</span>
      </div>

      <!-- Khối nhân vật Snoopy nhảy múa liên tục sau khi thu nhỏ lên góc trên bên trái -->
      <div class="snoopy-corner-dancer" id="snoopy-corner-dancer" title="Chạm để nhận yêu thương từ Snoopy!">
        <img src="assets/image/snoopy-dance.webp" alt="Snoopy nhảy múa" class="snoopy-corner-dancer-img">
        <span class="snoopy-corner-note n1">🎵</span>
        <span class="snoopy-corner-note n2">🎶</span>
        <span class="snoopy-corner-note n3">💕</span>
        <div class="snoopy-corner-bubble" id="snoopy-corner-bubble">
          <span class="c-icon">💖</span>
          <span class="c-text">Love you!</span>
        </div>
      </div>
    `;

    document.body.appendChild(actor);

    // Xử lý chạm tương tác độc lập (KHÔNG LÀM NHẢY PHÂN CẢNH CHÍNH)
    actor.addEventListener('click', function (e) {
      e.stopPropagation();
      triggerActorReaction();
    });

    actor.addEventListener('touchend', function (e) {
      e.stopPropagation();
      triggerActorReaction();
    });

    // Tương tác thị giác 3D theo con trỏ chuột
    window.addEventListener('mousemove', (e) => {
      if (isShrunkToCorner) return;
      const wrapper = document.getElementById('snoopy-3d-wrapper');
      if (!wrapper) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 28;
      const dy = -(e.clientY / window.innerHeight - 0.5) * 18;
      wrapper.style.transform = `perspective(800px) rotateY(${dx}deg) rotateX(${dy}deg) translateZ(28px)`;

      clearTimeout(mouseMoveTimer);
      mouseMoveTimer = setTimeout(() => {
        if (!isShrunkToCorner && wrapper) {
          wrapper.style.transform = '';
        }
      }, 1600);
    });
  }

  // 2. CHUYỂN ĐỔI TƯ THẾ THEO TIẾN TRÌNH KỊCH BẢN
  function setSnoopyPose(poseIndex) {
    if (isShrunkToCorner) return;
    currentPose = poseIndex;

    const poses = document.querySelectorAll('.snoopy-pose-img');
    poses.forEach(p => p.classList.remove('active'));

    const targetPose = document.getElementById(`snoopy-pose-${poseIndex}`);
    if (targetPose) targetPose.classList.add('active');

    const badgeIcon = document.getElementById('snoopy-badge-icon');
    const badgeText = document.getElementById('snoopy-badge-text');

    if (badgeIcon && badgeText) {
      switch (poseIndex) {
        case 1:
          badgeIcon.textContent = '👋';
          badgeText.textContent = 'Hii~';
          break;
        case 2:
          badgeIcon.textContent = '🐶';
          badgeText.textContent = 'Im snoopy cutee 💕';
          break;
        case 3:
          badgeIcon.textContent = '🛑';
          badgeText.textContent = 'STOP! Từ từ nè... 🐾';
          break;
        case 4:
          badgeIcon.textContent = '👉';
          badgeText.textContent = 'Được rồi bấm đi ạ! ✨';
          break;
        case 5:
          badgeIcon.textContent = '🌸';
          badgeText.textContent = 'Ui em đẹp quá... 💕';
          break;
      }
    }
  }

  // 3. THU NHỎ LÊN GÓC TRÁI TRÊN MÀN HÌNH ĐỨNG MÚA LIÊN TỤC
  function shrinkSnoopyToCorner() {
    if (isShrunkToCorner) return;
    isShrunkToCorner = true;

    const actor = document.getElementById('snoopy-storyboard-actor');
    if (!actor) return;

    // Kích hoạt class CSS thu nhỏ và trượt lên góc trái
    actor.classList.add('shrink-to-corner');
  }

  // 4. PHẢN ỨNG DỄ THƯƠNG KHI CLICK VÀO SNOOPY
  function triggerActorReaction() {
    const actor = document.getElementById('snoopy-storyboard-actor');
    const bubble = document.getElementById('snoopy-corner-bubble');
    if (!actor) return;

    if (bubble && isShrunkToCorner) {
      const item = SNOOPY_BUBBLE_REACTIONS[Math.floor(Math.random() * SNOOPY_BUBBLE_REACTIONS.length)];
      bubble.querySelector('.c-icon').textContent = item.icon;
      bubble.querySelector('.c-text').textContent = item.text;

      bubble.classList.remove('active');
      void bubble.offsetWidth;
      bubble.classList.add('active');

      if (currentBubbleTimeout) clearTimeout(currentBubbleTimeout);
      currentBubbleTimeout = setTimeout(() => {
        bubble.classList.remove('active');
      }, 2400);
    }

    // Bắn hạt icon bay lên
    for (let i = 0; i < 3; i++) {
      createFloatingIcon(isShrunkToCorner ? '💖' : '✨', actor);
    }

    // Tiny Eyes phản hồi liếc mắt nhẹ trong sắc xanh nguyên bản
    interactWithTinyEyes();
  }

  function createFloatingIcon(iconChar, parent) {
    const icon = document.createElement('div');
    icon.className = 'snoopy-floating-icon';
    icon.textContent = iconChar;
    const rect = parent.getBoundingClientRect();
    icon.style.left = (rect.width * 0.4 + (Math.random() - 0.5) * 40) + 'px';
    icon.style.top = (rect.height * 0.2 + (Math.random() - 0.5) * 20) + 'px';
    parent.appendChild(icon);

    setTimeout(() => {
      if (icon.parentNode) icon.parentNode.removeChild(icon);
    }, 1800);
  }

  // 5. TINY EYES TƯƠNG TÁC (CHỈ MÀU MẮT XANH NGUYÊN BẢN, KHÔNG ĐỔI MÀU)
  function interactWithTinyEyes() {
    const khungMat = document.getElementById('khung-mat');
    if (khungMat) {
      khungMat.style.transition = 'transform 0.45s ease';
      khungMat.style.transform = 'translate(14px, 10px) rotate(2deg)';
      setTimeout(() => {
        khungMat.style.transform = '';
      }, 1400);
    }
  }

  // 6. THEO DÕI DOM ĐỂ ĐỒNG BỘ CHÍNH XÁC KỊCH BẢN
  function setupStoryboardObservers() {
    const text1 = document.getElementById('text-1');
    const text2 = document.getElementById('text-2');
    const text3 = document.getElementById('text-3');
    const text4 = document.getElementById('text-4');
    const text5 = document.getElementById('text-5');
    const musicWaitHint = document.getElementById('music-wait-hint');

    function checkCurrentScene() {
      if (isShrunkToCorner) return;

      if (text4 && text4.classList.contains('hien-thi')) {
        setSnoopyPose(5);
      } else if (text3 && text3.classList.contains('hien-thi')) {
        if (musicWaitHint && (musicWaitHint.classList.contains('ready-to-click') || musicWaitHint.textContent.includes('được ròi bấm'))) {
          setSnoopyPose(4);
        } else {
          setSnoopyPose(3);
        }
      } else if (text2 && text2.classList.contains('hien-thi')) {
        setSnoopyPose(2);
      } else if (text1 && text1.classList.contains('hien-thi')) {
        setSnoopyPose(1);
      }

      // Khi chuyển sang cảnh sau "ui em đẹp quá" (từ text-5 trở đi hoặc khi text-4 đã tắt)
      if (text5 && text5.classList.contains('hien-thi')) {
        shrinkSnoopyToCorner();
      }
    }

    const textObserver = new MutationObserver(() => {
      checkCurrentScene();
    });

    const config = { attributes: true, attributeFilter: ['class'], characterData: true, childList: true, subtree: true };
    if (text1) textObserver.observe(text1, { attributes: true, attributeFilter: ['class'] });
    if (text2) textObserver.observe(text2, { attributes: true, attributeFilter: ['class'] });
    if (text3) textObserver.observe(text3, { attributes: true, attributeFilter: ['class'] });
    if (text4) textObserver.observe(text4, { attributes: true, attributeFilter: ['class'] });
    if (text5) textObserver.observe(text5, { attributes: true, attributeFilter: ['class'] });
    if (musicWaitHint) textObserver.observe(musicWaitHint, config);

    // Lắng nghe khi text-4 chuyển cảnh
    window.addEventListener('click', () => {
      setTimeout(() => {
        if (text4 && !text4.classList.contains('hien-thi') && (currentPose === 5)) {
          shrinkSnoopyToCorner();
        }
        checkCurrentScene();
      }, 100);
    });

    checkCurrentScene();
  }

  // Khởi động khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createSnoopyStoryboardActor();
      setupStoryboardObservers();
    });
  } else {
    createSnoopyStoryboardActor();
    setupStoryboardObservers();
  }
})();
