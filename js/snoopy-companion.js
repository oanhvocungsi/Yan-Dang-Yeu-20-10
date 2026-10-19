/**
 * ══════════════════════════════════════════════════════════════════════════
 * SNOOPY STORYBOARD CHOREOGRAPHY & COMPANION SYSTEM (20/10 EDITION)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Storyboard beats:
 * 1. "này em gì ơi"       -> Snoopy cười đối diện, giơ 2 ngón tay Hiii + badge "Hii~ 👋"
 * 2. "Đệ guộc của bạn N"  -> Snoopy chỉ ngón tay vào bản thân + badge "Im snoopy cutee 💕"
 * 3. "chờ xíu ..."        -> Snoopy giơ tay 5 ngón thể hiện "từ từ" + badge "Từ từ nè... ⏳"
 * 4. "được rồi bấm đi ạ"  -> Snoopy chỉ tay sang trái hướng về chữ bấm + badge "Được rồi bấm đi ạ! 👉"
 * 5. "ui em đẹp quá"      -> Snoopy chắp tay sau lưng, đỏ mặt /// \\\ màu hồng + badge "Ui em đẹp quá... 🌸"
 *
 * Sau đó: Thu nhỏ lướt lên góc trên bên trái màn hình đứng nhảy múa đến hết!
 * Tại Cảnh ảnh 1 (smile-stage): 1 Snoopy trên góc trái múa + 1 Snoopy tặng hoa "FOR YOU"
 * Tiny Eyes: Khóa chặt màu xanh cyan/blue nguyên bản (xóa vàng, hồng).
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

  // 1. TẠO DIỄN VIÊN SNOOPY STORYBOARD ĐỨNG BÊN PHẢI MÀN HÌNH
  function createSnoopyStoryboardActor() {
    if (document.getElementById('snoopy-storyboard-actor')) return;

    const actor = document.createElement('div');
    actor.id = 'snoopy-storyboard-actor';
    actor.setAttribute('aria-label', 'Snoopy tương tác kể chuyện 20/10');

    actor.innerHTML = `
      <!-- Khối hình vẽ 5 tư thế SVG phóng to đứng bên phải -->
      <div class="snoopy-actor-svg-wrap" id="snoopy-actor-svg-wrap">

        <!-- TƯ THẾ 1: Giơ 2 ngón tay Hiii -->
        <svg class="snoopy-pose pose-1 active" id="snoopy-pose-1" viewBox="0 0 200 240">
          <path d="M 132 185 Q 162 178 156 158" stroke="#111" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M 76 118 C 60 138 56 168 62 198 C 65 210 88 214 112 212 C 132 210 140 192 136 168 C 132 142 120 124 105 118 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 122 152 C 134 162 136 178 128 186 C 120 192 115 182 118 170 Z" fill="#181818"/>
          <path d="M 52 202 C 38 202 36 218 52 220 C 68 222 80 220 80 206 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 94 204 C 94 220 114 222 128 220 C 136 218 134 204 122 204 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 78 116 Q 94 123 112 116 L 111 126 Q 94 133 77 126 Z" fill="#e11d48" stroke="#111" stroke-width="3"/>
          <path d="M 90 32 C 122 32 138 48 134 76 C 130 96 115 114 96 116 C 78 118 64 106 58 92 C 48 88 32 82 28 68 C 25 54 42 46 62 48 C 68 38 78 32 90 32 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <ellipse cx="26" cy="64" rx="10" ry="8" fill="#181818"/>
          <path d="M 64 52 Q 73 44 82 52" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
          <path d="M 40 76 Q 52 86 66 78" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M 112 50 C 130 52 146 72 142 98 C 138 120 120 126 112 118 C 106 112 112 80 112 50 Z" fill="#181818" stroke="#111" stroke-width="4"/>
          <path d="M 74 138 Q 66 158 72 172" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M 100 135 C 115 125 138 100 146 75" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
          <circle cx="146" cy="74" r="8" fill="#ffffff" stroke="#111" stroke-width="3.5"/>
          <path d="M 142 70 L 139 48 C 139 44 146 44 146 48 L 145 68" fill="#ffffff" stroke="#111" stroke-width="3.2"/>
          <path d="M 147 68 L 157 52 C 159 48 166 52 163 56 L 152 72" fill="#ffffff" stroke="#111" stroke-width="3.2"/>
          <path d="M 166 44 Q 173 40 171 34" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M 175 52 Q 182 48 184 42" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round"/>
        </svg>

        <!-- TƯ THẾ 2: Đệ guộc bạn N (Chỉ tay vào bản thân) -->
        <svg class="snoopy-pose pose-2" id="snoopy-pose-2" viewBox="0 0 200 240">
          <path d="M 132 185 Q 162 178 156 158" stroke="#111" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M 76 118 C 60 138 56 168 62 198 C 65 210 88 214 112 212 C 132 210 140 192 136 168 C 132 142 120 124 105 118 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 122 152 C 134 162 136 178 128 186 C 120 192 115 182 118 170 Z" fill="#181818"/>
          <path d="M 52 202 C 38 202 36 218 52 220 C 68 222 80 220 80 206 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 94 204 C 94 220 114 222 128 220 C 136 218 134 204 122 204 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 78 116 Q 94 123 112 116 L 111 126 Q 94 133 77 126 Z" fill="#e11d48" stroke="#111" stroke-width="3"/>
          <path d="M 90 32 C 122 32 138 48 134 76 C 130 96 115 114 96 116 C 78 118 64 106 58 92 C 48 88 32 82 28 68 C 25 54 42 46 62 48 C 68 38 78 32 90 32 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <ellipse cx="26" cy="64" rx="10" ry="8" fill="#181818"/>
          <path d="M 64 50 Q 73 42 82 50" fill="none" stroke="#111" stroke-width="4.2" stroke-linecap="round"/>
          <path d="M 38 74 Q 52 88 68 76" fill="none" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>
          <path d="M 112 50 C 130 52 146 72 142 98 C 138 120 120 126 112 118 C 106 112 112 80 112 50 Z" fill="#181818" stroke="#111" stroke-width="4"/>
          <path d="M 72 136 C 58 144 56 160 68 170" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M 112 134 C 134 144 132 165 118 166" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="112" cy="165" rx="8" ry="7" fill="#ffffff" stroke="#111" stroke-width="3.5"/>
          <path d="M 108 163 L 95 160 C 91 159 91 166 96 167 L 107 167" fill="#ffffff" stroke="#111" stroke-width="3.2"/>
          <text x="145" y="65" font-size="20">✨</text>
        </svg>

        <!-- TƯ THẾ 3: Chờ xíu ... (Xòe 5 ngón từ từ) -->
        <svg class="snoopy-pose pose-3" id="snoopy-pose-3" viewBox="0 0 200 240">
          <path d="M 132 185 Q 162 178 156 158" stroke="#111" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M 76 118 C 60 138 56 168 62 198 C 65 210 88 214 112 212 C 132 210 140 192 136 168 C 132 142 120 124 105 118 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 122 152 C 134 162 136 178 128 186 C 120 192 115 182 118 170 Z" fill="#181818"/>
          <path d="M 52 202 C 38 202 36 218 52 220 C 68 222 80 220 80 206 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 94 204 C 94 220 114 222 128 220 C 136 218 134 204 122 204 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 78 116 Q 94 123 112 116 L 111 126 Q 94 133 77 126 Z" fill="#e11d48" stroke="#111" stroke-width="3"/>
          <path d="M 88 32 C 120 32 136 48 132 76 C 128 96 114 114 94 116 C 76 118 62 106 56 92 C 46 88 30 82 26 68 C 23 54 40 46 60 48 C 66 38 76 32 88 32 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <ellipse cx="24" cy="64" rx="10" ry="8" fill="#181818"/>
          <ellipse cx="68" cy="50" rx="4.5" ry="6.5" fill="#181818"/>
          <circle cx="66" cy="48" r="1.5" fill="#ffffff"/>
          <path d="M 38 75 Q 50 83 62 76" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M 110 50 C 128 52 144 72 140 98 C 136 120 118 126 110 118 C 104 112 110 80 110 50 Z" fill="#181818" stroke="#111" stroke-width="4"/>
          <path d="M 72 138 Q 66 156 70 170" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M 104 135 C 118 140 134 140 146 135" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="148" cy="132" rx="9" ry="8" fill="#ffffff" stroke="#111" stroke-width="3.5"/>
          <path d="M 142 125 L 140 108 C 140 105 145 105 145 108 L 145 125" fill="#ffffff" stroke="#111" stroke-width="2.8"/>
          <path d="M 146 124 L 148 104 C 148 101 153 101 153 104 L 150 124" fill="#ffffff" stroke="#111" stroke-width="2.8"/>
          <path d="M 151 125 L 157 106 C 158 103 163 104 162 107 L 155 126" fill="#ffffff" stroke="#111" stroke-width="2.8"/>
          <path d="M 154 128 L 164 113 C 166 110 170 113 168 116 L 157 131" fill="#ffffff" stroke="#111" stroke-width="2.8"/>
          <path d="M 141 133 L 131 126 C 128 124 126 128 129 131 L 141 137" fill="#ffffff" stroke="#111" stroke-width="2.8"/>
        </svg>

        <!-- TƯ THẾ 4: Được rồi bấm đi ạ (Chỉ ngón tay sang trái) -->
        <svg class="snoopy-pose pose-4" id="snoopy-pose-4" viewBox="0 0 200 240">
          <path d="M 134 185 Q 166 172 162 152" stroke="#111" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M 74 118 C 58 138 54 168 60 198 C 63 210 86 214 110 212 C 130 210 138 192 134 168 C 130 142 118 124 103 118 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 120 152 C 132 162 134 178 126 186 C 118 192 113 182 116 170 Z" fill="#181818"/>
          <path d="M 50 202 C 36 202 34 218 50 220 C 66 222 78 220 78 206 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 92 204 C 92 220 112 222 126 220 C 134 218 132 204 120 204 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 76 116 Q 92 123 110 116 L 109 126 Q 92 133 75 126 Z" fill="#e11d48" stroke="#111" stroke-width="3"/>
          <path d="M 88 32 C 120 32 136 48 132 76 C 128 96 114 114 94 116 C 76 118 62 106 56 92 C 46 88 30 82 26 68 C 23 54 40 46 60 48 C 66 38 76 32 88 32 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <ellipse cx="24" cy="64" rx="10" ry="8" fill="#181818"/>
          <path d="M 62 50 Q 71 42 80 50" fill="none" stroke="#111" stroke-width="4.2" stroke-linecap="round"/>
          <path d="M 36 74 Q 50 90 68 76" fill="none" stroke="#111" stroke-width="3.8" stroke-linecap="round"/>
          <path d="M 110 50 C 128 52 144 72 140 98 C 136 120 118 126 110 118 C 104 112 110 80 110 50 Z" fill="#181818" stroke="#111" stroke-width="4"/>
          <path d="M 70 138 Q 62 156 68 168" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M 98 135 C 80 138 48 138 20 135" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="22" cy="135" rx="8" ry="7" fill="#ffffff" stroke="#111" stroke-width="3.5"/>
          <path d="M 18 132 L 2 132 C -2 132 -2 138 2 138 L 18 138" fill="#ffffff" stroke="#111" stroke-width="3.2"/>
          <circle cx="-6" cy="135" r="4" fill="#38bdf8"/>
          <path d="M -14 130 L -18 135 L -14 140" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
        </svg>

        <!-- TƯ THẾ 5: Ui em đẹp quá (Chắp tay sau lưng, đỏ mặt /// \\\) -->
        <svg class="snoopy-pose pose-5" id="snoopy-pose-5" viewBox="0 0 200 240">
          <path d="M 132 185 Q 158 178 152 160" stroke="#111" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M 76 118 C 60 138 56 168 62 198 C 65 210 88 214 112 212 C 132 210 140 192 136 168 C 132 142 120 124 105 118 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
          <path d="M 122 152 C 134 162 136 178 128 186 C 120 192 115 182 118 170 Z" fill="#181818"/>
          <path d="M 58 202 C 46 202 44 218 58 220 C 72 222 82 220 82 206 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 88 204 C 88 220 104 222 118 220 C 126 218 124 204 114 204 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
          <path d="M 72 132 C 60 142 58 162 70 172 C 82 178 98 178 110 172 C 122 162 120 142 110 132" fill="none" stroke="#111" stroke-width="4.5" stroke-linecap="round"/>
          <ellipse cx="88" cy="174" rx="10" ry="7" fill="#ffffff" stroke="#111" stroke-width="3.5"/>
          <ellipse cx="98" cy="174" rx="10" ry="7" fill="#ffffff" stroke="#111" stroke-width="3.5"/>
          <path d="M 78 116 Q 94 123 112 116 L 111 126 Q 94 133 77 126 Z" fill="#e11d48" stroke="#111" stroke-width="3"/>
          <g transform="rotate(5 90 70)">
            <path d="M 90 32 C 122 32 138 48 134 76 C 130 96 115 114 96 116 C 78 118 64 106 58 92 C 48 88 32 82 28 68 C 25 54 42 46 62 48 C 68 38 78 32 90 32 Z" fill="#ffffff" stroke="#111" stroke-width="4.5" stroke-linejoin="round"/>
            <ellipse cx="26" cy="64" rx="10" ry="8" fill="#181818"/>
            <path d="M 64 52 Q 72 44 80 52" fill="none" stroke="#111" stroke-width="4.2" stroke-linecap="round"/>
            <path d="M 42 76 Q 52 84 64 78" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M 112 50 C 130 52 146 72 142 98 C 138 120 120 126 112 118 C 106 112 112 80 112 50 Z" fill="#181818" stroke="#111" stroke-width="4"/>

            <!-- MÁ HỒNG /// \\\ -->
            <ellipse cx="48" cy="70" rx="11" ry="8" fill="rgba(255, 105, 180, 0.45)"/>
            <ellipse cx="78" cy="68" rx="11" ry="8" fill="rgba(255, 105, 180, 0.45)"/>
            <line x1="43" y1="74" x2="47" y2="65" stroke="#ff2e7e" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="48" y1="74" x2="52" y2="65" stroke="#ff2e7e" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="53" y1="74" x2="57" y2="65" stroke="#ff2e7e" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="73" y1="65" x2="77" y2="74" stroke="#ff2e7e" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="78" y1="65" x2="82" y2="74" stroke="#ff2e7e" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="83" y1="65" x2="87" y2="74" stroke="#ff2e7e" stroke-width="2.4" stroke-linecap="round"/>
          </g>
          <text x="135" y="42" font-size="20">💕</text>
          <text x="155" y="28" font-size="14">💖</text>
        </svg>
      </div>

      <!-- Huy hiệu câu thoại đi kèm Snoopy -->
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
  }

  // 2. CHUYỂN ĐỔI TƯ THẾ THEO TIẾN TRÌNH KỊCH BẢN
  function setSnoopyPose(poseIndex) {
    if (isShrunkToCorner) return;
    currentPose = poseIndex;

    const poses = document.querySelectorAll('.snoopy-pose');
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
          badgeIcon.textContent = '⏳';
          badgeText.textContent = 'Từ từ nè... 🐾';
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

    // Kiểm tra trạng thái hiện tại
    function checkCurrentScene() {
      if (isShrunkToCorner) return;

      if (text4 && text4.classList.contains('hien-thi')) {
        setSnoopyPose(5);
      } else if (text3 && text3.classList.contains('hien-thi')) {
        if (musicWaitHint && musicWaitHint.classList.contains('ready-to-click')) {
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

    // Observer quan sát thay đổi class của các đoạn text
    const textObserver = new MutationObserver(() => {
      checkCurrentScene();
    });

    const config = { attributes: true, attributeFilter: ['class'] };
    if (text1) textObserver.observe(text1, config);
    if (text2) textObserver.observe(text2, config);
    if (text3) textObserver.observe(text3, config);
    if (text4) textObserver.observe(text4, config);
    if (text5) textObserver.observe(text5, config);
    if (musicWaitHint) textObserver.observe(musicWaitHint, config);

    // Lắng nghe khi text-4 chuẩn bị tắt (advanceToBeautyScene hoàn tất)
    window.addEventListener('click', () => {
      setTimeout(() => {
        if (text4 && !text4.classList.contains('hien-thi') && (currentPose === 5)) {
          shrinkSnoopyToCorner();
        }
        checkCurrentScene();
      }, 100);
    });

    // Chạy kiểm tra ban đầu
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
