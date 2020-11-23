import View from './View'
import icons from 'url:../../assets/icons.svg'

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination')
    _data


    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const button = e.target.closest('.page-button')
            if(!button) return
            const goToPage = +button.dataset.goto
            handler(goToPage)
        })
    }

    _nextButtonMarkup() {
        const currentPage = this._data.page
        return `
            <button class="btn--inline page-button" data-goto="${currentPage + 1}">
            <span>Page ${currentPage +1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>
        `
    }

    _prevButtonMarkup() {
        const currentPage = this._data.page
        return `
            <button class="btn--inline page-button" data-goto="${currentPage - 1}">
                <svg class= "search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
        `
    }

    _generateMarkup() {
        const {list, resultsPerPage} = this._data
        const currentPage = this._data.page
        const upcomingRidesList = list.filter(ride => Date.parse(ride.date) > Date.now())
        const numPages = Math.ceil(upcomingRidesList.length / resultsPerPage)

        //there are multiple pages and on the first page
        if (numPages > 1 && currentPage === 1) return this._nextButtonMarkup()

        //there are multiple pages and on the last page
        if (numPages > 1 && currentPage === numPages) return this._prevButtonMarkup()

        //there are multiple pages and on a middle page
        if (numPages > 1 && currentPage > 1) {
            return this._prevButtonMarkup() + this._nextButtonMarkup()
        }

        //there is only 1 page
        return ''


    }
}

export default new PaginationView ()