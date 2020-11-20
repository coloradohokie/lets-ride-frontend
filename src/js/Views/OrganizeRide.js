import View from './View'

class OrganizeRide extends View {

    _parentElement = document.querySelector('.organize-ride')
    _navBar = document.querySelector('.nav')
    _data;

    addHandlerRender(handler) {
        this._navBar.addEventListener('click', function(e) {
            const button = e.target.closest('.nav-link')
            if(!button) return
            if(!button.dataset.page === 'profile') return
            handler()
        })
    }

    addHandlerSubmitForm(handler) {
        const form = document.querySelector('.upload-ride')
        form.addEventListener('submit', function(e) {
            e.preventDefault()
            console.log('success')
            const dataArray = [...new FormData(this)]
            const data = Object.fromEntries(dataArray)
            console.log('data', data)
            handler(data)
        })
    }

    _generateMarkup() {
        // console.log(this._data)
        // return `
        //     <h1>Organize a Ride!!!</h1>

        //     <form method="POST" class="all-forms upload-ride">
        //         <label for="title">Title</label>
        //         <input type="text" id="title" name="title" placeholder="Title" />
        //         <label for="description">Description</label>
        //         <textarea id="description" name="description" placeholder="Description"></textarea>
        
        //         <label id="date" for="date">Date:</label>
        //         <input type="date" name="date" id="date" placeholder="date">

        //         <label id="start-time" for "start">Start Time:</label>
        //         <input type="time" name="start" />

        //         <label id="end-time" for "end">End Time:</label>
        //         <input type="time" name="end" />

        //         <label for="route">Route</label>
        //         <select id="route" name="route">
        //             ${this._data
        //                 .map(route => `<option value=${route.id}> ${route.name} </option>`)
        //                 .join('')}
        //         </select>
                
        //         <!-- <a href="create-route.html">Create New Route</a> -->
        
        //         <input id="submit" type="submit" value="Create Ride">
            
        //     </form>
        // `
    }
}

export default new OrganizeRide()