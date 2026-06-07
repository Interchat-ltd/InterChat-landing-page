
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
        }, 1000)

        
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

