
// Gestion des onglets
const boutonOnglets = document.querySelectorAll('.bouton-onglet');
const contenuOnglets = document.querySelectorAll('.contenu-onglet');

boutonOnglets.forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.getAttribute('data-tab');
    
    // Retirer la classe active de tous les boutons et contenus
    boutonOnglets.forEach(btn => btn.classList.remove('active'));
    contenuOnglets.forEach(content => content.classList.remove('active'));
    
    // Ajouter la classe active au bouton cliqué et au contenu correspondant
    button.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});

// Gestion de l'accordéon
const blocAccordeons = document.querySelectorAll('.bloc-accordeon');

blocAccordeons.forEach(item => {
  const header = item.querySelector('.entete-accordeon');
  
  header.addEventListener('click', () => {
    // Fermer tous les autres items
    blocAccordeons.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle l'item cliqué
    item.classList.toggle('active');
  });
});

// Animation au scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observer les items
document.querySelectorAll('.item-menu, .item-vin, .carte-dessert').forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(item);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});