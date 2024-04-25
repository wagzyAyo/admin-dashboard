const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const schema = require("./models/model")
const MongodbUri = require("./config")
const ejs = require('ejs');
const bodyParser = require("body-parser")

require("dotenv").config()

app = express()

const port = 3000

mongoose.connect(MongodbUri)
.then(console.log('connected to database'))
.catch(err=>{
    console.log(`Connection to database fail ${err}`)
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.get('/', (req, res)=>{
    res.render('login')
});

app.get('/signup', (req,res)=>{
    res.render('signup')
})


//get data from db

app.get("/api/alldata", async (req, res) => {
    try {
        const data = await schema.find({})
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error})
    }
});

app.get("/sales", async (req, res)=>{
    try{
        const data = await schema.find({tag: "sale"});
        //console.log(data)
     
        res.render('sales', {Data: data})
    } catch (err){
        console.log("Error occured", err)
        res.status(500).send({message: "An error occurred while processing your request."})
    }
});

app.get("/lease", async (req, res)=>{
    try{
        const data = await schema.find({tag: "lease"});
        //console.log(data)
        res.render('lease', {Data: data})
    } catch (err){
        console.log("Error occured", err)
        res.status(500).send({message: "An error occurred while processing your request."})
    }
});

app.get("/rent", async (req, res)=>{
    try{
        const data = await schema.find({tag: "rent"});
        //console.log(data)
        res.render('rent', {Data: data})
    } catch (err){
        console.log("Error occured", err)
        res.status(500).send({message: "An error occurred while processing your request."})
    }
});


//post to db
app.post("/addpost", async (req, res)=>{
    let tag = req.body.tag;
    const name = req.body.name;
    const location = req.body.location;
    const size = req.body.size;
    const short = req.body.short;
    const amount = req.body.amount;
    const description = req.body.description;
    const imageURLS = req.body.imageUrls.split(',').map(url => url.trim());


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
                imageURL: imageURLS
            }
            const property = await schema.create(newProperty);
            property.save()
            res.redirect('/')
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error});
    }
});

//Edit Data
app.get("/edit/:id", async(req,res)=>{
    const id = req.params.id
    try{
        const data = await schema.find({_id: id})
        res.render('edit', {Data: data})
    }
    catch(err){
        console.log({message: err})
    }
});


// update data on db
app.post('/update/:id', async (req, res) => {
    let tag = req.body.tag;
    const name = req.body.name;
    const location = req.body.location;
    const size = req.body.size;
    const short = req.body.short;
    const amount = req.body.amount;
    const description = req.body.description;
    const imageURLS = req.body.imageUrls.split(',').map(url => url.trim());

    try {
        if (
            !name ||!size || !location || !short 
            || !amount||!description
        ){
            res.status(400).send({message: "Send all required fields"})
        }
        const id = req.params.id;
        const update = {
            tag: tag,
            name: name,
            location: location,
            short: short,
            size: size,
            amount: amount,
            description: description,
            imageURL: imageURLS
        };
        console.log(update)

        const result = await schema.findByIdAndUpdate(id, update)

        if (!result){
            res.status(404).send({message:"data not found"});
            return
        }

        res.redirect('/')
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message})
        
    }
});


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
});


// delete data on db

app.post("/delete/:id", async (req, res)=> {
    try {
        const id = req.params.id;
        const result = await schema.findByIdAndDelete(id);
        if(!result){
            res.status(404).send({message: "Cant find data"})
        }

        res.redirect('/')
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message: error.message})
        
    }
})

//connect to db
app.listen(port, ()=>{
    console.log(`App listening on port ${port}`)
})
