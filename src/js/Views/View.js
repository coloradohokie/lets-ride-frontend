export default class View {
    render(data) {
        this._data = data
        this._clear(this._parentElement)
        const markup = this._generateMarkup()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    _clear(element = _parentElement) {
        element.innerHTML= ''
    }
}