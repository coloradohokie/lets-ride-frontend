import View from './View'

class NavBarView extends View {

    _parentElement = document.querySelector('.nav');
    _data;

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    _generateMarkup() {
        return `
            <div>
                <h1 class="welcome-message">Welcome, ${this._data.username}! Let's Ride!</h1>
                1990 Kawasaki Vulcan 750
            </div>
            <a href="#">Rides</a>
            <a href="#">Organize Group Ride</a>
            <a href="#">My Profile</a>
            <button class="logout-button">Logout</button>
        `
    }
}

export default new NavBarView()