const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const schema = require("./models/model")
const MongodbUri = require("./config")
const ejs = require('ejs')

require("dotenv").config()

app = express()

const port = 3000



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('view engine', 'ejs');


app.get('/', (req, res)=>{
    res.render('index')
});


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


//post to db
app.post("/addpost", async (req, res)=>{
    const tag = req.body.tag;
    const name = req.body.name;
    const location = req.body.location;
    const size = req.body.size;
    const short = req.body.short;
    const amount = req.body.amount;
    const description = req.body.description;
    try {
        if(
            !name ||!size || !location || !short 
            || !amount||!description
            ){
               return res.status(400).send({message: 
                "Send all required fields. Name, Location, description, amount, size"})
            };
            const newProperty = {
                tag: tag,
                name: name,
                location: location,
                short: short,
                size: size,
                amount: amount,
                description: description,
            }
            const property = await schema.create(newProperty)
            return res.status(200).send(property)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error});
    }
})


//get data by id from db

app.get("/getdata/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const data = await schema.findById(id)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message})
    }
})

// updat data on db
app.put('/update/:id', async (req, res) => {
    const name = req.body.name;
    const location = req.body.location;
    const size = req.body.size;
    const short = req.body.short;
    const amount = req.body.amount;
    const description = req.body.description;

    try {
        if (
            !!name ||!size || !location || !short 
            || !amount||!description
        ){
            res.status(400).send({message: "Send all required fields"})
        }
        const {id } = req.params;

        const result = await schema.findByIdAndUpdate(id, req.body)

        if (!result){
            res.status(404).send({message:"data not found"});
            return
        }

        return res.status(200).send({message: "data updated successfully!"})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message})
        
    }
})


// delete data on db

app.delete("/delete/:id", async (req, res)=> {
    try {
        const {id} = req.params;
        const result = await schema.findByIdAndDelete(id);
        if(!result){
            res.status(404).send({message: "Cant find data"})
        }

        return res.status(200).send({message: "Data deleted successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message: error.message})
        
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

