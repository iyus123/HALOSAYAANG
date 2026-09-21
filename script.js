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
const hugOverlay = document.getElementById('hugOverlay');
const closeHug = document.getElementById('closeHug');
const hugStage = document.getElementById('hugStage');

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

closeHug?.addEventListener('click', closeHugOverlay);
hugOverlay?.addEventListener('click', (e) => {
  if (e.target === hugOverlay) closeHugOverlay();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeGallery();
    closeHugOverlay();
  }
});

function closeGallery() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

function closeHugOverlay() {
  hugOverlay.classList.remove('open');
  hugOverlay.setAttribute('aria-hidden', 'true');
  hugStage.classList.remove('active');
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
  hugOverlay.classList.add('open');
  hugOverlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    hugStage.classList.add('active');
  }, 120);
  burstHearts(20);
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
const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canTilt) {
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
}
// ==========================================
// SPECIAL VIDEO + BACKGROUND MUSIC
// AUTO PLAY + AUTO SOUND + SMOOTH FADE
// ==========================================

const specialVideo = document.getElementById("specialVideo");
const bgMusic = document.getElementById("bgMusic");

if (specialVideo && bgMusic) {

  let musicWasPlaying = false;
  let videoActive = false;

  // Volume normal
  const MUSIC_VOLUME = 1;
  const VIDEO_VOLUME = 1;

  // Durasi fade dalam milidetik
  const FADE_DURATION = 1500;


  // ------------------------------------------
  // FADE VOLUME
  // ------------------------------------------

  function fadeVolume(audio, targetVolume, duration = FADE_DURATION) {

    return new Promise((resolve) => {

      const startVolume = audio.volume;
      const difference = targetVolume - startVolume;
      const startTime = performance.now();

      function animate(currentTime) {

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing
        const eased = progress * (2 - progress);

        audio.volume = Math.max(
          0,
          Math.min(1, startVolume + difference * eased)
        );

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          audio.volume = targetVolume;
          resolve();
        }
      }

      requestAnimationFrame(animate);
    });
  }


  // ------------------------------------------
  // VIDEO MASUK / KELUAR LAYAR
  // ------------------------------------------

  const videoObserver = new IntersectionObserver(
    async (entries) => {

      for (const entry of entries) {

        // =====================================
        // VIDEO MASUK KE LAYAR
        // =====================================

        if (entry.isIntersecting && !videoActive) {

          videoActive = true;

          // Simpan status musik sebelum dimatikan
          musicWasPlaying = !bgMusic.paused;

          // -----------------------------------
          // FADE OUT MUSIK LATAR
          // -----------------------------------

          if (musicWasPlaying) {

            await fadeVolume(bgMusic, 0);

            bgMusic.pause();

          } else {

            bgMusic.pause();

          }


          // -----------------------------------
          // SIAPKAN VIDEO
          // -----------------------------------

          specialVideo.currentTime =
            specialVideo.currentTime || 0;

          specialVideo.volume = 0;
          specialVideo.muted = false;


          // -----------------------------------
          // PLAY VIDEO
          // -----------------------------------

          try {

            await specialVideo.play();

            // --------------------------------
            // FADE IN SUARA VIDEO
            // --------------------------------

            await fadeVolume(
              specialVideo,
              VIDEO_VOLUME
            );

          } catch (error) {

            console.log(
              "Browser memblokir autoplay dengan suara:",
              error
            );

            // Fallback kalau browser memblokir
            // autoplay dengan suara

            specialVideo.muted = true;

            specialVideo.volume = 0;

            try {
              await specialVideo.play();
            } catch (e) {
              console.log("Video gagal diputar:", e);
            }

          }

        }


        // =====================================
        // VIDEO KELUAR DARI LAYAR
        // =====================================

        if (!entry.isIntersecting && videoActive) {

          videoActive = false;


          // -----------------------------------
          // FADE OUT SUARA VIDEO
          // -----------------------------------

          await fadeVolume(
            specialVideo,
            0
          );


          // -----------------------------------
          // PAUSE + MUTE VIDEO
          // -----------------------------------

          specialVideo.pause();
          specialVideo.muted = true;


          // -----------------------------------
          // FADE IN MUSIK LATAR
          // -----------------------------------

          if (musicWasPlaying) {

            bgMusic.volume = 0;

            try {

              await bgMusic.play();

              await fadeVolume(
                bgMusic,
                MUSIC_VOLUME
              );

            } catch (error) {

              console.log(
                "Musik tidak bisa dilanjutkan:",
                error
              );

            }

          }

          musicWasPlaying = false;

        }

      }

    },

    {
      // Video dianggap tampil jika 50%
      // atau lebih terlihat di layar
      threshold: 0.5
    }
  );


  // Mulai mengamati video
  videoObserver.observe(specialVideo);


  // ------------------------------------------
  // SET VOLUME AWAL
  // ------------------------------------------

  bgMusic.volume = MUSIC_VOLUME;
  specialVideo.volume = 0;
  specialVideo.muted = true;

}
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
