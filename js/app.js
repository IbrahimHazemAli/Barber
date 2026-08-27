/**
 * JORDAN SALOON — CORE APPLICATION CONTROLLER
 * Handles interactive elements, forced language modal, before/after slider, gallery lightbox, 
 * testimonials carousel, booking engine, strict Iraqi phone validation, and Arabic WhatsApp DM dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroCanvas();
  initServicesFilter();
  initBeforeAfterSlider();
  initGalleryAndLightbox();
  initTestimonialsCarousel();
  initBookingEngine();
  initBackToTop();
});

/* ==========================================================================
   1. NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  links.forEach(l => l.addEventListener('click', closeDrawer));
}

/* ==========================================================================
   3. HERO AMBIENT CINEMATIC CANVAS
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroAmbientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];

  const resize = () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < 18; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedY: -(Math.random() * 0.25 + 0.05),
      speedX: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.25 + 0.1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < 0) { p.y = height; p.x = Math.random() * width; }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   4. SERVICES FILTER TABS
   ========================================================================== */
function initServicesFilter() {
  const tabs = document.querySelectorAll('.services-tabs .tab-btn');
  const cards = document.querySelectorAll('.services-grid .service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Connect "Select & Book" trigger
  document.querySelectorAll('.service-book-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceValue = btn.getAttribute('data-service-val');
      const serviceSelect = document.getElementById('bookingService');
      if (serviceSelect && serviceValue) {
        serviceSelect.value = serviceValue;
        serviceSelect.dispatchEvent(new Event('change'));
      }
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   5. BEFORE / AFTER TRANSFORMATION SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const sliderBox = document.getElementById('baSliderBox');
  const beforeWrap = document.getElementById('baBeforeWrap');
  const handle = document.getElementById('baHandle');
  if (!sliderBox || !beforeWrap || !handle) return;

  let isDragging = false;

  const updatePosition = (clientX) => {
    const rect = sliderBox.getBoundingClientRect();
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    let percentage = (posX / rect.width) * 100;
    
    if (isRTL) {
      let rtlPercentage = 100 - percentage;
      beforeWrap.style.width = `${rtlPercentage}%`;
      handle.style.left = `${percentage}%`;
    } else {
      beforeWrap.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }
  };

  const startDrag = (e) => {
    isDragging = true;
    updatePosition(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const stopDrag = () => {
    isDragging = false;
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    updatePosition(e.touches ? e.touches[0].clientX : e.clientX);
  };

  sliderBox.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', onDrag);

  sliderBox.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: true });
}

/* ==========================================================================
   6. GALLERY & FULLSCREEN LIGHTBOX
   ========================================================================== */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightboxModal');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let activeIndex = 0;
  let visibleItems = [...items];

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      visibleItems = [];

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          item.style.display = '';
          visibleItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  items.forEach(item => {
    item.addEventListener('click', () => {
      activeIndex = visibleItems.indexOf(item);
      if (activeIndex === -1) activeIndex = 0;
      openLightbox();
    });
  });

  const openLightbox = () => {
    if (!visibleItems[activeIndex]) return;
    const current = visibleItems[activeIndex];
    const img = current.querySelector('.gallery-item-img');
    const title = current.querySelector('.gallery-item-title');
    const tag = current.querySelector('.gallery-item-tag');

    lbImg.src = img.src;
    lbCaption.textContent = `${tag ? tag.textContent + ' — ' : ''}${title ? title.textContent : ''}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    activeIndex = (activeIndex + 1) % visibleItems.length;
    openLightbox();
  };

  const showPrev = () => {
    activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') {
      document.documentElement.getAttribute('dir') === 'rtl' ? showPrev() : showNext();
    }
    if (e.key === 'ArrowLeft') {
      document.documentElement.getAttribute('dir') === 'rtl' ? showNext() : showPrev();
    }
  });

  // Swipe support for touch devices
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox?.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        document.documentElement.getAttribute('dir') === 'rtl' ? showPrev() : showNext();
      } else {
        document.documentElement.getAttribute('dir') === 'rtl' ? showNext() : showPrev();
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   HELPER UTILITIES & LUXURY TOAST NOTIFICATIONS
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showLuxuryToast(message, isError = false) {
  let toast = document.getElementById('luxuryToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'luxuryToast';
    toast.className = 'luxury-toast';
    document.body.appendChild(toast);
  }

  const iconSvg = isError
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

  toast.innerHTML = `<span class="luxury-toast-icon">${iconSvg}</span><span>${message}</span>`;
  toast.classList.add('active');

  clearTimeout(window.__luxuryToastTimer);
  window.__luxuryToastTimer = setTimeout(() => {
    toast.classList.remove('active');
  }, 4200);
}

/* ==========================================================================
   7. TESTIMONIALS CAROUSEL & SINGLE-REVIEW CLIENT SUBMISSION ENGINE
   ========================================================================== */
function initTestimonialsCarousel() {
  const wrapper = document.querySelector('.testimonials-wrapper');
  const prevBtn = document.getElementById('testPrevBtn');
  const nextBtn = document.getElementById('testNextBtn');
  const btnOpenModal = document.getElementById('btnOpenReviewModal');
  const btnReviewText = document.getElementById('btnReviewText');
  const reviewModal = document.getElementById('reviewModal');
  const reviewClose = document.getElementById('reviewModalClose');
  const reviewForm = document.getElementById('reviewForm');
  const starBtns = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('reviewRatingVal');

  if (!wrapper) return;

  const STORAGE_KEY_REVIEWED = 'jordan_saloon_reviewed';
  const STORAGE_KEY_USER_REVIEWS = 'jordan_saloon_user_reviews';

  // Load any previously submitted custom user reviews from localStorage
  const loadUserReviews = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER_REVIEWS);
      if (stored) {
        const reviews = JSON.parse(stored);
        if (Array.isArray(reviews)) {
          const controls = document.querySelector('.test-controls');
          reviews.forEach(rev => {
            const starsHtml = '&#9733;'.repeat(rev.rating || 5);
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
              <div class="test-stars" style="color: var(--accent-gold); font-size: 1.25rem;">${starsHtml}</div>
              <blockquote class="test-quote">"${escapeHtml(rev.quote)}"</blockquote>
              <div class="test-author">${escapeHtml(rev.author)}</div>
              <div class="test-badge" style="color: var(--accent-gold); font-weight: 600;">${escapeHtml(rev.badge)} • <span data-i18n="rev_verified_guest">تقييم موثّق</span></div>
            `;
            if (controls) {
              wrapper.insertBefore(card, controls);
            } else {
              wrapper.appendChild(card);
            }
          });
        }
      }
    } catch (e) {
      console.warn('Could not load user reviews:', e);
    }
  };

  loadUserReviews();

  let cards = Array.from(document.querySelectorAll('.testimonial-card'));
  let currentIdx = 0;
  let autoTimer = null;

  const refreshCardsList = () => {
    cards = Array.from(document.querySelectorAll('.testimonial-card'));
  };

  const showReview = (idx) => {
    refreshCardsList();
    if (!cards.length) return;
    cards.forEach((c, i) => {
      c.classList.toggle('active', i === idx);
    });
  };

  const nextReview = () => {
    refreshCardsList();
    if (!cards.length) return;
    currentIdx = (currentIdx + 1) % cards.length;
    showReview(currentIdx);
  };

  const prevReview = () => {
    refreshCardsList();
    if (!cards.length) return;
    currentIdx = (currentIdx - 1 + cards.length) % cards.length;
    showReview(currentIdx);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextReview();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevReview();
      resetTimer();
    });
  }

  const startTimer = () => {
    autoTimer = setInterval(nextReview, 6500);
  };

  const resetTimer = () => {
    clearInterval(autoTimer);
    startTimer();
  };

  startTimer();

  // Helper to get active language translation key
  const getT = (key, fallback) => {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key) || fallback;
    }
    return fallback;
  };

  // Check if user has already reviewed
  const updateReviewButtonState = () => {
    const hasReviewed = localStorage.getItem(STORAGE_KEY_REVIEWED) === 'true';
    if (hasReviewed && btnOpenModal) {
      btnOpenModal.classList.add('already-reviewed');
      if (btnReviewText) {
        btnReviewText.textContent = getT('rev_already_reviewed', '✓ تم تقديم تقييمك (شكراً لك!)');
      }
    }
  };

  updateReviewButtonState();

  // Listen to language switch events to update button text if reviewed
  window.addEventListener('languageChanged', () => {
    updateReviewButtonState();
  });

  // Open review modal with once-only enforcement
  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => {
      const hasReviewed = localStorage.getItem(STORAGE_KEY_REVIEWED) === 'true';
      if (hasReviewed) {
        showLuxuryToast(getT('rev_already_toast', 'لقد قمت بإضافة تقييمك بالفعل، يُسمح بالتقييم مرة واحدة فقط.'));
        return;
      }
      reviewModal?.classList.add('active');
    });
  }

  // Close review modal
  const closeModal = () => {
    reviewModal?.classList.remove('active');
  };

  if (reviewClose) reviewClose.addEventListener('click', closeModal);
  reviewModal?.addEventListener('click', (e) => {
    if (e.target === reviewModal) closeModal();
  });

  // Star Rating Selector
  let selectedRating = 5;
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.getAttribute('data-star'), 10) || 5;
      if (ratingInput) ratingInput.value = selectedRating;
      starBtns.forEach((s, idx) => {
        s.classList.toggle('active', idx < selectedRating);
      });
    });
  });

  // Review Form Submit Handler
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Strict once-only check
      if (localStorage.getItem(STORAGE_KEY_REVIEWED) === 'true') {
        closeModal();
        showLuxuryToast(getT('rev_already_toast', 'لقد قمت بإضافة تقييمك بالفعل، يُسمح بالتقييم مرة واحدة فقط.'));
        return;
      }

      const author = document.getElementById('reviewAuthor')?.value.trim() || 'Client';
      const badge = document.getElementById('reviewBadge')?.value.trim() || 'Verified Visit';
      const quote = document.getElementById('reviewQuote')?.value.trim() || '';
      const rating = parseInt(ratingInput?.value, 10) || selectedRating || 5;

      if (!quote || quote.length < 5) return;

      const newReview = {
        author,
        badge,
        quote,
        rating,
        date: new Date().toISOString()
      };

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY_REVIEWED, 'true');
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_REVIEWS) || '[]');
        existing.unshift(newReview);
        localStorage.setItem(STORAGE_KEY_USER_REVIEWS, JSON.stringify(existing));
      } catch (err) {
        console.warn('Storage save failed:', err);
      }

      // Add newly submitted card dynamically to the carousel
      const starsHtml = '&#9733;'.repeat(rating);
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <div class="test-stars" style="color: var(--accent-gold); font-size: 1.25rem;">${starsHtml}</div>
        <blockquote class="test-quote">"${escapeHtml(quote)}"</blockquote>
        <div class="test-author">${escapeHtml(author)}</div>
        <div class="test-badge" style="color: var(--accent-gold); font-weight: 600;">${escapeHtml(badge)} • <span data-i18n="rev_verified_guest">تقييم موثّق</span></div>
      `;

      const controls = document.querySelector('.test-controls');
      if (controls) {
        wrapper.insertBefore(card, controls);
      } else {
        wrapper.appendChild(card);
      }

      refreshCardsList();
      // Show newly added review immediately
      currentIdx = cards.indexOf(card);
      if (currentIdx === -1) currentIdx = 0;
      showReview(currentIdx);
      resetTimer();

      // Close modal & reset form
      closeModal();
      reviewForm.reset();
      updateReviewButtonState();

      // Show luxury confirmation toast
      showLuxuryToast(getT('rev_success_toast', 'شكراً لك! تمت إضافة تقييمك بنجاح.'));
    });
  }
}

/* ==========================================================================
   8. BOOKING ENGINE (STRICT IRAQI PHONE VALIDATION & ARABIC WHATSAPP)
   ========================================================================== */
function initBookingEngine() {
  const serviceSelect = document.getElementById('bookingService');
  const barberSelect = document.getElementById('bookingBarber');
  const dateInput = document.getElementById('bookingDate');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  const nameInput = document.getElementById('bookingName');
  const phoneInput = document.getElementById('bookingPhone');
  const notesInput = document.getElementById('bookingNotes');
  const phoneErrorEl = document.getElementById('phoneErrorMsg');

  // Summary Elements
  const sumService = document.getElementById('sumService');
  const sumBarber = document.getElementById('sumBarber');
  const sumDateTime = document.getElementById('sumDateTime');
  const sumPrice = document.getElementById('sumPrice');

  const btnWhatsapp = document.getElementById('btnSubmitWhatsapp');

  // Service mapping directly to Arabic names
  const arabicServiceNames = {
    'classic_haircut': 'قصة شعر كلاسيكية فاخرة',
    'skin_fade': 'سكين فيد احترافي (Skin Fade)',
    'taper_fade': 'تيبر فيد عصري (Taper Fade)',
    'scissor_cut': 'قص بالمقص اليدوي فقط',
    'beard_sculpt': 'نحت وتشذيب اللحية',
    'hot_towel_shave': 'حلاقة ملكية بالمنشفة الساخنة',
    'razor_lineup': 'تحديد حواف اللحية بالموس',
    'jordan_royal': 'باقة جوردان الملكية',
    'vip_grooming': 'جلسة العناية الشاملة VIP',
    'special_occasion': 'تصفيف المناسبات الخاصة'
  };

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  let selectedTime = '11:00 AM';

  // Time slot selection
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTime = btn.getAttribute('data-time') || btn.textContent.trim();
      updateSummary();
    });
  });

  const updateSummary = () => {
    if (!serviceSelect) return;
    const sOption = serviceSelect.options[serviceSelect.selectedIndex];
    const bOption = barberSelect?.options[barberSelect.selectedIndex];
    
    if (sumService) sumService.textContent = sOption ? sOption.text : '—';
    if (sumBarber) sumBarber.textContent = bOption ? bOption.text : (window.I18n ? window.I18n.getText('barber_no_info') : 'No Information Yet');
    if (sumDateTime) sumDateTime.textContent = `${dateInput?.value || 'Today'} @ ${selectedTime}`;
    
    // Price is UNKNOWN YET
    if (sumPrice) sumPrice.textContent = window.I18n ? window.I18n.getText('price_unknown') : 'UNKNOWN YET';
  };

  serviceSelect?.addEventListener('change', updateSummary);
  barberSelect?.addEventListener('change', updateSummary);
  dateInput?.addEventListener('change', updateSummary);
  window.addEventListener('languageChanged', updateSummary);
  updateSummary();

  // Strict Iraqi Phone Validation (+964 7XXXXXXXXX or 07XXXXXXXXX)
  function validateIraqiPhone(phoneStr) {
    if (!phoneStr) return false;
    // Remove spaces, dashes, parentheses
    const clean = phoneStr.replace(/[\s\-\(\)]/g, '');
    
    // Pattern: either +9647XXXXXXXXX (13 chars) or 009647XXXXXXXXX (14 chars) or 9647XXXXXXXXX (12 chars) or 07XXXXXXXXX (11 chars) or 7XXXXXXXXX (10 chars)
    const iraqiRegex = /^(\+964|00964|964)?0?7[3-9][0-9]{8}$/;
    return iraqiRegex.test(clean);
  }

  // Format Iraqi Phone to standardized readable format
  function formatIraqiPhone(phoneStr) {
    const clean = phoneStr.replace(/[\s\-\(\)]/g, '');
    if (clean.startsWith('+964')) return clean;
    if (clean.startsWith('00964')) return '+' + clean.substring(2);
    if (clean.startsWith('964')) return '+' + clean;
    if (clean.startsWith('0')) return '+964' + clean.substring(1);
    return '+964' + clean;
  }

  // Phone input formatting & real-time checking
  phoneInput?.addEventListener('input', () => {
    const val = phoneInput.value.trim();
    if (val.length > 0 && !validateIraqiPhone(val)) {
      if (phoneErrorEl) {
        phoneErrorEl.style.display = 'block';
        phoneErrorEl.textContent = window.I18n ? window.I18n.getText('phone_validation_error') : 'Please enter a valid Iraqi mobile number (+9647... or 07...)';
      }
      phoneInput.style.borderColor = '#ef4444';
    } else {
      if (phoneErrorEl) phoneErrorEl.style.display = 'none';
      phoneInput.style.borderColor = '';
    }
  });

  // WhatsApp Booking Handler (DIRECT TO 07722820101 IN ARABIC ONLY)
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', (e) => {
      e.preventDefault();
      const name = nameInput?.value.trim();
      const rawPhone = phoneInput?.value.trim();
      const notes = notesInput?.value.trim() || 'لا توجد ملاحظات إضافية';

      if (!name) {
        showToast('يرجى كتابة الاسم الكامل أولاً');
        nameInput.focus();
        return;
      }

      if (!validateIraqiPhone(rawPhone)) {
        if (phoneErrorEl) {
          phoneErrorEl.style.display = 'block';
          phoneErrorEl.textContent = window.I18n ? window.I18n.getText('phone_validation_error') : 'Please enter a valid Iraqi mobile number (+9647... or 07...)';
        }
        phoneInput.focus();
        phoneInput.style.borderColor = '#ef4444';
        showToast('يرجى إدخال رقم هاتف عراقي صحيح (+964)');
        return;
      }

      const formattedPhone = formatIraqiPhone(rawPhone);
      const serviceVal = serviceSelect.value;
      const arabicService = arabicServiceNames[serviceVal] || serviceSelect.options[serviceSelect.selectedIndex].text;
      const date = dateInput?.value || 'اليوم';

      // The message is STRICTLY IN ARABIC ONLY as required by the user
      const arabicMsg = 
`*طلب حجز موعد جديد — صالون جوردان*

👤 *الاسم:* ${name}
📞 *رقم الهاتف:* ${formattedPhone}
✂️ *الخدمة:* ${arabicService}
💈 *الحلاق:* لا توجد معلومات بعد (أي حلاق متاح)
📅 *الموعد:* ${date} الساعة ${selectedTime}
📝 *ملاحظات:* ${notes}

يرجى تأكيد الحجز. شكراً لكم!`;

      // Direct WhatsApp Number: 07722820101 -> 9647722820101
      const targetWhatsapp = '9647722820101';
      const whatsappUrl = `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(arabicMsg)}`;
      
      showToast('جاري فتح محادثة الواتساب مع 07722820101...');
      window.open(whatsappUrl, '_blank');
    });
  }
}

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   10. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
