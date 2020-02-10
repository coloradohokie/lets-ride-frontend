let motorcycleListElement = document.getElementById('motorcycle-list')

fetch("http://localhost:3000/riders/1")
    .then(response => response.json())
    .then(rider => {
        const motorcycles = rider.motorcycle
        motorcycles.map(motorcycle => {
            console.log(motorcycle.make)
            motorcycleElement = document.createElement('li')
            motorcycleElement.innerText = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model}`
            motorcycleListElement.appendChild(motorcycleElement)
        });
    })
//query motorcycles db stretch

//