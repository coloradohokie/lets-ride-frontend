const CurrentRiderId = localStorage.getItem('rider_id')

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

function leaveRide(ride_attendance_id) {
    fetch(`http://localhost:3000/ride_attendances/${ride_attendance_id}`, {method: "DELETE"})
    .then(response => {
        response.json()
        window.location.href = 'http://localhost:3001/index.html'
        window.location.reload(true);
    })
}

function join (rider_id, ride_id, moto_id) {
    let fetchURL = `http://localhost:3000/ride_attendances/?rider_id=${rider_id}&ride_id=${ride_id}&motorcycle_id=${moto_id}`

    fetch(fetchURL, {method: "POST"})
    .then(response => {
        response.json()
        window.location.href = 'http://localhost:3001/index.html'
        window.location.reload(true);
    })
}

function joinRide(ride_element) {
    fetch(`http://localhost:3000/riders/${CurrentRiderId}`)
        .then(response => response.json())
        .then(rider => {
            const MotorcycleCount = rider.motorcycle.length
            const motorcycles = rider.motorcycle

            if (MotorcycleCount == 0) {
                join(CurrentRiderId, ride_element.dataset.id, "nil")
            }
            else if (MotorcycleCount == 1) {
                join(CurrentRiderId, ride_element.dataset.id, rider.motorcycle[0].id)                
            }
            else {
                selectMotorcyclePrompt = document.createElement('h4')
                selectMotorcyclePrompt.innerText = "Select Bike:"

                selectMotorcycle = document.createElement('select')
                selectMotorcycle.setAttribute("onchange",`join(${CurrentRiderId}, ${ride_element.dataset.id}, this.value)`)
                motorcycles.forEach(motorcycle => {
                    motoOptionElement = document.createElement('option')
                    motoOptionElement.value = motorcycle.id
                    motoOptionElement.innerText = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model}`
                    selectMotorcycle.appendChild(motoOptionElement)
                })
                ride_element.appendChild(selectMotorcyclePrompt)
                ride_element.appendChild(selectMotorcycle)
            }
        })
}

function removeMotorcycle (motorcycle_id) {
    fetch(`http://localhost:3000/motorcycles/${motorcycle_id}` ,{method: "DELETE"})
        .then(response => {
            response.json()
            window.location.href = 'http://localhost:3001/index.html#motorcycles-section'
            window.location.reload(true);
        })
}

function showElement (elementID) {
    const targetElement = document.getElementById(elementID)

    targetElement.style.display = "block"
}

function hideElement (elementID) {
    const targetElement = document.getElementById(elementID)

    targetElement.style.display = "none"
}

const LoginFormElement = document.getElementById('login-form')
const LogoutElement = document.getElementById('logout-button')
const RidesSection = document.getElementById('rides-section')
const MotorcyclesSection = document.getElementById('motorcycles-section')

if(CurrentRiderId > 0) {
    const WelcomeHeadingElement = document.getElementById('welcome')
    const PastRidesElement = document.getElementById('past-rides')
    const UpcomingRidesElement = document.getElementById('upcoming-rides')
    const MotorcycleListElement = document.getElementById('motorcycle-container')
    const RiderIdInputElement = document.getElementById('rider-id')

    LoginFormElement.style.display = 'none'
    LogoutElement.style.display = 'block'
    RidesSection.style.display = 'block'
    MotorcyclesSection.style.display = 'block'

    let today = Date.parse(new Date())
    let rideDate = new Date()
    let riderMotorcyleCount = 0

    RiderIdInputElement.value = CurrentRiderId

    fetch(`http://localhost:3000/riders/${CurrentRiderId}`)
        .then(response => response.json())
        .then(rider => {
            const welcomeMsg = `Welcome, ${rider.first_name}!`
            WelcomeHeadingElement.innerText = welcomeMsg

            const motorcyclesOnRide = []
            const ride_attendances = rider.ride_attendances
            
            ride_attendances.forEach (ride_attendance => {
                motorcyclesOnRide.push(ride_attendance.motorcycle_id)
            })

            const motorcycles = rider.motorcycle
            riderMotorcyleCount = motorcycles.length
            motorcycles.map(motorcycle => {
                motorcycleElement = document.createElement('div')
                motorcycleElement.classList.add("motorcycle")
                motorcycleElement.innerHTML = `<h3>${motorcycle.year} ${motorcycle.make}</h3></h4>${motorcycle.model}</h4><br>`
                MotorcycleListElement.appendChild(motorcycleElement)

                let motorcycleIsOnRide = false
                motorcyclesOnRide.forEach(motorcycleOnRide => {
                    if(motorcycleOnRide == motorcycle.id) {
                        motorcycleIsOnRide = true
                    }
                })

                if(motorcycleIsOnRide) {
                    cantRemoveElement = document.createElement('h3')
                    cantRemoveElement.innerText = "This Bike can't be removed!"
                    cantRemoveElement.classList.add("warn-a")
                    motorcycleElement.appendChild(cantRemoveElement)
                }
                else {
                    motorcycleDelete = document.createElement('button')
                    motorcycleDelete.setAttribute("onclick",`removeMotorcycle(${motorcycle.id})`)
                    motorcycleDelete.innerText = "Remove Motorcycle"
                    motorcycleDelete.classList.add("warn-a")
                    motorcycleElement.appendChild(motorcycleDelete)
                }

                motorcycleImageElement = document.createElement('img')
                imageAction = document.createElement('a')
                motorcycleElement.appendChild(motorcycleImageElement)

                if(motorcycle.image_path == null) {
                    motorcycleImageElement.src = "https://images.unsplash.com/photo-1541612885762-0396fa9ac943?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=250&q=80"
                    motorcycleImageElement.classList.add("add-image")
                    imageAction.innerText = "Add Image"
                    imageAction.href = ""
                }
                else {
                    motorcycleImageElement.src = motorcycle.image_path
                    motorcycleImageElement.innerHTML = ""
                    imageAction.innerText = "Add Image"
                    imageAction.href = ""
                }

                motorcycleElement.appendChild(imageAction)
            });
        })

    fetch('http://localhost:3000/rides')
        .then(response => response.json())
        .then(rides => displayRides(rides))

    function displayRides(rides) {
        rides.map(ride => {
            let isUserRide = false
            let rideAttendanceID = 0
            listItem = document.createElement('li')
            listItem.dataset.id = ride.id
            listItem.innerHTML = (`<a href="ride.html?id=${ride.id}"><h3>${ride.date_time}</h3><h4>${ride.route.name}</h4></a>`)
            rideDate = Date.parse(ride.date_time)

            listItem.classList.add("ride")
            listItem.classList.remove("user-ride")
            listItem.classList.add("non-user-ride")

            ride.ride_attendances.forEach(ride_attendance => {
                if(ride_attendance.rider_id == CurrentRiderId) {
                    isUserRide = true
                    rideAttendanceID = ride_attendance.id
                    listItem.classList.remove("non-user-ride")               
                    listItem.classList.add("user-ride")
                }
            })
            
            if(rideDate >= today) {
                UpcomingRidesElement.append(listItem)
                if(isUserRide == false) {
                    if(riderMotorcyleCount > 0) {
                        rideJoinElement = document.createElement('button')
                        rideJoinElement.innerText = "Join Ride"
                        rideJoinElement.setAttribute("onclick",`joinRide(this.parentElement)`)
                        listItem.appendChild(rideJoinElement)
                    }
                    else {
                        cantJoinElement = document.createElement('h3')
                        cantJoinElement.innerText = "You need a bike to join a ride!"
                        cantJoinElement.classList.add("warn-a")
                        listItem.appendChild(cantJoinElement)
                    }
                }
                else {
                    rideLeaveElement = document.createElement('button')
                    rideLeaveElement.innerText = "I Can't Come"
                    rideLeaveElement.setAttribute("onclick",`leaveRide(${rideAttendanceID})`)
                    rideLeaveElement.classList.add("warn-a")
                    listItem.appendChild(rideLeaveElement)
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
    LogoutElement.style.display = 'none'
    RidesSection.style.display = 'none'
    MotorcyclesSection.style.display = 'none'
}