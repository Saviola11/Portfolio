const navLinks = document.querySelectorAll('.nav__link');
const offset = 210; // Możesz dostosować w zależności od wysokości nagłówka
const burgerBtn = document.querySelector('.hamburger');
const navMobile = document.querySelector('.nav');

// Funkcja odpowiedzialna za zaznaczanie aktywnej sekcji podczas scrollowania
const onScroll = () => {
  let currentSection = '';

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - offset;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSection = link.getAttribute('href');
      }
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('nav__link-active');
    if (link.getAttribute('href') === currentSection) {
      link.classList.add('nav__link-active');
    }
  });
};

window.addEventListener('scroll', onScroll);

// Funkcja odpowiedzialna za otwieranie/zamykanie burger menu
const burgerMenu = () => {
  navMobile.classList.toggle('nav-mobile-active');
}

// Dodanie funkcji otwierającej burger menu po kliknięciu w ikonę
burgerBtn.addEventListener('click', burgerMenu);

// Dodanie funkcji zamykającej burger menu po kliknięciu w link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Zamyka menu po kliknięciu w link, jeśli jest aktywne
    if (navMobile.classList.contains('nav-mobile-active')) {
      navMobile.classList.remove('nav-mobile-active');
    }
  });
});
