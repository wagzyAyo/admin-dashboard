const express = require("express")
const { METHODS } = require("http")
const path = require("path")

app = express()

const port = 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'))
})
app.get('/add', (req, res)=> {
    res.sendFile(path.join(__dirname, '/static/add.html'))
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})