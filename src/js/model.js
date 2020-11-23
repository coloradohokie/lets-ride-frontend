import {BASE_URL, MEDIA_URL, RESULTS_PER_PAGE} from './config'
import {userOnRide} from './helpers'

export const state = {
    user: {},
    ridesList: {
        list: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1
    },
    ride: {
        ride: {},
        route: {},
        organizer: {},
        riders: []
    },
    routes: [],
    selectedMemberProfile: {},
    activePage: 'rides'
}

export async function loadSearchResults() {
    try {
        const response = await fetch(`${BASE_URL}rides`, {
            method: 'GET',
            headers: {
                'Content-Type': 'applicaton/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error('invalid response from server')
        const rides = await response.json()
        this.state.ridesList.list = rides.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    } catch (error) {
        throw new Error (error)
    }
}

export async function loadRide(id) {
    try {
        const response = await fetch(`${BASE_URL}rides/${id}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error ('invalid response from server')
        const rideDetails = await response.json()
        this.state.ride = {
            organizer: rideDetails.organizer,
            ride: {
                id: rideDetails.ride.id,
                title: rideDetails.ride.title,
                description: rideDetails.ride.description,
                date: rideDetails.ride.date,
                startTime: rideDetails.ride.start_time,
                endTime: rideDetails.ride.end_time,
                routeId: rideDetails.ride.route_id,
                userId: rideDetails.ride.user_id,
                createdAt: rideDetails.ride.created_at,
                updatedAt: rideDetails.ride.updated_at
            },
            riders: rideDetails.riders,
            route: {
                id: rideDetails.route.id,
                name: rideDetails.route.name,
                description: rideDetails.route.description,
                startLocation: rideDetails.route.start_location,
                endLocation: rideDetails.route.end_location,
                mapUrl: rideDetails.route.map_url,
                createdAt: rideDetails.route.created_at,
                updatedAt: rideDetails.route.updated_at
            }
        }
        // console.log('STATE', this.state)
    } catch (error) {
        throw new Error(error)
    }

}

export async function validateLogin(loginData) {
    const {email, password} = loginData
    const loginUrl = `${BASE_URL}login`
    try {
        let response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        if (!response.ok) throw new Error ('invalid response from server')
        const result = await response.json()
        if (!result.token) throw new Error ('Login failed. Check the email and password and try again.')
        localStorage.setItem('token', result.token)
        localStorage.setItem('username', result.username)
        localStorage.setItem('userId', result.userId)
        localStorage.setItem('avatar_url', result.avatar_url)
        location.reload()
    } catch (error) {
        throw new Error (error)
    }
}

export function addUserToState() {
    state.user = {
        id: +localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        avatar_url: localStorage.getItem('avatar_url')
    }
}

export function logout() {
    localStorage.clear()
    location.reload()
}

export async function loadRoutes() {
    try {
        let response = await fetch(`${BASE_URL}routes`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        if(!response.ok) throw new Error ('invalid response from server')
        response = await response.json()
        this.state.routes = response
    } catch (error) {
        throw new Error (error)
    }
}

export async function uploadRide(data) {
    try {
        const newRide = {
            title: data.title,
            description: data.description,
            date: data.date,
            start_time: data.start,
            end_time: data.end,
            user_id: state.user.id,
            route_id: +data.route
        }
    
        let response = await fetch(`${BASE_URL}rides`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newRide)
        })
        if (!response.ok) throw new Error ('Invalid response from server. Data likely was not uploaded.')
        response = await response.json()
        const {ride, organizer, route} = response
    
        state.ride = {
            ride: {
                id: ride.id,
                title: ride.title,
                description: ride.description,
                date: ride.date,
                startTime: ride.start_time,
                endTime: ride.end_time,
                createdAt: ride.created_at,
                updatedAt: ride.updated_at
            },
            organizer,
            route: {
                id: route.id,
                name: route.name,
                description: route.description,
                startLocation: route.startLocation,
                endLocation: route.end_location,
                mapUrl: route.map_path,
                createdAt: route.created_at,
                updatedAt: route.updated_at                
            },
            riders:[]
        }

        state.ridesList.list.push({
                id: ride.id,
                title: ride.title,
                date: ride.date,
                user_id: organizer.id 
            })
        state.ridesList.list.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        return ride.id
    } catch (error) {
        throw new Error (error)
    }
}

export const validateSignUp = async function(signUpData) {
    try {
        const {email, username, password, city, state} = signUpData
        const response = await fetch(`${BASE_URL}users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                username,
                password,
                city,
                state
            })
        })
        if (!response.ok) throw new Error('Failed to create user')
        const result = await response.json()
    } catch (error) {
        throw new Error (error)
    }
}

export const toggleRideAttendance = async function() {
    const userId = state.user.id
    try {
        if (userOnRide(userId, state.ride.riders)) {
            let rideAttendanceUser = state.ride.riders.find(rider => rider.id === parseInt(userId))
            let riderAttendanceId = rideAttendanceUser.ride_att_id
            const response = await fetch(`${BASE_URL}ride_attendances/${riderAttendanceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) throw new Error ('Something went wrong with deleting you from the ride. Refresh the page and try again.')
            state.ride.riders = state.ride.riders.filter(rider => userId !== rider.id)
        } else {
            const addResponse = await fetch(`${BASE_URL}ride_attendances/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ride_id: state.ride.ride.id,
                    user_id: userId
                })
            })
            if(!addResponse.ok) throw new Error('Something went wrong with adding you to the ride. Refresh the page and try again.')
            const addResult = await addResponse.json()
            state.ride.riders.push({
                userId: userId,
                username: state.user.username,
                avatar_url: state.user.avatar_url,
                ride_att_id: addResult.id
            })
        }
    } catch (error) {
        throw new Error (error)
    }
}

export const cancelRide = async function(rideId) {
    try {
        const response = await fetch(`${BASE_URL}rides/${rideId}`, {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error ('Something went wrong with deleting from server')
        state.ride = {}
        const index = state.ridesList.list.findIndex(ride => ride.id === rideId)
        state.ridesList.list.splice(index, 1)

    } catch (error) {
        throw new Error (error)
    }
} 

export const updateRide = async function(updatedRideInformation) {
    try {
        const newRide = {
            title: updatedRideInformation.title,
            description: updatedRideInformation.description,
            date: updatedRideInformation.date,
            start_time: updatedRideInformation.startTime,
            end_time: updatedRideInformation.endTime,
            user_id: state.user.id,
            route_id: state.ride.route.id
        }
        //update server information
        const response = await fetch(`${BASE_URL}rides/${state.ride.ride.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newRide)
        })
        if (!response.ok) throw new Error ('Something went wrong with the update. The system did not understand the server response.')
        const result = await response.json()

        //update state.ride
        const {ride, route} = result
        state.ride.ride = {
            id: ride.id,
            title: ride.title,
            description: ride.description,
            date: ride.date,
            startTime: ride.start_time,
            endTime: ride.end_time,
            createdAt: ride.created_at,
            updatedAt: ride.updated_at
        }
        state.ride.route = {
            id: route.id,
            name: route.name,
            description: route.description,
            startLocation: route.start_location,
            endLocation: route.end_location,
            mapUrl: route.map_path,
            createdAt: route.created_at,
            updatedAt: route.updated_at                
        }

        //update search results
        const index = state.ridesList.list.findIndex(searchResult => searchResult.id === ride.id)
        state.ridesList.list[index].title = ride.title
        state.ridesList.list[index].date = ride.date

    } catch (error) {
        throw new Error (error)
    }
}

export const loadUserInfo = async function(id) {
    try {
        const response = await fetch(`${BASE_URL}users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error('Could not get user info')
        const result = await response.json()
        const {user, motorcycles, ride_attendances} = result
        state.selectedMemberProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            city: user.city,
            state: user.state,
            motorcycles,
            rideAttendances: ride_attendances,
            avatarUrl: user.avatar_url
        }
        console.log(state.selectedMemberProfile)
    } catch (error) {
        throw new Error(error)
    }
}

export const updateUserInfo = async function(id, updatedInfo) {
    try {
        const response = await fetch(`${BASE_URL}users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedInfo)
        })
        if (!response.ok) throw new Error ('Failed to update user')
        const result = await response.json()
        //update state
        state.selectedMemberProfile.username = updatedInfo.username
        state.selectedMemberProfile.email = updatedInfo.email
        state.selectedMemberProfile.city = updatedInfo.city
        state.selectedMemberProfile.state = updatedInfo.state
        localStorage.setItem('username', updatedInfo.username)
        addUserToState()
    } catch (error) {
        console.error(error)
    }
}

export const updateAvatar = async function(id, uploadInfo) {
    try {
        const response = await fetch (`${MEDIA_URL}`, {
            method: 'POST',
            body: uploadInfo
        })
        if (!response.ok) throw new Error ('Invalid response from server. Something blew up.')
        const result = await response.json()
        this.state.user.avatarUrl = result.url
        this.state.selectedMemberProfile.avatarUrl = result.url
        const newAvatarUrl = {avatar_url : result.url}
        const serverResponse = await fetch(`${BASE_URL}users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newAvatarUrl)
        })
        const serverResult = await serverResponse.json()
    } catch (error) {
        throw new Error (error)
    }
}

// export const setActivePage = function(newPage) {
//     state.activePage = newPage

// }

export const getSearchResultsPage = function(page = state.ridesList.page) {
    state.ridesList.page = page
    const start = (page -1) * state.ridesList.resultsPerPage
    const end = page * state.ridesList.resultsPerPage 
    const upcomingRides = state.ridesList.list.filter(ride => Date.parse(ride.date) > Date.now())
    return upcomingRides.slice(start, end)
}

export const getNumSearchResults = function() {
    return state.ridesList.list.filter(ride => Date.parse(ride.date) > Date.now()).length

}