const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
const userId = localStorage.getItem('userId')
const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com`




function removeMotorcycle (motorcycle_id) {
    try {
        fetch(`${BASEURL}/motorcycles/${motorcycle_id}` ,{method: "DELETE"})
            .then(response => {
                response.json()
                window.location.href = 'http://localhost:3001/index.html#motorcycles-section'
                window.location.reload(true);
            })
    } catch (error) {
        console.log(error)
        alert('Error deleting motorcycle')
    }
}


function displayHeader () {
    const nav = `
        <nav>
            <div>
                <h1 id="welcome-message">Welcome, Friend-o! Let's Ride!</h1>
                1990 Kawasaki Vulcan 750
            </div>
            <a href="index.html">Rides</a>
            <a href="organize-ride.html">Organize Group Ride</a>
            <a href="solo-ride.html">Solo Ride</a>
            <a href="profile.html">My Profile</a>
            <button class="logout-button" onclick="logout()">Logout</button>
        </nav>
    `
    let pageHeader = document.querySelector('.page-header')
    pageHeader.innerHTML = nav
}

function displayUser(userInfo) {
    const profileContainer = document.querySelector('.profile-container')
    profileContainer.innerHTML = (`
        <div class="profile-picture">
            <img src = "./assets/user.png" />
        </div>
        <div>
            <table>
                <tr>
                    <td>
                        Username: 
                    </td>
                    <td>
                        ${userInfo.username}
                    </td>
                </tr>

                <tr>
                    <td>
                        Email: 
                    </td>
                    <td>
                        ${userInfo.email}
                    </td>
                </tr>

                <tr>
                    <td>
                        City: 
                    </td>
                    <td>
                        ${userInfo.city}
                    </td>
                </tr>

                <tr>
                    <td>
                        State: 
                    </td>
                    <td>
                        ${userInfo.state}
                    </td>
                </tr>


            </table>
        </div>
    `)
}

function displayGarage(motorcycles) {
    const list = document.querySelector('.motorcycles')

    motorcycles.map( cycle => {
        imageURL = (cycle.image_path) ? cycle.image_path : '../assets/moto.png'
        let listItem = document.createElement('li')
        listItem.innerHTML = 
            `
                <li>
                    <img src="${imageURL}" />
                    ${cycle.year} ${cycle.make} ${cycle.model}
                </li>
            `
        list.prepend(listItem)
    })
}

try {
    fetch(`${BASEURL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then (response => response.json())
        .then(userInfo => {
            console.log(userInfo)
            displayHeader()
            displayUser(userInfo)
            displayGarage(userInfo.motorcycles)
        })
} catch (error) {
    console.log(error)
    alert('Error loading profile: database unavailable')
}




