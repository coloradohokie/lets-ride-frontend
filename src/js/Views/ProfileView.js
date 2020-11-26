import View from './View'
import imgPlus from '../../assets/plus.png'
import motoImage from '../../assets/moto.png'
import rideImage from '../../assets/moto-ride.jpg'
import {displayDate} from '../helpers'

class ProfileView extends View {
    _parentElement = document.querySelector('.profile')
    _errorMessage = 'Unable to load this profile.'
    _navBar = document.querySelector('.nav')

    addHandlerRender(handler) {
        this._navBar.addEventListener('click', function(e) {
            const button = e.target.closest('.nav-link')
            if(!button) return
            if(!button.dataset.page === 'profile') return
            handler()
        })
    }

    addHandlerEditProfile(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const editButton = e.target.closest('.edit-profile-button')
            if(!editButton) return
            handler()
        })
    }

    addHandlerCancelUpdatedProfile(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const cancelButton = e.target.closest('.cancel-updated-profile')
            if(!cancelButton) return
            handler()
        })
    }

    addHandlerSubmitUpdatedProfile(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const submitButton = e.target.closest('.submit-updated-profile')
            if(!submitButton) return
            handler()
        })
    }

    addHandlerDisplayChangeAvatar() {
        this._parentElement.addEventListener('click', function(e) {
            const button = e.target.closest('.change-avatar-button')
            if(!button) return
            const form = document.querySelector('.change-avatar-form')
            form.classList.toggle('hidden')
        })
    }


    addHandlerChangeAvatar(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const form = e.target.closest('.change-avatar-form')
            if(!form) return
            form.addEventListener('submit', function(e) {
                e.preventDefault()
                const data = new FormData(this)
                console.log(this)
                console.log (data)
                handler(data)
            })
            form.addEventListener('reset', function(e) {
                e.preventDefault()
                form.classList.add('hidden')
            })
        })
    }

    _generateMotorcycleMarkup() {
        return this._data.user.motorcycles
        .map(bike => {
            return `
            <li class="motorcycle-card">
                <img src="${bike.image_path ? bike.image_path : motoImage}" />
                <p>${bike.year} ${bike.make} ${bike.model}</p>
            </li>
            `
        })
        .join('')
    }

    _generateRideAttendancesMarkup(section) {
        return this._data.user.rideAttendances
        .filter(attendedRide => 
            section === 'upcoming' ? 
                Date.parse(attendedRide.date) >= Date.now(): 
                Date.parse(attendedRide.date) < Date.now())
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .map(attendedRide => {
            return `
                <li class="ride-attendance-card">
                    <p>${displayDate(attendedRide.date)}</p>
                    <img src="${rideImage}" />
                    <p>${attendedRide.title}</p>
                </li>
            `
        })
        .join('')
    }

    _generateMarkup() {
        const {username, city, state, email, avatarUrl} = this._data.user
        const editMode = this._data.mode === 'edit'
        const {profileOwner} = this._data
        return `
        <h2>${profileOwner ? 'My Profile' : username}</h2>
        <div class="profile-container">
            <div>
                <img class="profile-picture" src="${this._displayAvatar(avatarUrl)}" alt="Profile Picture" />
                <p><a class="change-avatar-button">Change</a>
                <form class="change-avatar-form hidden">
                    <input id="p-avatar" name="file" type="file" accept="image/png, image/jpeg" />
                    <input class="action-button" type="submit" value="Change Avatar" />
                    <input class="action-button" type="reset" value="Cancel" />
                </form>
            </div>
            <div>
                <table>
                ${editMode ? `
                    <tr>
                        <td class="field-label">User name:</td>
                        <td class="field-value">
                            <input id="p-username" name="p-username" type="text" value="${username}" />
                        </td>
                    </tr>
                    <tr>
                        <td class="field-label">Email: </td>
                        <td class="field-value">
                            <input id="p-email" name="p-email" type="text" value="${email}" />
                        </td>
                    </tr>
                    <tr>
                        <td class="field-label">City: </td>
                        <td class="field-value">
                            <input id="p-city" name="p-city" type="text" value="${city}" />
                        </td>
                    </tr>
                    <tr>
                        <td class="field-label">State:</td>
                        <td class="field-value">
                            <input id="p-state" name="p-state" type="text" value="${state}" />
                        </td>
                    </tr>
                    <tr>
                        <td class="button-row" colspan="2">
                            <button class="submit-updated-profile">Update</button>
                            <button class="cancel-updated-profile">Cancel</button>
                        </td>
                    </tr>
                                
                `:`
                    <tr>
                        <td class="field-label">User name: </td>
                        <td class="field-value">${username}</td>
                    </tr>
                    <tr>
                        <td class="field-label">Email: </td>
                        <td class="field-value">${email}</td>
                    </tr>
                    <tr>
                        <td class="field-label">City: </td>
                        <td class="field-value">${city}</td>
                    </tr>
                    <tr>
                        <td class="field-label">State:</td>
                        <td class="field-value">${state}</td>
                    </tr>
                    <tr>
                        <td class="button-row" colspan="2">
                            ${profileOwner ? `<button class="edit-profile-button">Edit Profile</button>` : ''} 
                        </td>
                </tr>
                `}
                </table>
                
                
            </div>
        </div>
    
        <h2>My Garage</h2>
        <ul class="motorcycle-list">
            ${this._generateMotorcycleMarkup()}
            <!---
            <li class="motorcycle-card">
                <img src="${imgPlus}" />
                <p>Add Motorcycle</p>
            </li>
            --->
        </ul>

        <h2>Upcoming Rides</h2>
        <ul class="ride-attendance-list">
            ${this._generateRideAttendancesMarkup('upcoming')}
        </ul>

        <h2>Past Rides</h2>
        <ul class="ride-attendance-list">
            ${this._generateRideAttendancesMarkup('past')}
        </ul>
        `

    }
}

export default new ProfileView()