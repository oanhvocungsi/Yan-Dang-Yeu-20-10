/**
 * ══════════════════════════════════════════════════════════════════════════
 * SNOOPY COMPANION & TINY EYES INTERACTION SYSTEM (20/10 EDITION)
 * ══════════════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  const SNOOPY_REACTIONS = [
    { text: "Love you! 💕", icon: "💖" },
    { text: "20/10 vui vẻ nhé! 🌸", icon: "💐" },
    { text: "Hehe đáng yêu quá! ✨", icon: "⭐" },
    { text: "Tặng em nè! 🎁", icon: "🎀" },
    { text: "Snoopy chào em! 🐾", icon: "🐾" },
    { text: "Mãi tươi cười nha! 💛", icon: "🌻" }
  ];

  let currentBubbleTimeout = null;

  // 1. KHỞI TẠO COMPANION WIDGET Ở GÓC MÀN HÌNH
  function createSnoopyCompanion() {
    if (document.getElementById('snoopy-companion-root')) return;

    const root = document.createElement('div');
    root.id = 'snoopy-companion-root';
    root.setAttribute('aria-label', 'Snoopy companion tương tác');
    root.innerHTML = `
      <div class="snoopy-reaction-bubble" id="snoopy-bubble">
        <span class="bubble-icon">💖</span>
        <span class="bubble-text">Love you!</span>
      </div>
      <div class="snoopy-avatar-wrap">
        <img src="assets/image/snoopy-dance.webp" alt="Snoopy companion" class="snoopy-avatar-img" id="snoopy-avatar-img">
      </div>
    `;

    document.body.appendChild(root);

    // Xử lý click tương tác độc lập (KHÔNG LÀM NHẢY PHÂN CẢNH CHÍNH)
    root.addEventListener('click', function (e) {
      e.stopPropagation();
      triggerSnoopyReaction();
    });

    // Hỗ trợ touch trên điện thoại
    root.addEventListener('touchend', function (e) {
      e.stopPropagation();
      triggerSnoopyReaction();
    });
  }

  // 2. PHẢN ỨNG NGẪU NHIÊN KHI CHẠM VÀO SNOOPY
  function triggerSnoopyReaction() {
    const root = document.getElementById('snoopy-companion-root');
    const bubble = document.getElementById('snoopy-bubble');
    if (!root || !bubble) return;

    // Chọn ngẫu nhiên phản ứng
    const item = SNOOPY_REACTIONS[Math.floor(Math.random() * SNOOPY_REACTIONS.length)];
    bubble.querySelector('.bubble-icon').textContent = item.icon;
    bubble.querySelector('.bubble-text').textContent = item.text;

    bubble.classList.remove('active');
    void bubble.offsetWidth;
    bubble.classList.add('active');

    if (currentBubbleTimeout) clearTimeout(currentBubbleTimeout);
    currentBubbleTimeout = setTimeout(() => {
      bubble.classList.remove('active');
    }, 2400);

    // Bắn hạt icon bay lên
    for (let i = 0; i < 3; i++) {
      createFloatingIcon(item.icon, root);
    }

    // Kích hoạt Tiny Eyes liếc nhìn xuống và mỉm cười đổi màu
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

  // 3. ĐIỀU KHIỂN ĐÔI MẮT TINY EYES TƯƠNG TÁC
  function interactWithTinyEyes() {
    const matElements = document.querySelectorAll('#khung-mat .con-mat');
    if (!matElements || matElements.length === 0) return;

    // Đổi màu mắt sang hồng hoặc vàng ngẫu nhiên
    const colors = ['sweet-pink', 'joy-gold', 'curious-cyan'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    matElements.forEach(m => {
      m.classList.remove('sweet-pink', 'joy-gold', 'curious-cyan');
      m.classList.add(chosenColor);
    });

    // Liếc nhìn về phía góc dưới bên phải (vị trí của Snoopy)
    const khungMat = document.getElementById('khung-mat');
    if (khungMat) {
      khungMat.style.transition = 'transform 0.45s ease';
      khungMat.style.transform = 'translate(14px, 10px) rotate(2.5deg)';
      setTimeout(() => {
        khungMat.style.transform = '';
      }, 1400);
    }

    // Tự động trả về màu mắt tự nhiên sau 3.5 giây
    setTimeout(() => {
      matElements.forEach(m => {
        m.classList.remove('sweet-pink', 'joy-gold', 'curious-cyan');
      });
    }, 3500);
  }

  // 4. LẮNG NGHE CHUYỂN CẢNH ĐỂ ĐỒNG BỘ CẢM XÚC
  function watchSceneTransitions() {
    const smileStage = document.getElementById('smile-stage');
    const cloverStage = document.getElementById('clover-stage');
    const luckStage = document.getElementById('luck-stage');
    const companionRoot = document.getElementById('snoopy-companion-root');

    // Quan sát thay đổi class của các stage
    const observer = new MutationObserver(() => {
      const matElements = document.querySelectorAll('#khung-mat .con-mat');

      // Khi vào cảnh nụ cười: Tiny Eyes mắt vàng ấm vui tươi
      if (smileStage && smileStage.classList.contains('hien-thi')) {
        matElements.forEach(m => {
          m.classList.remove('sweet-pink', 'curious-cyan');
          m.classList.add('joy-gold');
        });
      }
      // Khi vào cảnh tặng hoa / cỏ may mắn: Tiny Eyes mắt hồng yêu thương
      else if ((cloverStage && cloverStage.classList.contains('hien-thi')) ||
               (luckStage && luckStage.classList.contains('hien-thi'))) {
        matElements.forEach(m => {
          m.classList.remove('joy-gold', 'curious-cyan');
          m.classList.add('sweet-pink');
        });
      }
    });

    if (smileStage) observer.observe(smileStage, { attributes: true, attributeFilter: ['class'] });
    if (cloverStage) observer.observe(cloverStage, { attributes: true, attributeFilter: ['class'] });
    if (luckStage) observer.observe(luckStage, { attributes: true, attributeFilter: ['class'] });

    // Khi chuyển sang màn hoa nở hoặc không gian 3D, làm mờ widget góc để giữ vẻ thanh thoát
    window.addEventListener('textMessagesComplete', () => {
      if (companionRoot) {
        companionRoot.style.opacity = '0';
        companionRoot.style.pointerEvents = 'none';
      }
    });
  }

  // Khởi động khi DOM đã tải xong
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createSnoopyCompanion();
      watchSceneTransitions();
    });
  } else {
    createSnoopyCompanion();
    watchSceneTransitions();
  }
})();
