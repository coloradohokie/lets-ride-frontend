const URL = `https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=AIzaSyCZbiq-DB1UNormnDfharY7cEtLgD815FU`
//NOTE: This key no longer works; it needs to be updated, and hidden.

fetch(URL)
.then(response => response.json())
.then(response => console.log(response))
