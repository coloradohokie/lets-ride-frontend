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
        RideView.renderSpinner()
        if (rideId) await model.loadRide(rideId)
        RideView.render({ride: model.state.ride, mode: 'view'})

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
        const selectElement = document.querySelector('#route')
        model.state.routes.map(route => {
                let option = document.createElement('option')
                option.setAttribute('value', route.id)
                option.innerText = route.name
                selectElement.appendChild(option)
            })
    } catch (err) {
        console.log(err)
    }
}

const controlUploadRide = async function(data) {
    try {
        await model.uploadRide(data)
    
        //navigate to new ride page
        SearchResultsView.render({ridesList: model.state.ridesList, currentRideId: model.state.ride.ride.id})
        RideView.render({ride: model.state.ride, mode: 'view'})
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
        RideView.render({ride: model.state.ride, mode: 'view'})
    } catch (err) {
        console.log(err)
    }
}

const controlCancelRide = async function() {
    try {
        RideView.renderSpinner()
        await model.cancelRide(model.state.ride.ride.id)
        window.location.hash = ''
        RideView.render({ride: model.state.ride, mode: 'view'})
        SearchResultsView.render({ridesList: model.state.ridesList, currentRideId: null})
    } catch (err) {
        console.log(err)
    }
}

const controlUpdateRide = async function() {
    try {
        //0. Load routes:
        await model.loadRoutes()

        //1. Render update page
        RideView.render({ride: model.state.ride, routes: model.state.routes, mode: 'edit'})

        //2. Listen for form submit
        RideView.addHandlerSubmitUpdatedRideInformation(async () => {
            const updatedRideInformation = {
                title: document.getElementById('u-title').value,
                date: document.getElementById('u-date').value,
                startTime: document.getElementById('u-start').value,
                endTime: document.getElementById('u-end').value,
                description: document.getElementById('u-description').value,
            }

            //send to server & update State
            try {
                await model.updateRide(updatedRideInformation)

            } catch (err) {
                console.log(err)
            }

            //re render the page
            RideView.render({ride: model.state.ride, mode: 'view'})
        })
        RideView.addHandlerCancelUpdatedRideInformation(
            () => RideView.render({ride: model.state.ride, mode: 'view'})
        )
    } catch (err) {
        console.log(err)
    }    
}

const controlProfileView = async function(profileId = model.state.user.id) {
    try {
        await model.loadUserInfo(profileId)
        const profileOwner = (profileId === model.state.user.id)
        ProfileView.render({user: model.state.selectedMemberProfile, mode: 'view', profileOwner})

    } catch (err) {
        console.log(err)
    }
}

const controlEditProfile = async function() {
    try {
        ProfileView.render({user: model.state.selectedMemberProfile, mode: 'edit'})
    } catch (err) {
        console.log(err)
    }
}

const controlCancelUpdatedProfile = function() {
    const profileOwner = true
    ProfileView.render({user: model.state.selectedMemberProfile, mode: 'view', profileOwner})
}

const controlSubmitUpdatedProfile = async function() {
    try {
        const updatedProfileInformation = {
            username: document.getElementById('p-username').value,
            email: document.getElementById('p-email').value,
            city: document.getElementById('p-city').value,
            state: document.getElementById('p-state').value,
        }
        console.log('updated profile', updatedProfileInformation)
        await model.updateUserInfo(model.state.user.id, updatedProfileInformation)
        const profileOwner = true
        ProfileView.render({user: model.state.selectedMemberProfile, mode: 'view', profileOwner})
    } catch (error) {
        console.error(error)
    }

}


const init = function() {
    if(!localStorage.getItem('token')) {
        LoginView.showLogin()
        LoginView.addHandlerFormSubmit(controlLogin)
        LoginView.addHandlerToggleScreen()
        LoginView.addHandlerFormSubmit(controlSignUp)
    } else {
        model.addUserToState()
        WelcomeMessageView.addHandlerRender(controlNavBar)
        LogoutButtonView.addHandlerLogout(controlLogout)
        RideView.addHandlerRender(controlRide)
        RideView.addHandlerToggleRideAttendance(controlToggleRideAttendance)
        RideView.addHandlerCancelRide(controlCancelRide)
        RideView.addHandlerUpdateRide(controlUpdateRide)
        SearchResultsView.addHandlerRender(controlSearchResults)
        SearchResultsView.addHandlerSelectedRide()
        NavBarView.addHandlerTogglePage()
        OrganizeRide.addHandlerRender(controlOrganizeRide)
        OrganizeRide.addHandlerSubmitForm(controlUploadRide)
        ProfileView.addHandlerRender(controlProfileView)
        ProfileView.addHandlerEditProfile(controlEditProfile)
        ProfileView.addHandlerCancelUpdatedProfile(controlCancelUpdatedProfile)
        ProfileView.addHandlerSubmitUpdatedProfile(controlSubmitUpdatedProfile)
    }
}

init()