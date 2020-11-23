import RideView from './Views/RideView'
import * as model from './model'
import SearchResultsView from './Views/SearchResultsView'
import NavBarView from './Views/NavBarView'
import LoginView from './Views/LoginView'
import WelcomeMessageView from './Views/WelcomeMessageView'
import LogoutButtonView from './Views/LogoutButtonView'
import ProfileView from './Views/ProfileView'
import OrganizeRide from './Views/OrganizeRide'


const controlRide = async function() {
    try {
        let rideId = +window.location.hash.slice(1)
        RideView.renderSpinner()
        if (rideId) await model.loadRide(rideId)
        RideView.render({ride: model.state.ride, mode: 'view'})

    } catch (error) {
        console.error(error)
        RideView.renderError()
    }
}

const controlSearchResults = async function() {
    try {
        let rideId = +window.location.hash.slice(1)
        SearchResultsView.renderSpinner()
        await model.loadSearchResults()
        SearchResultsView.render({ridesList: model.state.ridesList, currentRideId: rideId})
    } catch (error) {
        console.error(error)
        SearchResultsView.renderError()
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
    } catch (error) {
        console.error(error)
        LoginView.renderError()
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
    } catch (error) {
        console.error(error)
        OrganizeRide.renderError()
    }
}

const controlUploadRide = async function(data) {
    try {
        OrganizeRide.renderSpinner()
        await model.uploadRide(data)
    
        //navigate to new ride page
        SearchResultsView.render({ridesList: model.state.ridesList, currentRideId: model.state.ride.ride.id})
        RideView.render({ride: model.state.ride, mode: 'view'})
        window.history.pushState(null, '', `#${model.state.ride.ride.id}`)
        NavBarView.navigateToPage('rides')

    } catch (error) {
        console.error(error)
        OrganizeRide('There was a problem uploading the ride to the server. Please try again.')
    }
}

const controlSignUp = async function(signUpData) {
    try {
        LoginView.renderSpinner()
        await model.validateSignUp(signUpData)
        location.reload()
    } catch (error) {
        console.error(error)
        LoginView.renderError('There was a problem processing your information. Please try again.')
    }
}

const controlToggleRideAttendance = async function() {
    try {
        RideView.renderSpinner()
        await model.toggleRideAttendance()
        RideView.render({ride: model.state.ride, mode: 'view'})
    } catch (error) {
        console.error(error)
        RideView.renderError(error)
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
        console.error(error)
        RideView.renderError('Unable to cancel the ride at this time. Please try again.')
    }
}

const controlUpdateRide = async function() {
    try {
        //0. Load routes:
        RideView.renderSpinner()
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
                RideView.renderSpinner()
                await model.updateRide(updatedRideInformation)

            } catch (error) {
                console.error(error)
                RideView.renderError('The system was unable to update the ride. Please check the information and try again.')
            }

            //re render the page
            RideView.render({ride: model.state.ride, mode: 'view'})
        })
        RideView.addHandlerCancelUpdatedRideInformation(
            () => RideView.render({ride: model.state.ride, mode: 'view'})
        )
    } catch (error) {
        console.error(error)
        RideView.renderError('Unable to get the routes at this time. Please try again later.')
    }    
}

const controlProfileView = async function(profileId = model.state.user.id) {
    try {
        ProfileView.renderSpinner()
        await model.loadUserInfo(profileId)
        const profileOwner = (profileId === model.state.user.id)
        ProfileView.render({user: model.state.selectedMemberProfile, mode: 'view', profileOwner})

    } catch (error) {
        console.error(error)
        ProfileView.renderError()
    }
}

const controlViewUserProfile = async function(profileId = model.state.user.id) {
    console.log(profileId)
    try {
        ProfileView.renderSpinner()
        await model.loadUserInfo(profileId)
        const profileOwner = (profileId === model.state.user.id)
        NavBarView.navigateToPage('profile')
        ProfileView.render({user: model.state.selectedMemberProfile, mode: 'view', profileOwner})

    } catch (error) {
        console.error(error)
        ProfileView.renderError()
    }
}

const controlEditProfile = function() {
    ProfileView.render({user: model.state.selectedMemberProfile, mode: 'edit'})
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
        ProfileView.renderSpinner()
        await model.updateUserInfo(model.state.user.id, updatedProfileInformation)
        const profileOwner = true
        ProfileView.render({user: model.state.selectedMemberProfile, mode: 'view', profileOwner})
    } catch (error) {
        console.error(error)
        ProfileView.renderError('Something went wrong uploading the profile. Refresh the page and try again.')
    }

}

const controlChangeAvatar = async function(uploadInfo) {
    try {
        ProfileView.renderSpinner()
        await model.updateAvatar(model.state.user.id, uploadInfo)
        const profileOwner = true
        ProfileView.render({
            user: model.state.selectedMemberProfile, 
            mode: 'view', 
            profileOwner
        })
    } catch (error) {
        console.error(error)
        ProfileView.renderError('There was a problem updating the Avatar.')
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
        RideView.addHandlerViewUserProfile(controlViewUserProfile)
        SearchResultsView.addHandlerRender(controlSearchResults)
        SearchResultsView.addHandlerSelectedRide()
        NavBarView.addHandlerTogglePage()

        OrganizeRide.addHandlerRender(controlOrganizeRide)
        OrganizeRide.addHandlerSubmitForm(controlUploadRide)

        ProfileView.addHandlerRender(controlProfileView)
        ProfileView.addHandlerEditProfile(controlEditProfile)
        ProfileView.addHandlerCancelUpdatedProfile(controlCancelUpdatedProfile)
        ProfileView.addHandlerSubmitUpdatedProfile(controlSubmitUpdatedProfile)
        ProfileView.addHandlerDisplayChangeAvatar()
        ProfileView.addHandlerChangeAvatar(controlChangeAvatar)
    }
}

init()