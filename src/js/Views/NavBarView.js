
class NavBarView {

    _parentElement = document.querySelector('.nav')
    _header = document.querySelector('header')

    navigateToPage(newPage) {
        newPage = '.' + newPage
        document.querySelectorAll('.page')
            .forEach(page => page.classList.add('hidden'))
        document.querySelector(newPage).classList.remove('hidden')
    }

    hideHeader() {
        this._header.classList.add('hidden')
    }

    addHandlerTogglePage() {
        this._parentElement.addEventListener('click', function(e) {
            const button = e.target.closest('.nav-link')
            if(!button) return
            const newPage = '.' + button.dataset.page
            document.querySelectorAll('.page')
                .forEach(page => page.classList.add('hidden'))
            document.querySelector(newPage).classList.remove('hidden')
        })

    }


    
}

export default new NavBarView()