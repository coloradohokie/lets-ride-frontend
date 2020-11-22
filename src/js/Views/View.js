import profileImage from 'url:../../assets/user.png'

export default class View {
    render(data) {
        this._data = data
        this._clear(this._parentElement)
        const markup = this._generateMarkup()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    _clear(element = this._parentElement) {
        element.innerHTML= ''
    }

    _displayAvatar(avatarUrl) {
        return avatarUrl ? avatarUrl : profileImage
    }

    renderSpinner() {
        const markup = `
            <div class="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        `
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }
}