const params = new URLSearchParams(document.location.search)
const id = params.get('id')

header =document.querySelector('header')
contentContainer=document.getElementById('content-container')

fetch(`http://localhost:3000/rides/${id}`)
    .then(response => response.json())
    .then(ride => {
        displayTitle(ride)
        displayDescription(ride)
        displayPhotoTitle()
    })

function displayTitle(ride) {
    let title = document.createElement('h1')
    title.textContent = (`${ride.route.name} - ${ride.date_time}`)
    header.append(title)
}

function displayDescription(ride) {
    let description = document.createElement('p')
    description.innerText = ride.description
    contentContainer.append(description)
}

function displayPhotoTitle() {
    let title = document.createElement('table')
    title.width = ("90%")
    title.innerHTML = (`<tr>
                        <td><h2>Photos</h2></td>
                        <td><a href="photo-upload.html">Add Photos</a></td>
                        </tr>`)
    contentContainer.append(title)
}