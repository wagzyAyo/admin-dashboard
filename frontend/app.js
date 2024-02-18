//get data from backend
fetch('/getdata')
.then(response => response.json())
.then(data => {
    data.forEach(item => {
        const div = document.createElement("div");
        div.textContent = `Name: ${item.name}
        Amount:  ${item.amount}
        Size: ${item.size}
        Location: ${item.location}
        short: ${item.short} 
        Description: ${item.description}`;
        document.body.appendChild(div)
    })
})
.catch(error => console.log(error))