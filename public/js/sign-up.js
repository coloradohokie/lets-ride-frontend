const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com`

const signUpForm = document.querySelector('.sign-up-form')
signUpForm.addEventListener('submit', signUpUser)

function signUpUser(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    const city = formData.get('city')
    const state = formData.get('state')

    try {
        fetch(`${BASEURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, email, password, city, state})
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    displayFailureMessage()
                }
            })
            .then(response => {
                console.log(response)
                try {
                    fetch(`${BASEURL}/login`,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email, password})
                    })
                    .then(response => response.json())
                    .then(response => { console.log(response)
                        
                    })
                    window.location.href = './index.html'
                } catch (error) {
                    console.log(error)
                    alert('error logging in')
                }
            })
    } catch (error) {
        console.log(error)
        alert('Error signing up')
    }
}

function displayFailureMessage() {
    const failureMessage = 'Something went wrong'
    const messageHeader = document.querySelector('.sign-up-msg')
    messageHeader.innerText = failureMessage
}