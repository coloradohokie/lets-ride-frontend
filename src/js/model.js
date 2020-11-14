import {BASE_URL} from './config'

export const state = {
    user: {
        // token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.byazftuF_KIoSs08Lxs3zMu3ueUSC3YiQUTqye3GPUM',
        token: '',
        username: 'Michael',
        id: 1
    },
    ridesList: [],
    ride: {

    }
}

export async function loadSearchResults() {
    try {
        const response = await fetch(`${BASE_URL}/rides`, {
            method: 'GET',
            headers: {
                'Content-Type': 'applicaton/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        const rides = await response.json()
        console.log('ridesList', rides)
        this.state.ridesList = rides
    } catch (error) {
        console.log(error)
        alert('Error getting rides')
    }
}

export async function loadRide(id) {
    try {
        const response = await fetch(`${BASE_URL}/rides/${id}`, {
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
            console.log('success', response.token)
            localStorage.setItem('token', response.token)
            localStorage.setItem('username', response.username)
            localStorage.setItem('userId', response.userId)
        } else {
            console.log('login failed')
        }
    } catch (error) {
        console.log(error)
        alert('Error loggging in')
    }
}

export function logOut() {
    console.log('logout')
    localStorage.clear()
    location.reload()
}