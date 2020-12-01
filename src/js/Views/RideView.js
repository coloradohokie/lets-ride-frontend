import View from './View'
import {displayDate, userOnRide} from '../helpers'
import motoCoverImage from '../../assets/moto-cover.jpg'


class RideView extends View {

    _parentElement = document.querySelector('.selected-ride-section');
    _errorMessage = 'Cannot find this ride. Please select another one.'
    _data;


    _generateAdminButtons(organizerId, userId) {
        return organizerId === userId ?
            `                    
            <button class="update-ride-button admin-button">Update Ride</button>
            <button class="cancel-ride-button admin-button">Cancel Ride</button>
            ` : ''
    }

    _generateRoutes() {
        return this._data.routes
            .map(route => route.id === this._data.ride.route.id ?  
                `<option selected value=${route.id}>${route.name}</option>` :
                `<option value=${route.id}>${route.name}</option>`)
            .join('')
    }

    _noSelectedRideMarkup() {
        return `
        <div class="no-selected-ride">
            <h2>Let's Ride!</h2> 
            <p>Select a ride from the list to to the left to get started, 
            or organize your own ride!</p>
        </div>
        `
    }

    _generateMarkup() {
        const {organizer, ride, riders, route} = this._data.ride
        const editMode = this._data.mode === 'edit'
        const {userId} = this._data
        // if (editMode)
        if(!ride || !ride.id) return this._noSelectedRideMarkup()
        return `
            <div class="ride-cover-image">
                <figure class="ride__fig">
                    <img src="${motoCoverImage}" class="ride__img" />
                    <h1 class="ride__title">
                        <span>${ride.title}</span>
                    </h1>
                </figure>
            </div>
            <div class = "ride--header">
                <div>
                    <p>
                        ${editMode ? 
                            `
                            <input id="u-title" name="title" type="text" value="${ride.title}" />
                            <input id="u-date" name="date" type="date" value=${ride.date} /> 
                            <input id="u-start" name="start-time" type="time" value=${ride.startTime} /> - 
                            <input id="u-end" name="end-time" type="time" value=${ride.endTime} />
                            ` : ` 
                            ${displayDate(ride.date)} ${ride.startTime} - ${ride.endTime}
                            `
                        }
                    </p>
                    <p>Organizer: ${organizer.username}</p>
                </div>
                <div>
                ${editMode ? 
                    `
                    <button class="update-ride-submit-button">Update</button>
                    <button class="update-ride-cancel-button">Cancel</button> 
                    ` : `
                    ${this._generateAdminButtons(organizer.id, userId)}
                    <button class="join-ride-toggle-button"> 
                        ${userOnRide(userId, riders) ? 'Leave Ride' : 'Join Ride'}
                    </button>
                    `
                }
                </div>
            </div>

            <div class="ride--details">
                <p> ${editMode ? 
                        `<textarea id="u-description" name="description">${ride.description}</textarea>`
                        : ride.description
                    }
                </p>

                <h2>Route</h2>
                ${editMode ? 
                    `
                    <select id="u-route" name="route">${this._generateRoutes()}</select>
                    ` : `
                    <p>Start: ${route.startLocation}</p>
                    <p>End: ${route.endLocation}</p>
                    <p>Route Description: ${route.description}</p>
                    ${route.mapUrl ? `<div class="ride__route-map">${route.mapUrl}</div>` : ''}
                    `
                }
                

                <h2 class="whos-going-title">${riders.length} Riders Going</h2>
                <ul class="whos-going">
                    ${this._generateRidersMarkup()}
                </ul>
            </div>
        `
    }

    _generateRidersMarkup() {
        return this._data.ride.riders
            .map(rider => {
                return `
                    <li class="user-badge" data-id=${rider.id}>
                        <img src = "${this._displayAvatar(rider.avatar_url)}" />
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

    addHandlerCancelRide(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const cancelButton = e.target.closest('.cancel-ride-button')
            if(!cancelButton) return
            handler()
        })
    }

    addHandlerUpdateRide(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const updateButton = e.target.closest('.update-ride-button')
            if(!updateButton) return
            handler()
        })
    }

    addHandlerSubmitUpdatedRideInformation(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const submissionButton = e.target.closest('.update-ride-submit-button')
            if (!submissionButton) return
            handler()
        })
    }

    addHandlerCancelUpdatedRideInformation(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const cancelButton = e.target.closest('.update-ride-cancel-button')
            if (!cancelButton) return
            handler()
        })
    }

    addHandlerViewUserProfile(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const userBadge = e.target.closest('.user-badge')
            if (!userBadge) return
            handler(+userBadge.dataset.id)
        })
    }

}

export default new RideView()


