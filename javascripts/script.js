 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAXLtvnwX3bcsPAqpGZYuePdElYbQp5j3s",
    authDomain: "arjsproject.firebaseapp.com",
    databaseURL: "https://arjsproject.firebaseio.com",
    projectId: "arjsproject",
    storageBucket: "arjsproject.appspot.com",
    messagingSenderId: "1027437475576",
    appId: "1:1027437475576:web:a2ec36de801067855b6d0d",
    measurementId: "G-3MWNQZ3XFE"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


// getting places from REST APIs
const loadPlaces =function(position) {
    let result = []
    var locations = database.ref('locations');
    locations.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            result.push({
                name:childSnapshot.val().name,
                location: {
                    lat:childSnapshot.val().lat,
                    lng:childSnapshot.val().lng,
                }
            });
        });
    });
    return result
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('href', 'http://www.example.com/');
                    text.setAttribute('scale', '13 13 13');

                    text.addEventListener('loaded', () => {
                       window.alert(place.name)
                    });

                    scene.appendChild(text);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
