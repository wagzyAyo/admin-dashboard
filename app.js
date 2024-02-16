const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const schema = require("./models/model")

require("dotenv").config()

app = express()

const port = 3000
const uri = process.env.uri;
const MongodbUri = "mongodb+srv://ola:admin@cluster0.bbiilar.mongodb.net/properties?retryWrites=true&w=majority"


app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json())

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

