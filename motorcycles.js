

fetch(`http://localhost:3000/riders/${localStorage.getItem("rider_id")}`)
    .then(response => response.json())
    .then(rider => {
        const motorcycles = rider.motorcycle
        motorcycles.map(motorcycle => {
            motorcycleElement = document.createElement('li')
            motorcycleElement.innerText = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model}`
            motorcycleListElement.appendChild(motorcycleElement)
        });
    })

//localStorage.setItem("rider_id","1")
//query motorcycles db stretch