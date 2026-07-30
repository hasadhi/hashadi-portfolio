const CACHE_NAME = "todo-app-v1";


const filesToCache = [
    "index.html",
    "style.css",
    "script.js"
];



// Install

self.addEventListener(
"install",
event=>{

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache=>{

            return cache.addAll(filesToCache);

        })

    );

});




// Load Offline

self.addEventListener(
"fetch",
event=>{


    event.respondWith(

        caches.match(event.request)
        .then(response=>{

            return response || fetch(event.request);

        })

    );


});