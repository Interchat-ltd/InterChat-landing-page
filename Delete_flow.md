Mobile App
    ↓
Delete Account
    ↓
User enters email
    ↓
POST /api/v1/delete-account/request
    ↓
Email sent
    ↓
User clicks link in email
    ↓
Account deleted


Recommended enhancement

Since this page will be linked from the InterChat mobile app, add query parameter support:

https://interchatinc.com/delete-account?email=user@email.com

Then auto-fill the email field from the app:

const params = new URLSearchParams(window.location.search);
const email = params.get("email");

if(email){
   document.getElementById("email").value = email;
}

This creates a smoother user experience because the user won't need to type their email again.