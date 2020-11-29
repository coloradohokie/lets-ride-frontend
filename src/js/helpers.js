import moment from 'moment'
import * as model from './model'
import regeneratorRuntime from "regenerator-runtime";

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

export async function AJAX(url, method = 'GET', uploadData = undefined, authorization = true) {
    try {
        let headers = {'Content-Type':'application/json'}
        if (authorization) headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        const requestInfo = {method, headers}
        if (uploadData) requestInfo.body = JSON.stringify(uploadData)
        // console.log('SERVER REQUEST:', url, requestInfo)
        const response = await fetch(url, requestInfo)
        if (method === 'DELETE') return
        const data = await response.json()
        // console.log('RESPONSE FROM SERVER:', data)
        if (!response.ok) throw new Error (`${data.message} (${response.status})`)
        return data

    } catch (error) {
        throw error
    }
}


