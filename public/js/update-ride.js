const params = new URLSearchParams(document.location.search)
const id = params.get('ride_id')
const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com/`


fetch(`${BASEURL}/rides/${id}`)
.then(response => response.json())
.then(ride => {
    displayTitle(ride)
    displayForm(ride)
})


function displayTitle(ride) {
    title = document.createElement('h1')
    title.innerText = (`Update ${ride.route.name} - ${displayDate(ride.date_time)}`)
    document.body.prepend(title)
}


function displayForm(ride) {
    form = document.querySelector('form')
    form.setAttribute("action",`${BASEURL}/rides/${id}`)

    description = document.getElementById('description')
    description.value = ride.description

    date = document.getElementById('date')
    date.value = ride.date_time

    route = document.getElementById('route')
    fetch(`${BASEURL}/routes`)
    .then(response => response.json())
    .then(routes =>{routes.forEach( routeOption => {
        option = document.createElement('option')
        option.value = routeOption.id
        option.innerHTML = routeOption.name
        if (routeOption.id == ride.route.id) {option.setAttribute("selected", "selected")}
        route.append(option)
    })
    })
}

