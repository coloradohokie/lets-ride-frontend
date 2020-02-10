console.log('hit')

userList = document.getElementById('user-list')

fetch('http://localhost:3000/riders')
    .then (response => response.json())
    .then (users => displayUsers(users))


function displayUsers(users) {
    users.map( user => {
        listItem = document.createElement('li')
        listItem.innerHTML = (`<a href="main.html?id=<${user.id}">${user.name}</a>`)
        userList.append(li)    
})
}
