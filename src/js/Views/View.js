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