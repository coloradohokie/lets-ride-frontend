console.log ('hit')

routeSelector = document.getElementById('route')

fetch('http://localhost:3000/routes')
    .then(response => response.json())
    .then(routes => getRoutes(routes))

function getRoutes(routes) {
    routes.map( route => {
        option = document.createElement('option')
        option.value = route.id
        option.innerText = route.name
        routeSelector.append(option)        
    })
}