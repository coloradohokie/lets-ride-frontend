const params = new URLSearchParams(document.location.search)
const ride_id = params.get('ride_id')
const form = document.querySelector('form')
addRideId()


function addRideId() {
    let ride = document.createElement('input')
    ride.type = ('hidden')
    ride.name = ('ride_id')
    ride.value = ride_id
    form.prepend(ride)
}