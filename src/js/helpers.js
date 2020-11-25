import moment from 'moment'
import * as model from './model'

export function displayDate(date) {
    return moment(date).format('MMMM Do, YYYY')
}

export function showElement (elementID) {
    const targetElement = document.getElementById(elementID)
    targetElement.style.display = "block"
}

export function hideElement (elementID) {
    const targetElement = document.getElementById(elementID)
    targetElement.style.display = "none"
}

export function userOnRide(userId, ridersArray) {
    return ridersArray.find(rider => rider.id === userId)
}

export function setActivePage(newPage) {
    model.setActivePage(newPage)
    newPage = '.' + newPage
    document.querySelectorAll('.page')
        .forEach(page => page.classList.add('hidden'))
    document.querySelector(newPage).classList.remove('hidden')
}




