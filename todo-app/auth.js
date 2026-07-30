import { auth } from "./firebase.js";


import {

createUserWithEmailAndPassword,

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// Register

const registerBtn = document.getElementById("register");


if(registerBtn){


registerBtn.addEventListener("click",()=>{


let email = document.getElementById("email").value;

let password = document.getElementById("password").value;



createUserWithEmailAndPassword(

auth,

email,

password

)

.then(()=>{


alert("Account Created Successfully ✅");


window.location="login.html";


})

.catch((error)=>{


alert(error.message);


});


});


}





// Login


const loginBtn = document.getElementById("login");



if(loginBtn){


loginBtn.addEventListener("click",()=>{


let email = document.getElementById("email").value;


let password = document.getElementById("password").value;




signInWithEmailAndPassword(

auth,

email,

password

)

.then(()=>{


alert("Login Successful ✅");


window.location="index.html";


})

.catch((error)=>{


alert(error.message);


});


});


}