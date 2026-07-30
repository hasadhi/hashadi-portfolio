import { db, auth } from "./firebase.js";


import {

collection,
getDocs,
query,
where

}

from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

onAuthStateChanged

}

from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// HTML Elements


const profileEmail =
document.getElementById("profileEmail");


const totalTasks =
document.getElementById("totalTasks");


const completedTasks =
document.getElementById("completedTasks");


const pendingTasks =
document.getElementById("pendingTasks");


const percentage =
document.getElementById("percentage");


const chart =
document.getElementById("taskChart");



let myChart;





// Check User


onAuthStateChanged(auth,(user)=>{


    if(user){


        profileEmail.innerHTML =
        "Email: " + user.email;


        loadStatistics(user.uid);



    }

    else{


        window.location="login.html";


    }


});







// Load Statistics


async function loadStatistics(uid){



const q = query(

collection(db,"tasks"),

where(
"userId",
"==",
uid
)

);



const snapshot =
await getDocs(q);




let total = 0;

let completed = 0;



let study = 0;

let work = 0;

let personal = 0;

let other = 0;





snapshot.forEach((taskDoc)=>{


    let data = taskDoc.data();



    total++;



    if(data.completed){

        completed++;

    }



    if(data.category==="Study"){

        study++;

    }


    else if(data.category==="Work"){

        work++;

    }


    else if(data.category==="Personal"){

        personal++;

    }


    else{

        other++;

    }



});





let pending =
total - completed;



let progress = 0;



if(total > 0){


    progress =
    Math.round(
        (completed / total) * 100
    );


}







totalTasks.innerHTML =
"Total Tasks: " + total;



completedTasks.innerHTML =
"Completed: " + completed;



pendingTasks.innerHTML =
"Pending: " + pending;



percentage.innerHTML =
"Progress: " + progress + "%";







// Chart


if(myChart){

    myChart.destroy();

}




myChart = new Chart(chart,{


type:"doughnut",


data:{


labels:[

"Study",

"Work",

"Personal",

"Other"

],



datasets:[{


data:[

study,

work,

personal,

other

]


}]


}



});



}








// Back Button


window.goBack=function(){


window.location="index.html";


}