import View from './View'

class LoginView extends View {
    _parentElement = document.querySelector('.login-form');
    _signUpForm = document.querySelector('.sign-up-form')
    _errorMessage = 'There was a problem logging in'
    _data;

    _window = document.querySelector('.login')
    _overlay = document.querySelector('.overlay')
    _toggleScreenButton = document.querySelector('.toggle-screen-button')
    _message = document.querySelector('.login-msg')
    _loginPageTitle = document.querySelector('.login-page-title')

    showLogin() {
        this._overlay.classList.remove('hidden')
        this._window.classList.remove('hidden')
    }

    //This function handles both signup and login
    addHandlerFormSubmit(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault()
            const dataArray = [...new FormData(this)]
            const data = Object.fromEntries(dataArray)
            handler(data)
        })

    }

    addHandlerToggleScreen() {
        const _this = this
        this._toggleScreenButton.addEventListener('click', function(e) {
            // toggle display of the login and sign up forms
            _this._parentElement.classList.toggle('hidden')
            _this._signUpForm.classList.toggle('hidden')

            //change the screen title and message at the bottom.
            if (_this._parentElement.classList.contains('hidden')) {
                _this._loginPageTitle.innerText = 'Sign Up!'
                _this._message.innerText = 'Already have an account?'
                _this._toggleScreenButton.innerText = 'Log In'
            } else {
                _this._loginPageTitle.innerText = 'Please Sign In'
                _this._message.innerText = `Don't have an account?`
                _this._toggleScreenButton.innerText = 'Sign Up'
            }
        })
    }

    _generateMarkup() {
    }
}

export default new LoginView()