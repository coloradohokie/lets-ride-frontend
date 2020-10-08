routeSelector = document.getElementById('route')
const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com/`


fetch(`${BASEURL}/routes`)
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