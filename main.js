console.log('hit')

const listOfRides = document.getElementById('list-of-rides')

fetch('http://localhost:3000/rides')
    .then(response => response.json())
    .then(rides => displayRides(rides))




function displayRides(rides) {
    rides.map(ride => {
        listItem = document.createElement('li')
        listItem.classList.add('ride')
        console.log(listItem)
        listItem.innerHTML = (`<a href="ride.html?id=${ride.id}"> ${ride.date_time} ${ride.route.name}</a>`)
        listOfRides.append(listItem)
    })
}