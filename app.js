const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const schema = require("./models/model")
const MongodbUri = require("./config")

require("dotenv").config()

app = express()

const port = 3000



app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json())


//post to db
app.post("/addpost", async (req, res)=>{
    try {
        if(
            !req.body.name ||
            !req.body.location ||
            !req.body.description
            ){
               return res.status(400).send({message: "Send all required fields. Name, Location and description"})
            };
            const newProperty = {
                name: req.body.name,
                location: req.body.location,
                description: req.body.location
            }
            const property = await schema.create(newProperty)
            return res.status(200).send(property)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error});
    }
})

//get data from db

app.get("/getdata", async (req, res) => {
    try {
        const data = await schema.find({})
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error})
    }
})

//connect to db
mongoose
.connect(MongodbUri)
.then(() => {
    console.log("App connected to database");
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })

})
.catch((error) => {
    console.log(error)
})

