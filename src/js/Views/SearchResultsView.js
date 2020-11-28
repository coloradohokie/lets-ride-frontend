import View from './View'
import moment from 'moment'
import icons from '../../assets/icons.svg'

class SearchResultsView extends View {
    _parentElement = document.querySelector('.search-results-ride-container');
    _errorMessage = 'Unable to load search results. The server might be down.'
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
        const numResults = this._data.ridesList.numResults
        return `
            <div class="ride-list">
                <h2>${numResults ? numResults : 'No ' } Upcoming Rides</h2>
                <ul class="upcoming-rides">
                    ${this._upComingRidesMarkup('upcoming')}
                </ul>
            <br>
            </div>
        `
    }

    _upComingRidesMarkup(timeline) {
        const today = Date.now()
        console.log(this._data)
        const {currentRideId} = this._data
        const ridesList = this._data.ridesList.list
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

}

export default new SearchResultsView()