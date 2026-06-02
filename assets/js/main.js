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

