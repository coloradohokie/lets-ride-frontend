console.log('hit')

const params = new URLSearchParams(document.location.search)
const id = params.get('id')
console.log(id)

fetch(`http://localhost:3000/rides/${id}`)
    .then(response => response.json())
    .then(ride => {
        console.log(ride)
        displayTitle(ride)
        displayDescription(ride)
        displayPhotoTitle()
    })

function displayTitle(ride) {
    let title = document.createElement('h1')
    title.innerText = (`${ride.route.name} - ${ride.date_time}`)
    document.body.append(title)
}

function displayDescription(ride) {
    let description = document.createElement('p')
    description.innerText = ride.description
    document.body.append(description)
}

function displayPhotoTitle() {
    let title = document.createElement('table')
    title.innerHTML = (`<tr>
                        <td><h2>Photos</h2></td>
                        <td><a href="photo-upload.html">Add Photos</a></td>
                        </tr>`)
    document.body.append(title)
}