/* ============================================================
   ABZUNA LABS — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVIGATION: Sticky Header & Mobile Menu ── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', !isOpen);
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── SMOOTH SCROLLING ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        e.preventDefault();
        const offset = 80;
        const targetPos = targetElement.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ── SCROLL ANIMATIONS (Intersection Observer) ── */
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  const scrollObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach(el => scrollObserver.observe(el));

  /* ── CAROUSEL LOGIC ── */
  function initCarousel(trackId, prevId, nextId, dotsId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsId);

    if(!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const count = cards.length;
    let autoPlayTimer;

    // Create dots
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if(idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function updateView() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }

    function goToSlide(idx) {
      currentIndex = idx;
      updateView();
      resetAutoPlay();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % count;
      updateView();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + count) % count;
      updateView();
    }

    if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

    function startAutoPlay() { autoPlayTimer = setInterval(nextSlide, 5000); }
    function resetAutoPlay() { clearInterval(autoPlayTimer); startAutoPlay(); }

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  }

  // Initialize both carousels
  initCarousel('proof-track', 'proof-prev', 'proof-next', 'proof-dots');
  initCarousel('testi-track', 'testi-prev', 'testi-next', 'testi-dots');

  /* ── VIDEO PLAY BUTTON ── */
  const video = document.getElementById('vid-1');
  const playBtn = document.getElementById('play-1');
  const overlay = document.getElementById('overlay-1');

  if(video && playBtn && overlay) {
    playBtn.addEventListener('click', () => {
      if(video.paused) {
        video.play();
        overlay.classList.add('hidden');
      }
    });

    video.addEventListener('pause', () => {
      overlay.classList.remove('hidden');
    });

    video.addEventListener('ended', () => {
      overlay.classList.remove('hidden');
    });
  }

  /* ── FORM VALIDATION & SUBMISSION ── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if(!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const btn = document.getElementById('form-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      fetch("https://formsubmit.co/ajax/abzunatechnologies@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        contactForm.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        formSuccess.style.display = 'block';
        formSuccess.innerHTML = "✅ Request received! A confirmation email has been sent to your inbox. Our team will contact you shortly.";
        formSuccess.style.color = "var(--success)";
        formSuccess.style.backgroundColor = "rgba(16,185,129,0.08)";
        formSuccess.style.borderColor = "var(--success)";
        
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 7000);
      })
      .catch(error => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        formSuccess.style.display = 'block';
        formSuccess.innerHTML = "❌ Something went wrong. Please try emailing us directly at abzunatechnologies@gmail.com";
        formSuccess.style.color = "#ff4444";
        formSuccess.style.backgroundColor = "rgba(255,68,68,0.1)";
        formSuccess.style.borderColor = "#ff4444";
      });
    });
  }
});
