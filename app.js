const express = require("express")
const { METHODS } = require("http")
const { MongoClient } = require("mongodb")
const path = require("path")
require("dotenv").config()

app = express()

const port = 3000
const uri = process.env.uri;

//conect to mongodb
const client =  new MongoClient(uri)
client.connect()

const dataBase = client.db('ola');
const collection = dataBase.collection('properties')


app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'))
})
app.get('/add', (req, res)=> {
    res.sendFile(path.join(__dirname, '/static/add.html'))
})

app.post('/addData', async (req, res)=> {
    try {
        const { title, description } = req.body;
        const result = await collection.insertOne({ title, description });
        console.log("Data added:", result.insertedId);
        res.status(200).send("data added")
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})