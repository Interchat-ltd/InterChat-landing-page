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

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = ()=>{
    const scrollY = window.scrollY;

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 58;
        sectionId = current.getAttribute('id'),
        sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if(scrollY > sectionTop &&  scrollY <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }
    })
}

window.addEventListener('scroll', scrollActive)

/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('myform'),
      closeForm = document.getElementById('waitlist__form'),
      contactMessage= document.getElementById('contact-message')

const sendMail = (e) =>{
    e.preventDefault()

        // Show the loading spinner
        const loadingSpinner = document.getElementById('loading-spinner');
        loadingSpinner.classList.add('active');
    

        //ServiceID - templateID - #form - publicKey
    emailjs.sendForm('service_hf05elj', 'template_5a5zqkw', '#myform', 'wEI9A4RRU34gRgARh')
    .then(() =>{

        // Hide the loading spinner
        loadingSpinner.classList.remove('active');

        //show Message
        // contactMessage.textContent = 'Thank you for joining InterChat 😄'

        //remove message after five seconds
        // setTimeout(()=>{
        //   contactMessage.textContent =''
        // }, 2000)

        //Clear input field
        contactForm.reset();

        //Close form
        setTimeout(()=>{
            window.location.href = 'message__feedback.html';
        }, 2000)

        
    })  
    .catch(() =>{
        // Hide the loading spinner
        loadingSpinner.classList.remove('active');

        // Show error message
        contactMessage.textContent = 'Message not sent (service error) 😞';

        setTimeout(()=>{
            contactMessage.textContent =''
        }, 2000)
    });

};

contactForm.addEventListener('submit', sendMail)


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
sr.reveal(`.feature__heading` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
sr.reveal(`.feature__data` , { delay: 400 , origin: 'bottom' , reset: true, animation: 'fadeIn' });
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