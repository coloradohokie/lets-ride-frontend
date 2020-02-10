console.log('hit')

const params = new URLSearchParams(document.location.search)
const id = params.get('id')
console.log(id)

fetch(`http://localhost:3000/rides/${id}`)
    .then(response => response.json())
    .then(ride => {
        console.log("ride id", ride.id)
    })