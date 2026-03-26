const letterCard = document.getElementById('letterCard');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');
const secretButtons = document.querySelectorAll('.secret-btn');
const toast = document.getElementById('toast');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const finalSurprise = document.getElementById('finalSurprise');
const hugMessage = document.getElementById('hugMessage');
const floatingHearts = document.querySelector('.floating-hearts');

letterCard?.addEventListener('click', () => {
  letterCard.classList.toggle('open');
  burstHearts(14);
});

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const fullImage = item.dataset.full;
    lightboxImage.src = fullImage;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

closeLightbox?.addEventListener('click', closeGallery);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeGallery();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGallery();
});

function closeGallery() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

secretButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.message || 'Untuk kamu yang spesial 🤍');
    burstHearts(8);
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

musicToggle?.addEventListener('click', async () => {
  try {
    if (bgMusic.paused) {
      await bgMusic.play();
      musicToggle.textContent = 'Pause Musik 🎵';
      showToast('Musiknya mulai diputar. Semoga suasananya makin manis ✨');
    } else {
      bgMusic.pause();
      musicToggle.textContent = 'Putar Musik 🎵';
    }
  } catch (error) {
    showToast('Belum ada file musik. Tambahkan dulu music-romantic.mp3 ya 🎶');
  }
});

finalSurprise?.addEventListener('click', () => {
  hugMessage.classList.add('show');
  burstHearts(18);
});

function burstHearts(count = 10) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = ['💖', '💕', '🤍', '✨'][Math.floor(Math.random() * 4)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${4 + Math.random() * 4}s`;
    heart.style.fontSize = `${14 + Math.random() * 18}px`;
    floatingHearts.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
  }
}

setInterval(() => burstHearts(2), 2200);

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => observer.observe(item));

const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
});

function updateTodayCountdown() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const diff = end - now;
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hour = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minute = Math.floor((diff / (1000 * 60)) % 60);
  const second = Math.floor((diff / 1000) % 60);

  document.getElementById('dayNum').textContent = String(day).padStart(2, '0');
  document.getElementById('hourNum').textContent = String(hour).padStart(2, '0');
  document.getElementById('minuteNum').textContent = String(minute).padStart(2, '0');
  document.getElementById('secondNum').textContent = String(second).padStart(2, '0');
}

updateTodayCountdown();
setInterval(updateTodayCountdown, 1000);
