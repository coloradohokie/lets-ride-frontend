
const token = localStorage.getItem('token')
const BASEURL = `https://lets-ride-motorcycle-app.herokuapp.com/`
const loginURL = `${BASEURL}/login`

const loginForm = document.querySelector('.login-form')
loginForm.addEventListener('submit', loginUser)

if (token) {
    window.location.href = './index.html'
}

function loginUser(event) {
    event.preventDefault()

    const loginFormData = new FormData(event.target)
    const email = loginFormData.get('email')
    const password = loginFormData.get('password')

    fetch(loginURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            if (response.token) {
                localStorage.setItem('token', response.token)
                window.location.href = './index.html'
            } else {
                const failureMessage = 'Sign In Failed'
                const loginMessage = document.querySelector('#login-msg')
                loginMessage.innerText = failureMessage
            }
        })
}
