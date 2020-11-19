import RideView from './Views/RideView'
import * as model from './model'
import SearchResultsView from './Views/SearchResultsView'
import NavBarView from './Views/NavBarView'
import LoginView from './Views/LoginView'
import WelcomeMessageView from './Views/WelcomeMessageView'
import LogoutButtonView from './Views/LogoutButtonView'
import ProfileView from './Views/ProfileView'
import OrganizeRide from './Views/OrganizeRide'
import {userOnRide} from './helpers'


const controlRide = async function() {
    try {
        let rideId = +window.location.hash.slice(1)
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
        let rideId = +window.location.hash.slice(1)
        SearchResultsView.renderSpinner()
        await model.loadSearchResults()
        SearchResultsView.render({ridesList: model.state.ridesList, currentRideId: rideId})
    } catch (err) {
        console.log('controlSearchResults', err)
    }
}

const controlNavBar = function() {
    WelcomeMessageView.render(localStorage.getItem('username'))
}

const controlLogin = async function(loginData) {
    console.log('Log In')
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

const controlOrganizeRide = async function() {
    try {
        //load the routes
        await model.loadRoutes()
        //load the organize ride form
        // OrganizeRide.render(model.state.routes)

        const selectElement = document.querySelector('#route')
        model.state.routes.map(route => {
                let option = document.createElement('option')
                option.setAttribute('value', route.id)
                option.innerText = route.name
                selectElement.appendChild(option)
            })
        

        //save data to database
        
    


    } catch (err) {
        console.log(err)
    }
}

const controlUploadRide = async function(data) {
    try {
        await model.uploadRide(data)
    
        //navigate to new ride page
        SearchResultsView.render(model.state.ridesList)
        RideView.render(model.state.ride)
        window.history.pushState(null, '', `#${model.state.ride.ride.id}`)
        NavBarView.navigateToPage('rides')

    } catch (err) {
        console.log(err)
    }
}

const controlSignUp = async function(signUpData) {
    console.log('Signup!')
    try {
        LoginView.renderSpinner()
        await model.validateSignUp(signUpData)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}

const controlToggleRideAttendance = async function() {
    try {
        const userId = +localStorage.getItem('userId')
        await model.toggleRideAttendance(userOnRide(userId, model.state.ride.riders), userId)
        RideView.render(model.state.ride)
    } catch (err) {
        console.log(err)
    }
}


const init = function() {
    if(!localStorage.getItem('token')) {
        LoginView.showLogin()
        LoginView.addHandlerFormSubmit(controlLogin)
        LoginView.addHandlerToggleScreen()
        LoginView.addHandlerFormSubmit(controlSignUp)
    } else {
        WelcomeMessageView.addHandlerRender(controlNavBar)
        LogoutButtonView.addHandlerLogout(controlLogout)
        RideView.addHandlerRender(controlRide)
        RideView.addHandlerToggleRideAttendance(controlToggleRideAttendance)
        SearchResultsView.addHandlerRender(controlSearchResults)
        SearchResultsView.addHandlerSelectedRide()
        NavBarView.addHandlerTogglePage()
        OrganizeRide.addHandlerRender(controlOrganizeRide)
        OrganizeRide.addHandlerSubmitForm(controlUploadRide)


        
    }
}

init()