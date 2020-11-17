import View from './View'
import {displayDate} from '../helpers'
import profileImage from 'url:../../assets/user.png'

class RideView extends View {

    _parentElement = document.querySelector('.selected-ride-section');
    _data;

    _generateMarkup() {
        console.log(this._data)
        const {organizer, ride, riders, route} = this._data
        return `
            <div class = "ride--header">
                <div>
                    <h1>${ride.title}</h1>
                    <p>${displayDate(ride.date)} ${ride.startTime} - ${ride.endTime}</p>
                    <p>Organizer: ${organizer.username}</p>
                </div>
                <div>
                    <button class = "join-ride-toggle-button">Join Ride</button>
                </div>
            </div>

            <p>${ride.description}</p>

            <h2>Route</h2>
            <p>Start: ${route.startLocation}</p>
            <p>End: ${route.endLocation}</p>
            <p>Route Description: ${route.description}</p>
            <p>${route.mapUrl}</p> 

            <h2 class="whos-going-title">${riders.length} Riders Going</h2>
            <ul class="whos-going">
                ${this._generateRidersMarkup()}
            </ul>

        `
    }

    _generateRidersMarkup() {
        return this._data.riders
            .map(rider => {
                return `
                    <li>
                        <img src = "${profileImage}" />
                        ${rider.username}
                    </li>
                `
            })
            .join('')
    }

    addHandlerRender(handler) {
        window.addEventListener('hashchange', handler)
        window.addEventListener('load', handler)
    }

    toggleRideAttendance(rideId) {
        if (userOnRide(userId)) {
            console.log('userid', userId)
            console.log(rideDetails.riders)
            let rideAttendanceUser = rideDetails.riders.find(rider => rider.id === parseInt(userId))
            console.log(rideAttendanceUser)
            let riderAttendanceId = rideAttendanceUser.ride_att_id
            fetch(`${BASE_URL}/ride_attendances/${riderAttendanceId}`, {
                method: 'DELETE',
                headers
            })
                .then(response => response.json)
                .then(response => console.log(response))
        } else {
            try {
                fetch(`${BASE_URL}/ride_attendances/`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ride_id: rideId, user_id: userId})
                })
                    .then(response => response.json())
                    .then(response => console.log(response))
            } catch (error) {
                console.log(error)
                alert('Unable to get riders')
            }
        }
    }
    
    userOnRide(id) {
        id = parseInt(id)
        return rideDetails.riders.find(rider => rider.id == id) ? true : false
    }

    // oldMarkup() {
    //     selectedRideElement.innerHTML = (`
    //             <div>
    //                 <h1>${rideDetails.ride.title}</h1>
    //                 <p>${moment(rideDetails.ride.date).format("MMM Do, YYYY")} ${rideDetails.ride.start_time} - ${rideDetails.ride.end_time}</p>
    //                 <p>Organizer: ${rideDetails.organizer.username}</p>
    //             </div>
    //         `)
    //         selectedRideDescriptionElement.innerHTML = (`
    //             <p>${rideDetails.ride.description}</p>
    //         `)
        
    //         selectedRouteDescriptionElement.innerHTML = (`
    //             <h2>Route</h2>
    //             <p>Start: ${rideDetails.route.start_location}</p>
    //             <p>End: ${rideDetails.route.end_location}</p>
    //             <p>Route Description: ${rideDetails.route.description}</p>
    //             <p>${rideDetails.route.map_path}</p>   
    //         `)
            
            
    //         whosGoingTitleElement.innerText = (`${rideDetails.riders.length} Riders Going`)
    //         whosGoingElement.innerHTML = ('')
    //         rideDetails.riders.map(rider => {
    //             let listItem = document.createElement('li')
    //             listItem.dataset.id = rider.id
    //             listItem.innerHTML = (`
    //                 <li>
    //                     <img src = './assets/user.png' />
    //                     ${rider.username}
    //                 </li>
    //             `)
    //             whosGoingElement.append(listItem)
    //         })
    
    //         let joinButton = document.createElement('button')
    //         joinButton.classList.add('join-ride-toggle-button')
    //         joinButton.setAttribute("onclick",`toggleRideAttendance(${rideId})`)
    //         selectedRideElement.appendChild(joinButton)
    //         joinButton.innerText = userOnRide(userId) ? "Leave Ride" : "Join Ride"
    // }

}

export default new RideView()


