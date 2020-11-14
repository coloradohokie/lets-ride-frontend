import RideView from './Views/RideView'
import * as model from './model'
import SearchResultsView from './Views/SearchResultsView'
import NavBarView from './Views/WelcomeMessageView'
import LoginView from './Views/LoginView'
import WelcomeMessageView from './Views/WelcomeMessageView'

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

const controlLogin = async function(loginData) {
    try {
        LoginView.renderSpinner()
        await model.validateLogin(loginData)
        console.log('hit')
    } catch (err) {
        console.log(err)
    }
}

// const controlLogout = function() {
//     model.logout()
// }


const init = function() {
    if(!localStorage.getItem('token')) {
        LoginView.showLogin()
        LoginView.addHandlerLoginSubmit(controlLogin)
    } else {
        WelcomeMessageView.addHandlerRender(controlNavBar)
        // NavBarView.addHandlerLogOut(controlLogout)
        SearchResultsView.addHandlerRender(controlSearchResults)
        RideView.addHandlerRender(controlRide)
        
    }
}

init()