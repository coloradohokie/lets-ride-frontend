const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com/`


function logout () {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    location.reload()
}

const logoutElement = document.getElementById('logout-button')

function displayWelcomeMessage() {
    const welcomeMessage = document.querySelector('#welcome-message')
    welcomeMessage.innerText = `Hi ${username}! Let's Ride!`
}

async function displayRides() {
    let rides = await fetchRides()
    rides.map(ride => {
        const pastRidesElement = document.getElementById('past-rides')
        const upcomingRidesElement = document.getElementById('upcoming-rides')
        let today = Date.parse(new Date())
    
        listItem = document.createElement('li')
        listItem.dataset.id = ride.id
        listItem.innerHTML = (`
            <div class="date">
                ${moment(ride.date).format("MMM")}<br>${moment(ride.date).format("DD")}
            </div>    
            <a href="ride.html?id=${ride.id}"><h3>${ride.title}</h3></a>
        `)
        const rideDate = Date.parse(ride.date)

        listItem.classList.add("ride")
        listItem.classList.add("user-ride")
        listItem.classList.remove("non-user-ride")
        
        rideDate >= today ? upcomingRidesElement.append(listItem) : pastRidesElement.append(listItem)
    })
}

async function fetchRides() {
    const response = await fetch(`${BASEURL}/rides`)
    const rides = await response.json()
    return rides
}

async function fetchRideDetails(rideId = 1) {
    const response = await fetch(`${BASEURL}/rides/${rideId}`)
    const rideDetails = await response.json()
    return rideDetails
}

async function displayRideDetails() {
    const rideDetails = await fetchRideDetails()
    console.log(rideDetails)
    const organizer = rideDetails.users.find(user => user.id === rideDetails.user_id)
    const selectedRideElement = document.querySelector('.selected-ride-section-titlebar')
    selectedRideElement.innerHTML = (`
        <div>
            <h1>${rideDetails.title}</h1>
            <p>${moment(rideDetails.date).format("MMM Do, YYYY")} ${rideDetails.start_time} - ${rideDetails.end_time}</p>
            <p>Organizer: ${organizer.username}</p>
        </div>
        <div>
            <button>Join</button>
            <p>Add Photos | Edit Route</p>
        </div>
    `)
    const selectedRideDescriptionElement = document.querySelector('#selected-ride-description')
    selectedRideDescriptionElement.innerHTML = (`
        <p>${rideDetails.description}</p>
    `)

    const selectedRouteDescriptionElement = document.querySelector('#selected-route-description')
    selectedRouteDescriptionElement.innerHTML = (`
        <h2>Route</h2>
        <p>Start: ${rideDetails.route.start_location}</p>
        <p>End: ${rideDetails.route.end_location}</p>
        <p>Route Description: ${rideDetails.route.description}</p>
        <p>${rideDetails.route.map_path}</p>   
    `)
    
    const whosGoingElement = document.querySelector('.whos-going')
    const whosGoingTitleElement = document.querySelector('#whos-going-title')
    whosGoingTitleElement.innerText = (`${rideDetails.ride_attendances.length} Riders Going`)

    rideDetails.ride_attendances.forEach(rider => {
        let listItem = document.createElement('li')
        listItem.dataset.id = rider.user_id
        listItem.innerHTML = (`
            <li>
                <img src = './assets/smile.png' />
                ${rider.user_id}
            </li>
        `)
        whosGoingElement.append(listItem)
    })
}

if(!token) {
    window.location.href = 'login.html'
    const displayWindow = document.getElementById('content-container')
    displayWindow.style.display = 'none'
} else {
    displayWelcomeMessage()
    displayRides()
    displayRideDetails()
}
