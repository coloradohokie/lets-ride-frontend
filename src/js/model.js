import {BASE_URL, MEDIA_URL, RESULTS_PER_PAGE} from './config'
import {userOnRide, AJAX} from './helpers'
import regeneratorRuntime from "regenerator-runtime";

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
        const result = await AJAX(`${BASE_URL}rides`)
        this.state.ridesList.list = result
            .map(ride => { return {
                id: ride.id,
                title: ride.title,
                date: ride.date,
                organizerId: ride.user_id
            }})
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    } catch (error) {
        throw error
    }
}

export async function loadRide(id) {
    try {
        const rideDetails = await AJAX(`${BASE_URL}rides/${id}`)
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
        throw error
    }

}

export async function validateLogin(loginData) {
    try {
        const result = await AJAX(`${BASE_URL}login`, 'POST', loginData, false)
        if (!result.token) throw new Error ('Login failed. Check the email and password and try again.')
        localStorage.setItem('token', result.token)
        localStorage.setItem('username', result.username)
        localStorage.setItem('userId', result.userId)
        localStorage.setItem('avatar_url', result.avatar_url)
        location.reload()
    } catch (error) {
        throw error
    }
}

export function addUserToState() {
    state.user = {
        id: +localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        avatar_url: localStorage.getItem('avatar_url')
    }
    // console.log(state.user)
}

export function logout() {
    localStorage.clear()
    location.reload()
}

export async function loadRoutes() {
    try {
        this.state.routes = await AJAX(`${BASE_URL}routes`)
    } catch (error) {
        throw error
    }
}

export async function uploadRoute(data) {
    try {
        const newRoute = {
            route_name: data.rTitle,
            description: data.rDescription,
            start_location: data.rStart,
            end_location: data.rEnd,
            map_url: data.rLink,
            difficulty: data.rDifficulty,
            miles: data.rMiles,
            minutes: data.rMinutes,
            created_by: state.user.id
        }

        return await AJAX(`${BASE_URL}routes`, 'POST', newRoute)
        
    } catch (error) {
        throw error
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

        const result = await AJAX(`${BASE_URL}rides`, 'POST', newRide)
        const {ride, organizer, route} = result
    
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
                startLocation: route.start_location,
                endLocation: route.end_location,
                mapUrl: route.map_url,
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
        throw error
    }
}

export const validateSignUp = async function(signUpData) {
    try {
        await AJAX(`${BASE_URL}users`, 'POST', signUpData, false)
    } catch (error) {
        throw error
    }
}

export const toggleRideAttendance = async function() {
    const userId = state.user.id
    try {
        if (userOnRide(userId, state.ride.riders)) {
            let rideAttendanceUser = state.ride.riders.find(rider => rider.id === parseInt(userId))
            let riderAttendanceId = rideAttendanceUser.ride_att_id
            await AJAX(`${BASE_URL}ride_attendances/${riderAttendanceId}`, 'DELETE')
            state.ride.riders = state.ride.riders.filter(rider => userId !== rider.id)
        } else {
            const uploadData = {
                ride_id: state.ride.ride.id,
                user_id: userId             
            }
            const addResult = await AJAX(`${BASE_URL}ride_attendances/`, 'POST', uploadData)
            state.ride.riders.push({
                userId: userId,
                username: state.user.username,
                avatar_url: state.user.avatar_url,
                ride_att_id: addResult.id
            })
        }
    } catch (error) {
        throw error
    }
}

export const cancelRide = async function(rideId) {
    try {
        const response = await AJAX(`${BASE_URL}rides/${rideId}`, 'DELETE')
        state.ride = {}
        const index = state.ridesList.list.findIndex(ride => ride.id === rideId)
        state.ridesList.list.splice(index, 1)

    } catch (error) {
        throw error
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
        const result = await AJAX(`${BASE_URL}rides/${state.ride.ride.id}`, 'PATCH', newRide)

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
        throw error
    }
}

export const loadUserInfo = async function(id) {
    try {
        const result = await AJAX(`${BASE_URL}users/${id}`)
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
    } catch (error) {
        throw error
    }
}

export const updateUserInfo = async function(id, updatedInfo) {
    try {
        await AJAX(`${BASE_URL}users/${id}`, 'PATCH', updatedInfo)
        
        //update state
        state.selectedMemberProfile.username = updatedInfo.username
        state.selectedMemberProfile.email = updatedInfo.email
        state.selectedMemberProfile.city = updatedInfo.city
        state.selectedMemberProfile.state = updatedInfo.state
        localStorage.setItem('username', updatedInfo.username)
        addUserToState()
    } catch (error) {
        throw error
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
        localStorage.setItem('avatar_url', result.url)
        const newAvatarUrl = {avatar_url : result.url}
        await AJAX(`${BASE_URL}users/${id}`, 'PATCH', newAvatarUrl)
    } catch (error) {
        throw error
    }
}

export const setActivePage = function(newPage) {
    state.activePage = newPage

}

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