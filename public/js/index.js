const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com/`


function logout () {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    location.reload()
}

welcomeMessage = document.querySelector('#welcome-message')
welcomeMessage.innerText = `Hi ${username}! Let's Ride!`

// function leaveRide(ride_attendance_id) {
//     fetch(`${BASEURL}/ride_attendances/${ride_attendance_id}`, {method: "DELETE"})
//     .then(response => {
//         response.json()
//         window.location.href = 'index.html'
//         window.location.reload(true);
//     })
// }

// function join (rider_id, ride_id, moto_id) {
//     let fetchURL = `${BASEURL}/ride_attendances/?rider_id=${rider_id}&ride_id=${ride_id}&motorcycle_id=${moto_id}`

//     fetch(fetchURL, {method: "POST"})
//     .then(response => {
//         response.json()
//         window.location.href = 'index.html'
//         window.location.reload(true);
//     })
// }

// function joinRide(ride_element) {
//     fetch(`${BASEURL}/riders/${userId}`)
//         .then(response => response.json())
//         .then(rider => {
//             const MotorcycleCount = rider.motorcycle.length
//             const motorcycles = rider.motorcycle

//             if (MotorcycleCount == 0) {
//                 join(userId, ride_element.dataset.id, "nil")
//             }
//             else if (MotorcycleCount == 1) {
//                 join(userId, ride_element.dataset.id, rider.motorcycle[0].id)                
//             }
//             else {
//                 selectMotorcyclePrompt = document.createElement('h4')
//                 selectMotorcyclePrompt.innerText = "Select Bike:"

//                 selectMotorcycle = document.createElement('select')
//                 selectMotorcycle.setAttribute("onchange",`join(${userId}, ${ride_element.dataset.id}, this.value)`)
//                 motorcycles.forEach(motorcycle => {
//                     motoOptionElement = document.createElement('option')
//                     motoOptionElement.value = motorcycle.id
//                     motoOptionElement.innerText = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model}`
//                     selectMotorcycle.appendChild(motoOptionElement)
//                 })
//                 ride_element.appendChild(selectMotorcyclePrompt)
//                 ride_element.appendChild(selectMotorcycle)
//             }
//         })
// }



// const LogoutElement = document.getElementById('logout-button')


if(!token) {
    window.location.href = 'login.html'
    const displayWindow = document.getElementById('content-container')
    displayWindow.style.display = 'none'
} else {

    const pastRidesElement = document.getElementById('past-rides')
    const upcomingRidesElement = document.getElementById('upcoming-rides')


    // <ul id="upcoming-rides">
    // <li class="ride user-ride selected-ride">   
    //     <div class="date">
    //         Oct<br>
    //         22
    //     </div>
    //     <a class="ride-listing" href="ride.html?id=${ride.id}">Cruisers & Casinos</h4></a>
    // </li>

    let today = Date.parse(new Date())
//    let rideDate = new Date()
    fetch(`${BASEURL}/rides`)
        .then(response => response.json())
        .then(rides => displayRides(rides))

    function displayRides(rides) {
        rides.map(ride => {
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
            
            if(rideDate >= today) {
                upcomingRidesElement.append(listItem)
            } else {
                pastRidesElement.append(listItem)
            }
        })
    }
}
