import RideView from './Views/RideView'
import * as model from './model'
import SearchResultsView from './Views/SearchResultsView'
import NavBarView from './Views/NavBarView'

// const token = localStorage.getItem('token')
// const username = localStorage.getItem('username')
// const userId = localStorage.getItem('userId')

function logout () {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    location.reload()
}

const controlRide = async function() {
    try {
        let rideId = window.location.hash.slice(1)
        if (!rideId) rideId = 1
        RideView.renderSpinner()
        await model.loadRide(rideId)
        RideView.render(model.state.ride)

    } catch (err) {
        console.log('controlRide', err)
    }
}

const controlSearchResults = async function() {
    try {
        SearchResultsView.renderSpinner()
        await model.loadSearchResults()
        SearchResultsView.render(model.state.ridesList)
    } catch (err) {
        console.log('controlSearchResults', err)
    }
}

const controlNavBar = function() {
    console.log(model.state.user)
    NavBarView.render(model.state.user)
}




// if(!token) {
//     window.location.href = 'login.html'
//     const displayWindow = document.querySelector('.rides')
//     displayWindow.style.display = 'none'
// } else {
//     displayWelcomeMessage()
//     fetchRides()
//     displayRideDetails()
// }

const init = function() {
    NavBarView.addHandlerRender(controlNavBar)
    SearchResultsView.addHandlerRender(controlSearchResults)
    RideView.addHandlerRender(controlRide)
}

init()