import View from './View'
import moment from 'moment'

class SearchResultsView extends View {
    _parentElement = document.querySelector('.search-results');
    _data;

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    addHandlerSelectedRide() {
        const _this = this
        this._parentElement.addEventListener('click', function(e) {
            const previousSelectedCard = _this._parentElement.querySelector('.active')
            const newSelectedCard = e.target.closest('.ride-list-card')
            if(!newSelectedCard) return
            if(previousSelectedCard) previousSelectedCard.classList.remove('active')
            newSelectedCard.classList.add('active')
        })
    }

    _generateMarkup() {
        return `
            <div class="ride-container">
                <div class="ride-list">
                    <h2>Upcoming Rides</h2>
                    <ul class="upcoming-rides">
                        ${this._upComingRidesMarkup('upcoming')}
                    </ul>
                    <br>
                </div>
                <div class="ride-list">
                    <h2>Past Rides</h2>
                    <ul class="past-rides">
                        ${this._upComingRidesMarkup('past')}
                    </ul>       
                </div>
            </div>
        `
    }

    _upComingRidesMarkup(timeline) {
        const today = Date.now() //parsed
        const {ridesList, currentRideId} = this._data
        return ridesList
            .filter(ride => timeline === 'upcoming' ?
                Date.parse(ride.date) >= today :
                Date.parse(ride.date) < today)
            .map(ride => {
                return `
                    <a href="#${ride.id}">
                        <li class="ride-list-card ${ride.id === currentRideId ? 'active': ''}" data-id="${ride.id}">
                            <div class="date">
                                ${moment(ride.date).format("MMM")}<br>${moment(ride.date).format("DD")}
                            </div>
                            <h3>${ride.title}</h3>
                        </li>
                    </a>
                `
            })
            .join('')
    }


    displayRides() {  //deprecated
        rides.map(ride => {
            let today = Date.parse(new Date())
            const rideDate = Date.parse(ride.date)
        
            listItem = document.createElement('li')
            listItem.classList.add("ride-list-card")
            listItem.addEventListener('click', () => {
    
                displayRideDetails(ride.id)
            })
            listItem.dataset.id = ride.id
            listItem.innerHTML = (`
                <div class="date">
                    ${moment(ride.date).format("MMM")}<br>${moment(ride.date).format("DD")}
                </div>    
                <h3>${ride.title}</h3>
            `)
    
            listItem.classList.add("ride")
            listItem.classList.add("user-ride")
            listItem.classList.remove("non-user-ride")
            
            rideDate >= today ? upcomingRidesElement.append(listItem) : pastRidesElement.append(listItem)
        })
    }
}

export default new SearchResultsView()