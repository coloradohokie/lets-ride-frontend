import View from './View'

class WelcomeMessageView extends View {

    _parentElement= document.querySelector('.welcome-message');
    _data;

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    _generateMarkup() {
        console.log(this._data)
        let {username, avatar_url} = this._data
        const stringArray = avatar_url.split('image/upload/')
        console.log(stringArray)
        const updatedAvatarUrl = stringArray[0] + 'image/upload/' + 'g_face,c_thumb,w_40,h_40/' + stringArray[1]
        console.log(updatedAvatarUrl)
        return `
            <div class="header-profile-image">
                <img src="${updatedAvatarUrl}" />
            </div>
            <div>
                <h1>Welcome, ${username}! Let's Ride!</h1>
            </div>
        `
    }
}

export default new WelcomeMessageView()