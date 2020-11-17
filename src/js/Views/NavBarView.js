
class NavBarView {

    _parentElement = document.querySelector('.nav')

    navigateToPage(newPage) {
        newPage = '.' + newPage
        document.querySelectorAll('.page')
            .forEach(page => page.classList.add('hidden'))
        document.querySelector(newPage).classList.remove('hidden')
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