import moment from 'moment'
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




