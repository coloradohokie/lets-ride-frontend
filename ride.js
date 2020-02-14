const params = new URLSearchParams(document.location.search)
const id = params.get('id')

header =document.querySelector('header')
contentContainer=document.getElementById('content-container')
// const displayDate = moment(ride.date_time).format('YYYY, MM DD')
// console.log("display date", displayDate)

fetch(`http://localhost:3000/rides/${id}`)
    .then(response => response.json())
    .then(ride => {
        displayTitle(ride)
        displaySubTitle("Description")
        displayDescription(ride)
        displaySubTitle("Route")
        displayRoute(ride)


        displaySubTitle("Photos")
        fetch(`http://localhost:3000/photos`)
            .then(response => response.json())
            .then(photos => {
                displayPhotos(photos)
            })
    })


function displayRoute(ride) {
    const routeHeader = document.getElementById('Route')
    let routeLocation = document.createElement('p')
    let routeDescription = document.createElement('p')
    let routeMap = document.createElement('p')
    routeLocation.innerText = (`Start Location: ${ride.route.start_location}. End Location: ${ride.route.end_location}`)
    routeDescription.innerText = ride.route.description
    routeMap.innerHTML = ride.route.map_path
    routeMap.id = ('map')
    routeHeader.append(routeLocation, routeDescription, routeMap)


}


function displayTitle(ride) {
    let title = document.createElement('table')
    title.width = ("100%")
    title.innerHTML = (`<tr>
                        <td><h2>${ride.route.name} - ${ride.date_time}</h2></td>
                        <td><a href="photo-upload.html?ride_id=${id}">Add Photos</a> |
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
    title.id = titleName
    title.textContent = titleName
    contentContainer.append(title)
}

function displayPhotos(photos) {
    const photoList = photos.filter(photo => photo.ride_id == id)
    let imageNumber = 1
    let numImages = photoList.length

    let code = document.createElement('div')
    code.id=("myModal")
    code.classList.add("modal")
    code.innerHTML = (`<span class="close cursor" onclick="closeModal()">&times;</span>`)

    modalContent=document.createElement('div')
    modalContent.classList.add('modal-content')
    code.appendChild(modalContent)
    
    //thumbnails
    photoList.forEach(photo => {
        image = document.createElement('img')
        image.src = photo.image_path
        image.setAttribute("onclick",(`openModal();currentSlide(${imageNumber})`))
        image.classList.add("ride-photo", "hover-shadow")
        contentContainer.append(image)
        imageNumber++
    })
    contentContainer.append(code)

    // slides
    photoList.forEach(photo => {
        // modalContent.append('this is some text')
        let slides = document.createElement('div')
        slides.classList.add('mySlides')
        modalContent.append(slides)

        let numberText = document.createElement('div')
        numberText.classList.add('numbertext')
        // numberText.innerText = (`${imageNumber}/${numImages}`)
        slides.append(numberText)
        
        let image = document.createElement('img')
        image.src = photo.image_path
        console.log(photo.image_path)
        image.setAttribute('style',"width:100%")
        numberText.append(image)

    })
}







// import './moment'
// const moment = require('moment');
let m = moment().format('YYYY, MM DD');
console.log(m)