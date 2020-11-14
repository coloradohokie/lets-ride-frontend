const params = new URLSearchParams(document.location.search)
const id = params.get('id')
const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com/`

header =document.querySelector('header')
contentContainer=document.querySelector('.rides')

fetch(`${BASEURL}/rides/${id}`)
.then(response => response.json())
.then(ride => {
    displayTitle(ride)
    displaySubTitle("Description")
    displayDescription(ride)
    displaySubTitle("Route")
    displayRoute(ride)
    
    
    displaySubTitle("Photos")
    fetch(`${BASEURL}/photos`)
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
                        <td><h2>${ride.route.name} - ${displayDate(ride.date_time)}</h2></td>
                        <td><a href="photo-upload.html?ride_id=${id}">Add Photos</a> |
                        <a href="update-ride.html?ride_id=${id}">Edit Ride</a>
                        </td>
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
    
    //modal box
    let myModal = document.createElement('div')
    myModal.id=("myModal")
    myModal.classList.add("modal")
    myModal.innerHTML = (`<span class="close cursor" onclick="hideElement('myModal')">&times;</span>`)
    
    modalContent=document.createElement('div')
    modalContent.classList.add('modal-content')
    
    //thumbnails
    const photoList = photos.filter(photo => photo.ride_id == id)
    let imageNumber = 1
    photoList.forEach(photo => {
        image = document.createElement('img')
        image.src = photo.image_path
        image.setAttribute("onclick",(`showElement('myModal');showSlide(${imageNumber})`))
        image.classList.add("ride-photo", "hover-shadow")
        contentContainer.append(image)
        imageNumber++
    })

    myModal.appendChild(modalContent)
    contentContainer.append(myModal)

    // slides
    photoList.forEach(photo => {
        let slides = document.createElement('div')
        slides.classList.add('mySlides')
        let image = document.createElement('img')
        image.src = photo.image_path
        
        modalContent.append(slides)
        slides.append(image)
    })
}

function showSlide(slideIndex) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {slides[i].style.display = "none";}
    slides[slideIndex-1].style.display = "block";
  }
  
