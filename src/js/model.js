import {BASE_URL} from './config'

export const state = {
    ridesList: [],
    ride: {
    },
    routes: []
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
        console.log(response)
        if(!response.ok) throw new Error ('bad response')
        response = await response.json()
        console.log(response)
        state.routes = response
    } catch (err) {
        console.log(err)
    }
}

export async function uploadRide(data) {
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
    console.log(response)
    const ride = await response.json()
    console.log('ride', ride)
    data.id = ride.id
    state.ride = data

    state.ride = {
        title,
        description,
        date,
        startTime: ride.start_time,
        endTime: ride.end_time,
        organizer: {userId: ride.user_id, username: localStorage.getItem('username')}, //get this info from the api
        route: {id: ride.route_id}  //need rest of info from api
    }


               /*
            ride = Ride.create(
                title: params[:title],
                description: params[:description],
                date: params[:date],
                start_time: params[:start_time],
                end_time: params[:end_time],
                user_id: params[:user_id],
                route_id: params[:route_id]
           */
           
}