import View from './View'
import {displayDate, userOnRide} from '../helpers'
import profileImage from 'url:../../assets/user.png'

class RideView extends View {

    _parentElement = document.querySelector('.selected-ride-section');
    _data;

    _generateMarkup() {
        const {organizer, ride, riders, route} = this._data
        return `
            <div class = "ride--header">
                <div>
                    <h1>${ride.title}</h1>
                    <p>${displayDate(ride.date)} ${ride.startTime} - ${ride.endTime}</p>
                    <p>Organizer: ${organizer.username}</p>
                </div>
                <div>
                    <button class="join-ride-toggle-button"> 
                        ${userOnRide(+localStorage.getItem('userId'), riders) ? 'Leave Ride' : 'Join Ride'}
                    </button>
                </div>
            </div>

            <p>${ride.description}</p>

            <h2>Route</h2>
            <p>Start: ${route.startLocation}</p>
            <p>End: ${route.endLocation}</p>
            <p>Route Description: ${route.description}</p>
            ${route.mapUrl ? `<p>${route.mapUrl}</p>` : ''}
             

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

    addHandlerToggleRideAttendance(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const joinButton = e.target.closest('.join-ride-toggle-button')
            if(!joinButton) return
            handler()
        })
    }
}

export default new RideView()


