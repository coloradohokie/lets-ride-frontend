function displayDate(date) {
    return moment(date).format('MMMM Do, YYYY')
}

function showElement (elementID) {
    const targetElement = document.getElementById(elementID)
    targetElement.style.display = "block"
}

function hideElement (elementID) {
    const targetElement = document.getElementById(elementID)
    targetElement.style.display = "none"
}

export const nav = `
    <nav>
        <div>
            <h1 id="welcome-message">Welcome, Friend! Let's Ride!</h1>
            1990 Kawasaki Vulcan 750
        </div>
        <a href="index.html">Rides</a>
        <a href="organize-ride.html">Organize Group Ride</a>
        <a href="solo-ride.html">Solo Ride</a>
        <a href="profile.html">My Profile</a>
        <button class="logout-button" onclick="logout()">Logout</button>
    </nav>
`



