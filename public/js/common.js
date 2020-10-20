function displayDate(date) {
    return moment(date).format('MMMM Do, YYYY')
}

function showElement (elementID) {
    const targetElement = document.getElementById(elementID)
    targetElement.style.display = "block"
}

function hideElement (elementID) {
    const targetElement = document.getElementById(elementID)
    targetElement.style.display = "none"
}


