import RideView from './Views/RideView'
import * as model from './model'
import SearchResultsView from './Views/SearchResultsView'
import NavBarView from './Views/WelcomeMessageView'
import LoginView from './Views/LoginView'
import WelcomeMessageView from './Views/WelcomeMessageView'
import LogoutButtonView from './Views/LogoutButtonView'
import ProfileView from './Views/ProfileView'


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
    WelcomeMessageView.render(localStorage.getItem('username'))
}

const controlLogin = async function(loginData) {
    try {
        LoginView.renderSpinner()
        await model.validateLogin(loginData)
    } catch (err) {
        console.log(err)
    }
}

const controlLogout = function() {
    model.logout()
}

const controlProfileView = function() {
    console.log('controlprofileview')
    const section = document.querySelector('.profile')
    section.classList.remove('hidden')
    ProfileView.render(model.state)
}



const init = function() {
    if(!localStorage.getItem('token')) {
        LoginView.showLogin()
        LoginView.addHandlerLoginSubmit(controlLogin)
    } else {
        WelcomeMessageView.addHandlerRender(controlNavBar)
        LogoutButtonView.addHandlerLogout(controlLogout)
        SearchResultsView.addHandlerRender(controlSearchResults)
        RideView.addHandlerRender(controlRide)
        ProfileView.addHandlerRender(controlProfileView)
        
    }
}

init()