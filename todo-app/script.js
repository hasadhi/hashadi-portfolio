import { db, auth } from "./firebase.js";


import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where
}
from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
    onAuthStateChanged,
    signOut
}
from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// HTML Elements

const welcomeText = document.getElementById("welcomeText");

const todayTasks = document.getElementById("todayTasks");

const recentTasks = document.getElementById("recentTasks");

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");

const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addTask");

const userEmail = document.getElementById("userEmail");

const searchInput = document.getElementById("searchInput");

const counter = document.getElementById("counter");

const progressText = document.getElementById("progressText");

const progressBar = document.getElementById("progressBar");



let currentUser = null;

let allTasks = [];




// Check Login

onAuthStateChanged(auth,(user)=>{


    if(user){

        currentUser = user;


        if(userEmail){

            userEmail.innerHTML =
            "Logged in as: " + user.email;

        }


        loadTasks();


    }

    else{

        window.location="login.html";

    }


});






// Add Task

if(addBtn){

addBtn.addEventListener("click", async()=>{


    let task = taskInput.value;

    let date = dateInput.value;



    if(task===""){

        alert("Enter a task");

        return;

    }



    await addDoc(

        collection(db,"tasks"),

        {

            userId:currentUser.uid,

            task:task,

            date:date,

            priority:priorityInput.value,

            category:categoryInput.value,

            completed:false,

            createdAt:new Date()

        }

    );



    taskInput.value="";

    dateInput.value="";


    await loadTasks();


});

}









// Load Tasks

async function loadTasks(){


    const q = query(

        collection(db,"tasks"),

        where(
            "userId",
            "==",
            currentUser.uid
        )

    );



    const snapshot = await getDocs(q);



    allTasks=[];



    snapshot.forEach((taskDoc)=>{


        allTasks.push({

            id:taskDoc.id,

            ...taskDoc.data()

        });


    });



    // Priority Sorting

    allTasks.sort((a,b)=>{


        const order={

            High:1,

            Medium:2,

            Low:3

        };


        return order[a.priority]-order[b.priority];


    });



    displayTasks(allTasks);
    loadDashboard();


}









// Display Tasks

function displayTasks(tasks){


    taskList.innerHTML="";



    tasks.forEach((data)=>{


        let div=document.createElement("div");


        div.className="task";



        div.innerHTML=`


        <span class="${data.completed ? "completed":""}">


        ${data.task}


        <br>


        <small>
        📅 ${data.date || ""}
        </small>


        <small>
        ${checkDueDate(data.date)}
        </small>


        <small>
        📂 ${data.category || ""}
        |
        ⚡ ${data.priority || ""}
        </small>


        </span>




        <div>


        <button onclick="editTask('${data.id}','${data.task}')">
        ✏️
        </button>


        <button onclick="completeTask('${data.id}')">
        ${data.completed ? "↩️" : "✓"}
        </button>


        <button onclick="deleteTask('${data.id}')">
        🗑
        </button>


        </div>


        `;



        taskList.appendChild(div);



    });



    updateProgress();


}









// Delete Task

window.deleteTask = async function(id){


    await deleteDoc(

        doc(db,"tasks",id)

    );


    loadTasks();


}









// Complete / Pending Toggle

window.completeTask = async function(id){


    let selectedTask = allTasks.find(
        task => task.id === id
    );



    await updateDoc(

        doc(db,"tasks",id),

        {

            completed:
            !selectedTask.completed

        }

    );


    loadTasks();


}









// Edit Task

window.editTask = async function(id,oldTask){


    let newTask = prompt(
        "Edit task:",
        oldTask
    );


    if(newTask && newTask !== oldTask){


        await updateDoc(

            doc(db,"tasks",id),

            {

                task:newTask

            }

        );


        loadTasks();


    }


}









// Search

window.searchTask=function(){


    let text =
    searchInput.value.toLowerCase();



    let filtered =
    allTasks.filter(task=>


        task.task.toLowerCase()
        .includes(text)


    );



    displayTasks(filtered);


}









// Filter

window.filterTasks=function(type){


    let filtered = allTasks;



    if(type==="completed"){


        filtered =
        allTasks.filter(
            task=>task.completed===true
        );


    }


    else if(type==="pending"){


        filtered =
        allTasks.filter(
            task=>task.completed===false
        );


    }



    displayTasks(filtered);


}









// Progress Bar

function updateProgress(){


    let total = allTasks.length;


    let completed =
    allTasks.filter(
        task=>task.completed===true
    ).length;



    let percentage = 0;



    if(total>0){

        percentage =
        Math.round(
            (completed/total)*100
        );

    }



    if(counter){

        counter.innerHTML =
        `Total Tasks: ${total} | Completed: ${completed}`;

    }



    if(progressText){

        progressText.innerHTML =
        `Progress: ${percentage}%`;

    }



    if(progressBar){

        progressBar.style.width =
        percentage+"%";

    }


}









// Due Date Check

function checkDueDate(date){


    if(!date){

        return "";

    }



    let today = new Date();

    let due = new Date(date);



    let difference = due - today;



    if(difference < 0){

        return "🔴 Overdue";

    }



    let days =
    Math.ceil(
        difference/(1000*60*60*24)
    );



    if(days <= 1){

        return "⚠️ Due Soon";

    }



    return "";

}









// Logout

window.logout=function(){


    signOut(auth)

    .then(()=>{


        window.location="login.html";


    });


}









// Dark Mode Save

window.toggleMode=function(){


    document.body.classList.toggle("dark");



    if(document.body.classList.contains("dark")){


        localStorage.setItem(
            "darkMode",
            "enabled"
        );


    }

    else{


        localStorage.setItem(
            "darkMode",
            "disabled"
        );


    }


}






// Load Dark Mode

if(localStorage.getItem("darkMode")==="enabled"){


    document.body.classList.add("dark");


}

// Notification Permission

if(Notification.permission !== "granted"){

    Notification.requestPermission();

}



// Check Reminder

function checkReminder(){

    let now = new Date();


    allTasks.forEach(task=>{


        if(task.date && task.completed === false){


            let due = new Date(task.date);


            let difference =
            due - now;



            // 1 hour before reminder

            if(
                difference > 0 &&
                difference <= 3600000
            ){


                new Notification(
                    "Task Reminder 🔔",
                    {
                        body:
                        task.task +
                        " is due soon!"
                    }
                );


            }


        }


    });


}



// Run every 1 minute

setInterval(
    checkReminder,
    60000
);

window.openProfile=function(){

    window.location="profile.html";

}

function loadDashboard(){


    if(welcomeText && currentUser){

        welcomeText.innerHTML =
        "Welcome 👋 " + currentUser.email;


    }



    let today =
    new Date().toISOString()
    .slice(0,16);



    let todayList =
    allTasks.filter(task=>

        task.date &&
        task.date.startsWith(today.slice(0,10))

    );



    if(todayTasks){


        todayTasks.innerHTML =
        `
        <h3>📅 Today's Tasks</h3>
        <p>
        ${todayList.length} tasks today
        </p>
        `;


    }





    let recent =
    allTasks.slice(-3);



    if(recentTasks){


        recentTasks.innerHTML =
        `
        <h3>📝 Recent Tasks</h3>
        `;



        recent.forEach(task=>{


            recentTasks.innerHTML +=

            `
            <p>
            • ${task.task}
            </p>
            `;


        });



    }


}
// Register PWA Service Worker

if("serviceWorker" in navigator){

    window.addEventListener(
    "load",
    ()=>{

        navigator.serviceWorker.register(
            "service-worker.js"
        )
        .then(()=>{

            console.log(
            "PWA Service Worker Registered"
            );

        });


    });

}