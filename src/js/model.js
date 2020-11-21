import {BASE_URL} from './config'

export const state = {
    user: {},
    ridesList: [],
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
        const rides = await response.json()
        this.state.ridesList = rides.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    } catch (error) {
        console.log(error)
        alert('Error getting rides')
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
                mapUrl: rideDetails.route.map_path,
                createdAt: rideDetails.route.created_at,
                updatedAt: rideDetails.route.updated_at
            }
        }
        console.log('STATE', this.state)


    } catch (error) {
        console.log(error)
        alert('Error fetching ride details')
    }

}

export async function validateLogin(loginData) {
    const {email, password} = loginData
    const loginUrl = `${BASE_URL}login`
    console.log(loginUrl, email, password)
    try {
        let response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        
        response = await response.json()
        if (response.token) {
            localStorage.setItem('token', response.token)
            localStorage.setItem('username', response.username)
            localStorage.setItem('userId', response.userId)
            location.reload()
        } else {
            console.log('login failed')
        }
    } catch (error) {
        console.log(error)
        alert('Error loggging in')
    }
}

export function addUserToState() {
    state.user = {
        id: +localStorage.getItem('userId'),
        username: localStorage.getItem('username')
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
        if(!response.ok) throw new Error ('bad response')
        response = await response.json()
        this.state.routes = response
    } catch (err) {
        console.log(err)
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
            user_id: +localStorage.getItem('userId'),
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
        if (!response.ok) throw new Error ('response not ok')
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

        state.ridesList.push({
                id: ride.id,
                title: ride.title,
                date: ride.date,
                user_id: organizer.id 
            })
        state.ridesList.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))

        return ride.id


    } catch (err) {
        console.log(err)
    }
}

export const validateSignUp = async function(signUpData) {
    try {
        console.log(signUpData)
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
        console.log('response', response)
        if (!response.ok) throw new Error('Failed to create user')
        const result = await response.json()
        console.log(result)

    } catch (err) {
        console.log(err)
    }
}

export const toggleRideAttendance = async function(userOnRide, userId) {
    try {
        if (userOnRide) {
            let rideAttendanceUser = state.ride.riders.find(rider => rider.id === parseInt(userId))
            console.log(rideAttendanceUser)
            let riderAttendanceId = rideAttendanceUser.ride_att_id
            const response = await fetch(`${BASE_URL}/ride_attendances/${riderAttendanceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!response.ok) throw new Error ('Something went wrong with deleting from server')
            const uid = +localStorage.getItem('userId')
            state.ride.riders = state.ride.riders.filter(rider => uid !== rider.id)
            console.log('riders', state.ride.riders)

            
        } else {
            const addResponse = await fetch(`${BASE_URL}/ride_attendances/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ride_id: state.ride.ride.id,
                    user_id: +localStorage.getItem('userId')
                })
            })
            const addResult = await addResponse.json()
            state.ride.riders.push({
                userId: +localStorage.getItem('userId'),
                username: localStorage.getItem('username'),
                ride_att_id: addResult.id
            })
        }

    } catch (err) {
        console.log(err)
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
        const index = state.ridesList.findIndex(ride => ride.id === rideId)
        state.ridesList.splice(index, 1)

    } catch (err) {
        console.log(err)
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
            user_id: +localStorage.getItem('userId'),
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
        if (!response.ok) throw new Error ('Something went wrong with the update')
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
        const index = state.ridesList.findIndex(searchResult => searchResult.id === ride.id)
        state.ridesList[index].title = ride.title
        state.ridesList[index].date = ride.date

    } catch (err) {
        console.log(err)
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
        const {user, motorcycles, ride_attendances} = await response.json()
        console.log(user, motorcycles, ride_attendances)
        state.selectedMemberProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            city: user.city,
            state: user.state,
            motorcycles,
            rideAttendances: ride_attendances
        }
        console.log(state.selectedMemberProfile)
    } catch (err) {
        console.log(err)
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

export const setActivePage = function(newPage) {
    state.activePage = newPage

}