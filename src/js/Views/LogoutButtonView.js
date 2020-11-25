import View from './View'

class LogoutButtonView extends View {

    _parentElement = document.querySelector('.logout-button');

    addHandlerLogout(handler) {
        document.querySelector('.logout-button').addEventListener('click', handler)
    }

}

export default new LogoutButtonView()