import {BASE_URL} from './config'

export const state = {
    user: {
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.byazftuF_KIoSs08Lxs3zMu3ueUSC3YiQUTqye3GPUM',
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
                'Authorization': `Bearer ${state.user.token}`
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
                'Authorization' : `Bearer ${state.user.token}`
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