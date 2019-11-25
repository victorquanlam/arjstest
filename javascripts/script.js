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

  var currentLocation;

  const loadPlaces = function (coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    const method = 'api';

    const PLACES = [
        {
            name: "Your place name",
            location: {
                lat: 0, // add here latitude if using static data
                lng: 0, // add here longitude if using static data
            }
        },
    ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return PLACES;
};


// getting places from REST APIs
async function loadPlaceFromAPIs(position) {
    let result = []
    const locationsRef = database.ref('locations');
    const locations = await locationsRef.once('value');
    locations.forEach(function(snapshot) {
        result.push({
            name:snapshot.val().name,
            location: {
                lat:snapshot.val().lat,
                lng:snapshot.val().lng,
            }
        });
    })
    return result
};

// add random marker
function addRandomMarker() {
    if(currentLocation){
    var randomLat = currentLocation.latitude + Math.floor(Math.random() * (0.009 - 0.001)) + 0.001
    var randomLng = currentLocation.longitude + Math.floor(Math.random() * (0.09 - 0.01)) + 0.01
    const locationsRef = database.ref('locations');
    
        console.log(currentLocation)
        locationsRef.push({
            name: 'Random Test Name',
            lat:  randomLat,
            lng:  randomLng
        }).then(
            window.alert('Lat:'+ randomLat + ', Long:' + randomLng)
        )
    } else {
        window.alert('Cannot find your current location')
    }
    
}


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        currentLocation = position.coords
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
                    text.setAttribute('scale', '13 13 13');

                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
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
