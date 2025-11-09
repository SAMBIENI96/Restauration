document.addEventListener('DOMContentLoaded', () => {
  // === GESTION DES ONGLETS ===
  const boutonOnglets = document.querySelectorAll('.bouton-onglet');
  const contenuOnglets = document.querySelectorAll('.contenu-onglet');

  if (boutonOnglets.length && contenuOnglets.length) {
    boutonOnglets.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        boutonOnglets.forEach(btn => btn.classList.remove('active'));
        contenuOnglets.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        const targetEl = document.getElementById(targetTab);
        if (targetEl) targetEl.classList.add('active');
      });
    });
  }

  // === GESTION DE L’ACCORDÉON ===
  const blocAccordeons = document.querySelectorAll('.bloc-accordeon');
  if (blocAccordeons.length) {
    blocAccordeons.forEach(item => {
      const header = item.querySelector('.entete-accordeon');
      if (!header) return;
      header.addEventListener('click', () => {
        blocAccordeons.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        item.classList.toggle('active');
      });
    });
  }

  // === MENU HAMBURGER (mobile) ===
  const hamburger = document.getElementById('hamburger');
  const mobileNavLinks = document.getElementById('mobileNavLinks') || document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  const body = document.body;

  function toggleMenu() {
    if (!hamburger || !mobileNavLinks) return;
    hamburger.classList.toggle('active');
    mobileNavLinks.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('active');
    body.style.overflow = mobileNavLinks.classList.contains('active') ? 'hidden' : '';
  }

  if (hamburger && mobileNavLinks) {
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      toggleMenu();
    });

    if (navOverlay) navOverlay.addEventListener('click', toggleMenu);

    const mobileLinks = mobileNavLinks.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNavLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNavLinks.classList.contains('active')) toggleMenu();
    });

    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileNavLinks.contains(e.target)) {
        if (mobileNavLinks.classList.contains('active')) toggleMenu();
      }
    });
  }

  // === ANIMATION DES ÉLÉMENTS AU SCROLL ===
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.item-menu, .item-vin, .carte-dessert, .card, .gallery-item, .contact-card, .opening-hours, .social-section, .map-section')
    .forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(item);
    });

  // === CHANGEMENT DU HEADER QUAND ON SCROLL ===
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.style.background = 'rgb(26, 30, 44)';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      } else {
        header.style.background = '';
        header.style.boxShadow = 'none';
      }
    });
  }

  // === FORMULAIRE NEWSLETTER ===
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const button = newsletterForm.querySelector('button');
      if (!button) return;
      const originalText = button.textContent;
      button.textContent = '✓ Inscrit !';
      button.style.background = '#4ade80';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        if (input) input.value = '';
      }, 2000);
    });
  }

  // === RÉSERVATION / CALENDRIER ===
  const calendar = {
    currentDate: new Date(),
    selectedDate: null,
    init() {
      this.cache();
      this.render();
      this.attachEvents();
    },
    cache() {
      this.elCurrentMonth = document.getElementById('currentMonth');
      this.elCalendarDays = document.getElementById('calendarDays');
      this.prevBtn = document.getElementById('prevMonth');
      this.nextBtn = document.getElementById('nextMonth');
    },
    render() {
      if (!this.elCurrentMonth || !this.elCalendarDays) return;
      const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const month = this.currentDate.getMonth();
      const year = this.currentDate.getFullYear();
      this.elCurrentMonth.textContent = `${monthNames[month]} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date();
      let html = '';

      ['D', 'L', 'M', 'M', 'J', 'V', 'S'].forEach(day => {
        html += `<div class="calendar-day-name">${day}</div>`;
      });

      for (let i = 0; i < firstDay; i++) {
        html += '<button type="button" class="calendar-day empty" disabled></button>';
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isPast = date < today && date.toDateString() !== today.toDateString();
        const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
        html += `<button type="button" class="calendar-day ${isSelected ? 'selected' : ''}" 
                 data-date="${year}-${month}-${day}" ${isPast ? 'disabled' : ''}>${day}</button>`;
      }

      this.elCalendarDays.innerHTML = html;
      this.attachDayEvents();
    },
    attachEvents() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          this.render();
        });
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          this.render();
        });
      }
    },
    attachDayEvents() {
      if (!this.elCalendarDays) return;
      this.elCalendarDays.querySelectorAll('.calendar-day:not([disabled])').forEach(btn => {
        btn.addEventListener('click', e => {
          this.elCalendarDays.querySelectorAll('.calendar-day').forEach(b => b.classList.remove('selected'));
          e.currentTarget.classList.add('selected');
          const [year, month, day] = e.currentTarget.dataset.date.split('-');
          this.selectedDate = new Date(Number(year), Number(month), Number(day));
        });
      });
    }
  };

  try {
    calendar.init();
  } catch (err) {
    console.warn('Calendrier non initialisé :', err);
  }

  // === CRENEAUX HORAIRES ===
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', function() {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // === FORMULAIRE DE RÉSERVATION ===
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    reservationForm.addEventListener('submit', e => {
      e.preventDefault();
      const timeSlotEl = document.querySelector('.time-slot.selected');
      if (!calendar.selectedDate) return alert('Veuillez choisir une date.');
      if (!timeSlotEl) return alert('Veuillez choisir un créneau horaire.');

      const formData = {
        date: calendar.selectedDate.toLocaleDateString('fr-FR'),
        time: timeSlotEl.dataset.time,
        guests: document.getElementById('guests')?.value || '',
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        notes: document.getElementById('notes')?.value || ''
      };

      alert(`Réservation confirmée !\n\nDate: ${formData.date}\nHeure: ${formData.time}\nNom: ${formData.name}\nConvives: ${formData.guests}`);
      reservationForm.reset();
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      calendar.selectedDate = null;
      calendar.render();
    });
  }

  // === SMOOTH SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // === ANIMATION DES ICÔNES SOCIALES ===
  document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) rotate(5deg)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotate(0)';
    });
  });

  // === CARTE DE CONTACT CLICK ===
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', function() {
      const link = this.querySelector('a');
      if (link) {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => this.style.transform = 'scale(1)', 150);
      }
    });
  });

}); // fin DOMContentLoaded
