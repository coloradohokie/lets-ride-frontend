import View from './View'

class OrganizeRide extends View {

    _parentElement = document.querySelector('.organize-ride')
    _routeSelectorElement = document.querySelector('#route')
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

    addHandlerToggleRouteSelection(routes) {
        this._routeSelectorElement.addEventListener('change', function(e) {
            const routePreviewBoxElement = document.querySelector('.route-preview-box')
            const newRouteDetailsElement = document.querySelector('.new-route-details')
            const routeId = +e.target.value
            if (routeId) {
                routePreviewBoxElement.classList.remove('hidden')
                newRouteDetailsElement.classList.add('hidden')
                const selectedRoute = routes.routes.find(route => route.id === routeId)
                routePreviewBoxElement.innerHTML = selectedRoute.map_url
            } else {
                routePreviewBoxElement.classList.add('hidden')
                newRouteDetailsElement.classList.remove('hidden')
            }
        })
    }

    addHandlerSubmitForm(handler) {
        const form = document.querySelector('.upload-ride')
        form.addEventListener('submit', function(e) {
            e.preventDefault()
            const dataArray = [...new FormData(this)]
            const data = Object.fromEntries(dataArray)
            handler(data)
        })
    }

    _generateMarkup() {
    }
}

export default new OrganizeRide()