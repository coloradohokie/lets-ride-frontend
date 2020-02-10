console.log('hit')

const listOfRides = document.getElementById('list-of-rides')

fetch('http://localhost:3000/rides')
    .then(response => response.json())
    .then(rides => displayRides(rides))




function displayRides(rides) {
    rides.map(ride => {
        listItem = document.createElement('li class="ride"')
        listItem.innerHTML = (`<a href="ride.html?id=${ride.id}">${ride.route.name} ${ride.date_time} </a>`)
        listOfRides.append(listItem)
    })
}