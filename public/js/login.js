
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

    try {
        fetch(loginURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
            .then(response => response.json())
            .then(response => {
                if (response.token) {
                    localStorage.setItem('token', response.token)
                    localStorage.setItem('username', response.username)
                    localStorage.setItem('userId', response.userId)
                    window.location.href = './index.html'
                } else {
                    const failureMessage = 'Sign In Failed'
                    const loginMessage = document.querySelector('#login-msg')
                    loginMessage.innerText = failureMessage
                }
            })
    } catch (error) {
        console.log(error)
        alert('Error loggging in')
    }

}
