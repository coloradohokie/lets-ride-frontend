import View from './View'

class WelcomeMessageView extends View {

    _parentElement = document.querySelector('.welcome-message');
    _data;

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    // addHandlerLogOut(handler) {
    //     this._logOutButton.addEventListener('click', handler)
    // }

    _generateMarkup() {
        return `
            <div>
                <h1>Welcome, ${this._data.username}! Let's Ride!</h1>
                1990 Kawasaki Vulcan 750
            </div>
        `
    }
}

export default new WelcomeMessageView()