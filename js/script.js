/* ========================================
   VEESUNDARAMALAI ARULMIGU SRI MUTHUMARI AMMAN AALAYAM
   ======================================== */

// ===== EVENTS DATA (Edit this array to update events) =====
const eventsData = [
  {
    date: 'June 15, 2026',
    title: 'Annual Brahmotsavam Celebrations',
    desc: 'Grand 5-day annual festival with special pujas, cultural programs, and annadanam for all devotees.',
    img: ''
  },
  {
    date: 'May 1, 2026',
    title: 'Ratha Saptami Utsavam',
    desc: 'Special Rathotsavam and kalyanotsavam celebrated with great fervor. Procession of the deity around the village.',
    img: ''
  },
  {
    date: 'April 10, 2026',
    title: 'Ugadi / New Year Celebrations',
    desc: 'Special pujas, Panchanga Sravanam, and cultural events marking the Hindu New Year.',
    img: ''
  },
  {
    date: 'March 25, 2026',
    title: 'Shiva Ratri Mahotsavam',
    desc: 'Night-long abhishekam, Rudrabhishekam, and bhajan program on the auspicious occasion of Maha Shivaratri.',
    img: ''
  },
  {
    date: 'March 8, 2026',
    title: 'Village Temple Cleaning Drive',
    desc: 'Community service initiative — cleaning and beautification of the temple premises. All are welcome to participate.',
    img: ''
  },
  {
    date: 'February 16, 2026',
    title: 'Sri Hanuman Jayanti',
    desc: 'Special pujas and Hanuman Chalisa recitation marking the birth of Lord Hanuman.',
    img: ''
  }
];

// ===== GALLERY DATA =====
// galleryData is loaded from data/gallery-data.js (auto-generated).
// Drop images into images/gallery/<Album-Name>/ and run:
//   python scripts/generate-gallery.py

// ===== IMAGE ERROR FALLBACK =====
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
    const placeholder = document.createElement('i');
    placeholder.className = 'fas fa-image';
    placeholder.style.cssText = 'font-size:2rem;color:var(--saffron);opacity:0.6;';
    e.target.parentNode?.insertBefore(placeholder, e.target);
  }
}, true);

// ===== DOM REFS =====
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link');
const eventsGrid = document.getElementById('eventsGrid');
const galleryGrid = document.getElementById('galleryGrid');
const galleryHeader = document.getElementById('galleryHeader');
const galleryBackBtn = document.getElementById('galleryBackBtn');
const galleryAlbumTitle = document.getElementById('galleryAlbumTitle');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentAlbumIndex = -1;
let currentImageIndex = 0;

// ===== MOBILE NAV TOGGLE =====
function closeNav() {
  hamburger.classList.remove('active');
  nav.classList.remove('active');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('active');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

navOverlay.addEventListener('click', closeNav);

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeNav();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// ===== SCROLL EFFECTS =====
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 80);

  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== RENDER EVENTS =====
function renderEvents() {
  if (!eventsGrid) return;
  eventsGrid.innerHTML = eventsData.map(event => {
    const imgContent = event.img
      ? `<img src="${event.img}" alt="${event.title}" loading="lazy">`
      : `<i class="fas fa-calendar-alt"></i>`;
    return `
      <article class="event-card">
        <div class="event-img">${imgContent}</div>
        <div class="event-body">
          <span class="event-date"><i class="far fa-calendar-alt"></i> ${event.date}</span>
          <h3>${event.title}</h3>
          <p>${event.desc}</p>
        </div>
      </article>
    `;
  }).join('');
}

// ===== GALLERY — Album list view =====
function renderAlbumList() {
  currentAlbumIndex = -1;
  galleryHeader.style.display = 'none';

  galleryGrid.innerHTML = galleryData.map((album, idx) => {
    const count = album.images.length;
    const coverContent = album.cover
      ? `<img src="${album.cover}" alt="${album.title}" loading="lazy">`
      : `<i class="fas fa-images"></i>`;
    return `
      <div class="album-card" data-album="${idx}">
        <div class="album-cover">${coverContent}</div>
        <div class="album-info">
          <h3 class="album-title">${album.title}</h3>
          <span class="album-count">${count} photo${count > 1 ? 's' : ''}</span>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.album);
      renderAlbum(idx);
    });
  });
}

// ===== GALLERY — Single album image grid =====
function renderAlbum(albumIndex) {
  currentAlbumIndex = albumIndex;
  const album = galleryData[albumIndex];
  if (!album) return;

  galleryHeader.style.display = 'flex';
  galleryAlbumTitle.textContent = album.title;

  galleryGrid.innerHTML = album.images.map((img, idx) => {
    const imgContent = img.src
      ? `<img src="${img.src}" alt="${img.caption}" loading="lazy">`
      : `<i class="fas fa-image"></i>`;
    return `
      <div class="gallery-item" data-img="${idx}">
        ${imgContent}
        <div class="gallery-overlay"><i class="fas fa-search-plus"></i></div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.img);
      openLightbox(idx);
    });
  });
}

galleryBackBtn.addEventListener('click', renderAlbumList);

// ===== LIGHTBOX =====
function openLightbox(index) {
  const album = galleryData[currentAlbumIndex];
  if (!album || !album.images[index]) return;
  currentImageIndex = index;
  const item = album.images[index];

  if (item.src) {
    lightboxImg.src = item.src;
  } else {
    lightboxImg.src = '';
  }
  lightboxImg.alt = item.caption;
  lightboxCaption.textContent = item.caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  const album = galleryData[currentAlbumIndex];
  if (!album) return;
  currentImageIndex += dir;
  if (currentImageIndex < 0) currentImageIndex = album.images.length - 1;
  if (currentImageIndex >= album.images.length) currentImageIndex = 0;
  const item = album.images[currentImageIndex];

  if (item.src) {
    lightboxImg.src = item.src;
  } else {
    lightboxImg.src = '';
  }
  lightboxImg.alt = item.caption;
  lightboxCaption.textContent = item.caption;
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ===== YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== INIT =====
renderEvents();
renderAlbumList();
