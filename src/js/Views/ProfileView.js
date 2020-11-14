import View from './View'
import imgPlus from 'url:../../assets/plus.png'

class ProfileView extends View {
    _parentElement = document.querySelector('.profile')
    _navButton = document.querySelector('.link__profile')

    addHandlerRender(handler) {
        this._navButton.addEventListener('click', handler)
    }

    _generateMarkup() {
        return `
        <h2>My Profile</h2>
        <div class="profile-container">
        </div>
    
    
        <a name="motorcycles-section"></a>
        <h2>My Garage</h2>
        <ul class="motorcycle">
            <li>
                <img src="${imgPlus}" />
                Add Motorcycle
            </li>
        </ul>
        `

    }
}

export default new ProfileView()