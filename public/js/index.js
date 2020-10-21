const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
const userId = localStorage.getItem('userId')
const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com/`
var ride, rideDetails
const headers = {
    'Content-Type': 'application/json',
    'Authorization' : `Bearer ${token}`
}



const selectedRideSection = document.querySelector('#selected-ride-section')
const pastRidesElement = document.getElementById('past-rides')
const upcomingRidesElement = document.getElementById('upcoming-rides')
const selectedRideElement = document.querySelector('.selected-ride-section-titlebar')
const selectedRideDescriptionElement = document.querySelector('#selected-ride-description')
const selectedRouteDescriptionElement = document.querySelector('#selected-route-description')
const whosGoingElement = document.querySelector('.whos-going')
const whosGoingTitleElement = document.querySelector('#whos-going-title')


function logout () {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    location.reload()
}


function displayWelcomeMessage() {
    const welcomeMessage = document.querySelector('#welcome-message')
    welcomeMessage.innerText = `Hi ${username}! Let's Ride!`
}

async function displayRides() {
    rides.map(ride => {
        let today = Date.parse(new Date())
    
        listItem = document.createElement('li')
        listItem.classList.add("ride-list-card")
        listItem.addEventListener('click', () => {

            displayRideDetails(ride.id)
        })
        listItem.dataset.id = ride.id
        listItem.innerHTML = (`
            <div class="date">
                ${moment(ride.date).format("MMM")}<br>${moment(ride.date).format("DD")}
            </div>    
            <h3>${ride.title}</h3>
        `)
        const rideDate = Date.parse(ride.date)

        listItem.classList.add("ride")
        listItem.classList.add("user-ride")
        listItem.classList.remove("non-user-ride")
        
        rideDate >= today ? upcomingRidesElement.append(listItem) : pastRidesElement.append(listItem)
    })
}

async function fetchRides() {
    const response = await fetch(`${BASEURL}/rides`, {
        method: 'GET',
        headers
    })
    rides = await response.json()
    displayRides()
}

async function displayRideDetails(rideId) {
    console.log(rideId)
    if (rideId === 0) {
        const text = `
            <h2>Select a Ride to see details</h2>
        `
        selectedRideElement.innerHTML = text
    } else {
        console.log(rideId)
        const response = await fetch(`${BASEURL}/rides/${rideId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`}
        })
        rideDetails = await response.json()
        console.log(rideDetails)
        console.log(userOnRide(userId))
        selectedRideElement.innerHTML = (`
            <div>
                <h1>${rideDetails.ride.title}</h1>
                <p>${moment(rideDetails.ride.date).format("MMM Do, YYYY")} ${rideDetails.ride.start_time} - ${rideDetails.ride.end_time}</p>
                <p>Organizer: ${rideDetails.organizer.username}</p>
            </div>
        `)
        selectedRideDescriptionElement.innerHTML = (`
            <p>${rideDetails.ride.description}</p>
        `)
    
        selectedRouteDescriptionElement.innerHTML = (`
            <h2>Route</h2>
            <p>Start: ${rideDetails.route.start_location}</p>
            <p>End: ${rideDetails.route.end_location}</p>
            <p>Route Description: ${rideDetails.route.description}</p>
            <p>${rideDetails.route.map_path}</p>   
        `)
        
        
        whosGoingTitleElement.innerText = (`${rideDetails.riders.length} Riders Going`)
        whosGoingElement.innerHTML = ('')
        rideDetails.riders.map(rider => {
            let listItem = document.createElement('li')
            listItem.dataset.id = rider.id
            listItem.innerHTML = (`
                <li>
                    <img src = './assets/user.png' />
                    ${rider.username}
                </li>
            `)
            whosGoingElement.append(listItem)
        })

        let joinButton = document.createElement('button')
        joinButton.classList.add('join-ride-toggle-button')
        joinButton.setAttribute("onclick",`toggleRideAttendance(${rideId})`)
        selectedRideElement.appendChild(joinButton)
        joinButton.innerText = userOnRide(userId) ? "Leave Ride" : "Join Ride"
    }
}

function toggleRideAttendance(rideId) {
    if (userOnRide(userId)) {
        console.log('userid', userId)
        console.log(rideDetails.riders)
        let rideAttendanceUser = rideDetails.riders.find(rider => rider.id === parseInt(userId))
        console.log(rideAttendanceUser)
        let riderAttendanceId = rideAttendanceUser.ride_att_id
        fetch(`${BASEURL}/ride_attendances/${riderAttendanceId}`, {
            method: 'DELETE',
            headers
        })
            .then(response => response.json)
            .then(response => console.log(response))
    } else {
        fetch(`${BASEURL}/ride_attendances/`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ride_id: rideId, user_id: userId})
        })
            .then(response => response.json())
            .then(response => console.log(response))
    }
}

function userOnRide(id) {
    id = parseInt(id)
    return rideDetails.riders.find(rider => rider.id == id) ? true : false
}


if(!token) {
    window.location.href = 'login.html'
    const displayWindow = document.getElementById('content-container')
    displayWindow.style.display = 'none'
} else {
    displayWelcomeMessage()
    fetchRides()
    displayRideDetails(0)
}
