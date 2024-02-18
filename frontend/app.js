//get data from backend
fetch('/getdata')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.log(error))