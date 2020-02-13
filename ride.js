const params = new URLSearchParams(document.location.search)
const id = params.get('id')

header =document.querySelector('header')
contentContainer=document.getElementById('content-container')

fetch(`http://localhost:3000/rides/${id}`)
    .then(response => response.json())
    .then(ride => {
        displayTitle(ride)
        displaySubTitle("Description")
        displayDescription(ride)
        displaySubTitle("Photos")
    })

fetch(`http://localhost:3000/photos`)
    .then(response => response.json())
    .then(photos => {
        displayPhotos(photos)
    })

function displayTitle(ride) {
    let title = document.createElement('table')
    title.width = ("100%")
    title.innerHTML = (`<tr>
                        <td><h2>${ride.route.name} - ${ride.date_time}</h2></td>
                        <td><a href="photo-upload.html">Add Photos</a> |
                        <a href="">Edit Description</a></td>
                        </tr>`)
    header.append(title)
}

function displayDescription(ride) {
    let description = document.createElement('p')
    description.innerText = ride.description
    contentContainer.append(description)
}

function displaySubTitle(titleName) {
    let title = document.createElement('h3')
    title.textContent = titleName
    contentContainer.append(title)
}

function displayPhotos(photos) {
    const photoList = photos.filter(photo => photo.ride_id == id)
    photoList.forEach(photo => {
        image = document.createElement('img')
        image.src = photo.image_path
        image.width ="400"
        image.classList.add("ride-photo")
        contentContainer.append(image)
    })
}