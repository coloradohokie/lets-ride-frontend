function appLogin() {
    const UsernameInputElement = document.getElementById('username')
    const PasswordInputElement = document.getElementById('password')
    const LoginMessageElement = document.getElementById('login-msg')
    let userFound = false

    if(UsernameInputElement.value == "" || PasswordInputElement.value == "") {
        LoginMessageElement.innerText = `Please specify a user name and password.`
    }
    else {
        fetch("http://localhost:3000/riders")
            .then(response => response.json())
            .then(riders => {riders.forEach(rider => {
                    if (rider.username == UsernameInputElement.value) {
                        localStorage.setItem('rider_id', rider.id)
                        userFound = true
                        location.reload()
                    }
                })
                if(userFound == false) {
                    LoginMessageElement.innerText = `User ${UsernameInputElement.value} not found.`
                }
            })
    }
}

function logout () {
    localStorage.setItem('rider_id', 0)
    location.reload()
}

function showElement (elementID) {
    const targetElement = document.getElementById(elementID)

    targetElement.style.display = "block"
}

function hideElement (elementID) {
    const targetElement = document.getElementById(elementID)

    targetElement.style.display = "none"
}

const CurrentRiderId = localStorage.getItem('rider_id')
const LoginFormElement = document.getElementById('login-form')
const LogoutButtonElement = document.getElementById('logout-button')
const RidesSection = document.getElementById('rides-section')
const MotorcyclesSection = document.getElementById('motorcycles-section')

if(CurrentRiderId > 0) {
    // Page Elements
    const WelcomeHeadingElement = document.getElementById('welcome')
    const PastRidesElement = document.getElementById('past-rides')
    const UpcomingRidesElement = document.getElementById('upcoming-rides')
    const MotorcycleListElement = document.getElementById('motorcycle-container')
    const RiderIdInputElement = document.getElementById('rider-id')

    LoginFormElement.style.display = 'none'
    // LogoutButtonElement.style.display = 'block'
    RidesSection.style.display = 'block'
    MotorcyclesSection.style.display = 'block'

    // Local Storage Values
    let today = Date.parse(new Date())
    let rideDate = new Date()

    RiderIdInputElement.value = CurrentRiderId

    fetch(`http://localhost:3000/riders/${CurrentRiderId}`)
        .then(response => response.json())
        .then(rider => {
            const welcomeMsg = `Welcome, ${rider.first_name}!`
            WelcomeHeadingElement.innerText = welcomeMsg

            const motorcycles = rider.motorcycle
            motorcycles.map(motorcycle => {
                motorcycleElement = document.createElement('div')
                motorcycleElement.classList.add("motorcycle")
                motorcycleElement.innerHTML = `<h3>${motorcycle.year} ${motorcycle.make}</h3></h4>${motorcycle.model}</h4>`
                MotorcycleListElement.appendChild(motorcycleElement)
                if(motorcycle.image_path == null) {
                    motorcycleAddButtonElement = document.createElement('button')
                    motorcycleAddButtonElement.innerText = "Add Picture"
                    motorcycleElement.appendChild(motorcycleAddButtonElement)
                }
                else {
                    motorcycleUpdateButtonElement = document.createElement('button')
                    motorcycleUpdateButtonElement.innerText = "Update Picture"
                    motorcycleElement.appendChild(motorcycleUpdateButtonElement)
                }
            });
        })

    fetch('http://localhost:3000/rides')
        .then(response => response.json())
        .then(rides => displayRides(rides))

    function displayRides(rides) {
        rides.map(ride => {
            let isUserRide = false
            listItem = document.createElement('li')
            listItem.innerHTML = (`<a href="ride.html?id=${ride.id}"><h3>${ride.date_time}</h3><h4>${ride.route.name}</h4></a>`)
            rideDate = Date.parse(ride.date_time)

            listItem.classList.add("ride")
            listItem.classList.remove("user-ride")
            listItem.classList.add("non-user-ride")

            ride.riders.forEach(rider => {
                if(rider.id == CurrentRiderId) {
                    isUserRide = true
                    listItem.classList.remove("non-user-ride")               
                    listItem.classList.add("user-ride")
                }
            })
            
            if(rideDate >= today) {
                UpcomingRidesElement.append(listItem)
                if(isUserRide == false) {
                    rideJoinButtonElement = document.createElement('button')
                    rideJoinButtonElement.innerText = "Join Ride :)"
                    listItem.appendChild(rideJoinButtonElement)
                }
                else {
                    rideLeaveButtonElement = document.createElement('button')
                    rideLeaveButtonElement.innerText = "Leave Ride :("
                    listItem.appendChild(rideLeaveButtonElement)
                }
            }
            else {
                PastRidesElement.append(listItem)
            }
        })
    }
}
else {
    LoginFormElement.style.display = 'block'
    LogoutButtonElement.style.display = 'none'
    RidesSection.style.display = 'none'
    MotorcyclesSection.style.display = 'none'
}