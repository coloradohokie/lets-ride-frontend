import View from './View'

class LoginView extends View {
    _parentElement = document.querySelector('.login-form');
    _data;

    _window = document.querySelector('.login')
    _overlay = document.querySelector('.overlay')
    _signUpButton = document.querySelector('.sign-up-button')

    showLogin() {
        this._overlay.classList.remove('hidden')
        this._window.classList.remove('hidden')
    }

    addHandlerLoginSubmit(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault()
            const dataArray = [...new FormData(this)]
            const data = Object.fromEntries(dataArray)
            handler(data)
        })

    }

    _generateMarkup() {
    }
}

export default new LoginView()