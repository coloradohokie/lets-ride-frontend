console.log ('hit')
const params = new URLSearchParams(document.location.search)
const id = params.get('ride_id')



fetch(`http://localhost:3000/rides/${id}`)
.then(response => response.json())
.then(ride => {
    displayTitle(ride)
    displayForm(ride)
})


function displayTitle(ride) {
    title = document.createElement('h1')
    title.innerText = (`Update ${ride.route.name} - ${ride.date_time}`)
    document.body.prepend(title)
}

function displayForm(ride) {

    form = document.querySelector('form')
    form.setAttribute("action",`http://localhost:3000/rides/${id}`)
    description = document.createElement('textarea')
    description.name = ("description")
    description.id = ("description")
    description.value = ride.description

    date = document.createElement('input')
    date.type = ('datetime-local')
    date.name = ("date")
    date.id = ("date")
    date.value = ride.date_time

    route = document.createElement('select')
    route.name = ("date")
    route.id = ("date")
    fetch('http://localhost:3000/routes')
    .then(response => response.json())
    .then(routes =>{routes.forEach( routeOption => {
        option = document.createElement('option')
        option.id = routeOption.id
        option.innerHTML = routeOption.name
        route.append(option)
    })
    })
    route.value = ride.route_id
    

    submit = document.createElement('input')
    submit.type = "submit"
    submit.value = "Update Ride"

    descriptionLabel = document.createElement('label')
    descriptionLabel.setAttribute("for", "description")

    dateLabel = document.createElement('label')
    dateLabel.setAttribute("for", "date")

    routeLabel = document.createElement('label')
    routeLabel.setAttribute("for", "route")


    form.append(descriptionLabel, description, dateLabel, date, routeLabel, route, submit)

}

