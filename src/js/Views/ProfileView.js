import View from './View'
import imgPlus from 'url:../../assets/plus.png'
import profileImage from 'url:../../assets/user.png'
import motoImage from 'url:../../assets/moto.png'
import rideImage from 'url:../../assets/moto-ride.jpg'
import {displayDate} from '../helpers'

class ProfileView extends View {
    _parentElement = document.querySelector('.profile')
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
        console.log(this._data)
        const {username, city, state, email} = this._data.user
        const editMode = this._data.mode === 'edit'
        const {profileOwner} = this._data
        return `
        <h2>${profileOwner ? 'My Profile' : username}</h2>
        <div class="profile-container">
            <div>
                <img class="profile-picture" src="${profileImage}" alt="Profile Picture" />
            </div>
            <div>
                <table>
                ${editMode ? `
                    <tr>
                        <td class="field-label">User name:</td>
                        <td class="field-value"><input id="p-username" name="p-username" value="${username}" /></td>
                    </tr>
                    <tr>
                        <td class="field-label">Email: </td>
                        <td class="field-value"><input id="p-email" name="p-email" value="${email}" /></td>
                    </tr>
                    <tr>
                        <td class="field-label">City: </td>
                        <td class="field-value"><input id="p-city" name="p-city" value="${city}" /></td>
                    </tr>
                    <tr>
                        <td class="field-label">State:</td>
                        <td class="field-value"><input id="p-state" name="p-state" value="${state}" /></td>
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
                `}
                </table>
                ${profileOwner ? `<button class="edit-profile-button">Edit Profile</button>` : ''}
                
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