




function removeMotorcycle (motorcycle_id) {
    fetch(`${BASEURL}/motorcycles/${motorcycle_id}` ,{method: "DELETE"})
        .then(response => {
            response.json()
            window.location.href = 'http://localhost:3001/index.html#motorcycles-section'
            window.location.reload(true);
        })
}



