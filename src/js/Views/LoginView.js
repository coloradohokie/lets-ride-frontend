import View from './View'

class LoginView extends View {
    _parentElement=document.querySelector('.login');
    _loginForm = document.querySelector('.login-form')
    _signUpForm = document.querySelector('.sign-up-form')
    _errorMessage = 'There was a problem logging in'
    _data;

    _toggleScreenButton = document.querySelector('.toggle-screen-button')
    _loginPageTitle = document.querySelector('.login-page-title')
    _infoBox = document.querySelector('.info-box')
    _allPages = document.querySelectorAll('.page')

    showLogin() {
        this._allPages.forEach(page => page.classList.add('hidden'))
        this._parentElement.classList.remove('hidden')
    }

    //This function handles both signup and login
    addHandlerFormSubmit(handler, form = 'login') {
        let formSelector = this._loginForm
        if (form === 'signUp') formSelector = this._signUpForm
        formSelector.addEventListener('submit', function(e) {
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
            _this._loginForm.classList.toggle('hidden')
            _this._signUpForm.classList.toggle('hidden')

            //change the screen title and message at the bottom.
            if (_this._loginForm.classList.contains('hidden')) {
                _this._loginPageTitle.innerText = 'Create a New Account'
                _this._toggleScreenButton.innerText = 'Log into Existing Account'
                _this._infoBox.classList.add('hidden')
            } else {
                _this._loginPageTitle.innerText = 'Log Into Let\'s Ride'
                _this._toggleScreenButton.innerText = 'Create New Account'
                _this._infoBox.classList.remove('hidden')
            }
        })
    }

    _generateMarkup() {
    }
}

export default new LoginView()