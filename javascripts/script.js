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

                    // add place icon
                    const icon = document.createElement('a-image');
                    icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    icon.setAttribute('name', place.name);
                    icon.setAttribute('src', 'map-marker.PNG');

                    // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
                    icon.setAttribute('scale', '20, 20');

                    icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

                    const clickListener = function(ev) {
                        ev.stopPropagation();
                        ev.preventDefault();
            
                        const name = ev.target.getAttribute('name');
            
                        const el = ev.detail.intersection && ev.detail.intersection.object.el;
            
                        if (el && el === ev.target) {
                            const label = document.createElement('span');
                            const container = document.createElement('div');
                            container.setAttribute('id', 'place-label');
                            label.innerText = name;
                            container.appendChild(label);
                            document.body.appendChild(container);
            
                            setTimeout(() => {
                                container.parentElement.removeChild(container);
                            }, 1500);
                        }
                    };
            
                    icon.addEventListener('click', clickListener);

                    scene.appendChild(icon);
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

const loadPlaces = function(coords) {
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

        const locations =loadPlaceFromAPIs(coords);
        console.log(locations)
        return locations;
    }

    return PLACES;
};

// getting places from REST APIs
async function loadPlaceFromAPIs(position) {
    return await fetch('https://arjsproject.firebaseapp.com/api/v1/locations/')
        .then((res) => {
            return res.json()
                .then((resp) => {
                    console.log(resp)
                    return resp;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};