import View from './View'

class LogoutButtonView extends View {

    _parentElement = document.querySelector('.logout-button');

    addHandlerLogout(handler) {
        this._parentElement.addEventListener('click', handler)
    }

}

export default new LogoutButtonView()