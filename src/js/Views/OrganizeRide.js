import View from './View'

class OrganizeRide extends View {

    _parentElement = document.querySelector('.organize-ride')
    _navBar = document.querySelector('.nav')
    _errorMessage = 'Unable to load the Organize Ride form.'
    _data;

    addHandlerRender(handler) {
        this._navBar.addEventListener('click', function(e) {
            const button = e.target.closest('.nav-link')
            if(!button) return
            if(!button.dataset.page === 'profile') return
            handler()
        })
    }

    addHandlerSubmitForm(handler) {
        const form = document.querySelector('.upload-ride')
        form.addEventListener('submit', function(e) {
            e.preventDefault()
            console.log('success')
            const dataArray = [...new FormData(this)]
            const data = Object.fromEntries(dataArray)
            console.log('data', data)
            handler(data)
        })
    }

    _generateMarkup() {
    }
}

export default new OrganizeRide()