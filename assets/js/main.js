/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle= document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')


/*===== SHow Menu =======*/
/* Validate of constant exists */
if(navToggle){
    navToggle.addEventListener('click', ()=>{
        navMenu.classList.add('show-menu')
    })
}

/*===== Hide Menu =======*/
/* Validate of constant exists */
if(navClose){
    navClose.addEventListener('click', ()=>{
        navMenu.classList.remove('show-menu')
    })
}



/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link, #nav__button')


function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}

navLink.forEach(n =>n.addEventListener('click', linkAction))

/*=============== ACTIVE NAV LINK ===============*/
const currentPage = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav__link').forEach((link) => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
        link.classList.add('active-link');
    }
});

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 50 view port height, add the scroll-header class to teh header tag
    if(this.scrollY >=50) {
        header.classList.add('scroll-header');
    }else{
        header.classList.remove('scroll-header')
    }
    
}

window.addEventListener('scroll', scrollHeader)


/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
    // whem the scroll is greater than 350 viewport height, them we add to the header tag
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                         : scrollUp.classList.remove('show-scroll')
}

window.addEventListener('scroll',scrollUp)



/*=============== VERSE OF THE DAY ===============*/
const verseTextEl = document.getElementById('verseText');
const verseRefEl = document.getElementById('verseRef');

if (verseTextEl && verseRefEl) {
    const verses = [
        { text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', ref: 'John 3:16' },
        { text: 'I can do all things through Christ which strengtheneth me.', ref: 'Philippians 4:13' },
        { text: 'The LORD is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
        { text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', ref: 'Jeremiah 29:11' },
        { text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', ref: 'Proverbs 3:5-6' },
        { text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', ref: 'Romans 8:28' },
        { text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', ref: 'Joshua 1:9' },
        { text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28' },
        { text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.', ref: 'Isaiah 41:10' },
        { text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', ref: 'Hebrews 11:1' },
        { text: 'For where two or three are gathered together in my name, there am I in the midst of them.', ref: 'Matthew 18:20' },
        { text: 'Behold, how good and how pleasant it is for brethren to dwell together in unity!', ref: 'Psalm 133:1' },
    ];

    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((new Date() - startOfYear) / 86400000);
    const todaysVerse = verses[dayOfYear % verses.length];

    verseTextEl.textContent = `"${todaysVerse.text}"`;
    verseRefEl.textContent = `— ${todaysVerse.ref}`;
}


/*=============== Animations ===============*/

// Select bitmoji containers and images
const leftBitmojis = document.querySelectorAll('.home__bitmoji-left img');
const rightBitmojis = document.querySelectorAll('.home__bitmoji-right img');

// Function to generate a random position within a container
function getRandomPosition(container) {
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const randomX = Math.random() * (containerWidth - 50); // Subtract bitmoji width
  const randomY = Math.random() * (containerHeight - 50); // Subtract bitmoji height

  return { x: randomX, y: randomY };
}

// Function to move bitmojis randomly within their container
function moveBitmojis(bitmojis, container) {
  bitmojis.forEach((bitmoji) => {
    const { x, y } = getRandomPosition(container);
    bitmoji.style.left = `${x}px`;
    bitmoji.style.top = `${y}px`;
  });
}

// Move bitmojis every 2 seconds
function animateBitmojis() {
  const leftContainer = document.querySelector('.home__bitmoji-left');
  const rightContainer = document.querySelector('.home__bitmoji-right');

  moveBitmojis(leftBitmojis, leftContainer);
  moveBitmojis(rightBitmojis, rightContainer);
}

setInterval(animateBitmojis, 2000);


/*=============== TESTIMONIALS SLIDER ===============*/
const swiperTestimonial = new Swiper('.testimonials__swiper', {
  // Optional parameters
  loop: true,
  spaceBetween: 24,
  slidesPerView: 'auto',
  grabCursor: true,
  speed: 600,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
 },
    breakpoints: {
        1200: {
          slidesPerView: 2,
          spaceBetween: 24,
        }
    },


  // If we need pagination
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

});

/*=============== Function to animate the count ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1500,
    delay: 300,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    reset: true
});

sr.reveal(`.home__data`, {origin: 'top'});
sr.reveal(`.home__img` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.home__info-title` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.verse-of-day` , { delay: 500 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.about__heading` , { delay: 300 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.about__card` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn', interval: 150 });
sr.reveal(`.feature__heading` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.feature__data` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.feature__image-container` , { delay: 600 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.testimonials__intro` , { delay: 600 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.banner__data` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.banner__result` , { delay: 800 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.banner__image` , { delay: 400 , origin: 'right' , reset: true, animation: 'fadeIn' });
sr.reveal(`.footer__top` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.footer__watermark` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
/*==== Contact Scroll Reveal ====*/
sr.reveal(`.contact__hero` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.contact__card` , { delay: 800 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.contact-image-card` , { delay: 300 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.support__intro` , { delay: 600 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.support__card-container` , { delay: 800 , origin: 'bottom' , reset: true, animation: 'fadeIn' });




/*=============== STORE BUTTONS: COMING SOON MODAL ===============*/
const storeButtons = document.querySelectorAll('.store-button');

if (storeButtons.length) {
    const storeModalOverlay = document.createElement('div');
    storeModalOverlay.className = 'store-modal-overlay';
    storeModalOverlay.innerHTML = `
        <div class="store-modal" role="dialog" aria-modal="true" aria-labelledby="storeModalTitle">
            <button type="button" class="store-modal__close" aria-label="Close">&times;</button>
            <div class="store-modal__icon"><i class='bx bx-time-five'></i></div>
            <h3 class="store-modal__title" id="storeModalTitle">Coming Soon</h3>
            <p class="store-modal__text">InterChat isn't available on the App Store or Google Play just yet. We're putting the finishing touches on it — check back soon!</p>
            <button type="button" class="button store-modal__button">Got it</button>
        </div>
    `;
    document.body.appendChild(storeModalOverlay);

    const closeStoreModal = () => storeModalOverlay.classList.remove('show-modal');

    storeButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            storeModalOverlay.classList.add('show-modal');
        });
    });

    storeModalOverlay.querySelector('.store-modal__close').addEventListener('click', closeStoreModal);
    storeModalOverlay.querySelector('.store-modal__button').addEventListener('click', closeStoreModal);

    // Close when clicking the dark backdrop (not the modal card itself)
    storeModalOverlay.addEventListener('click', (e) => {
        if (e.target === storeModalOverlay) closeStoreModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeStoreModal();
    });
}


/*=============== Delete user info ===============*/