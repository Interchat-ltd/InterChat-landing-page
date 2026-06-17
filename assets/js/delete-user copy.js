/*=============== DELETE USER ACCOUNT JS ===============*/
const API_URL =
"https://interchat-app-server.onrender.com/api/v1/delete-account/request";

const deleteBtn = document.getElementById("deleteBtn");
const cancelBtn = document.getElementById("cancelBtn");
const responseBox = document.getElementById("response");

const params = new URLSearchParams(window.location.search);

const prefilledEmail = params.get("email");

if(prefilledEmail){
    document.getElementById("email").value = prefilledEmail;
}

deleteBtn.addEventListener("click", async () => {

    const email =
        document.getElementById("email").value.trim();

    if(!email){

        showMessage(
            "Please enter your email address.",
            "red"
        );

        return;
    }

    const confirmed = confirm(
        "Are you sure you want to request account deletion?"
    );

    if(!confirmed){
        return;
    }

    deleteBtn.disabled = true;
    deleteBtn.innerText = "Submitting...";

    try{

        const response = await fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
            })
        });

        let data = {};

        try{
            data = await response.json();
        }catch(err){}

        if(response.ok){

            showMessage(
                "Your deletion request has been submitted successfully. Please check your email for further instructions.",
                "green"
            );

            document.getElementById("email").disabled = true;
        }
        else{

            showMessage(
                data.message ||
                "Unable to submit deletion request.",
                "red"
            );
        }

    }catch(error){

        showMessage(
            "Network error. Please try again later.",
            "red"
        );

    }finally{

        deleteBtn.disabled = false;
        deleteBtn.innerText =
        "Request Account Deletion";
    }

    

});

cancelBtn.addEventListener("click", () => {

    window.location.href =
    "https://indext.html";

});

function showMessage(message,color){

    responseBox.innerText = message;
    responseBox.style.color = color;
}