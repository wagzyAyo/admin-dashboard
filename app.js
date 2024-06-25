const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const schema = require("./models/model")
const MongodbUri = require("./config")
const ejs = require('ejs');
const bodyParser = require("body-parser")
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const authenticate = require('./models/token')
const user = require('./models/user')
const authToken = require('./models/auth')




require("dotenv").config()

app = express()

const port = 3000



app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.set('view engine', 'ejs');


mongoose.connect(MongodbUri)
.then(console.log('connected to database'))
.catch(err=>{
    console.log(`Connection to database fail ${err}`)
});



app.get('/', authenticate,  (req, res)=>{
    //console.log(req.session.passport)
    //console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        res.redirect('/home')
    }else{
        res.render('login')
    }
   
});

app.get('/home', (req, res)=>{
    if(req.isAuthenticated()){
        res.render('index')
    } else{
        res.render('login')
    }
    
})

app.get('/signup', (req,res)=>{
    res.render('signup')
});

app.post('/', (req, res)=>{
    const user = new userModel({
        username : req.body.usermail,
        password : req.body.password
    })
    
   
})

app.post('/signup', async (req,res)=>{
    const mail = req.body.usermail;
    const password = req.body.password;
    
    if (!mail || !password){
        res.status(401).json({message: 'provide mail and password fields'})
    }
    try {
        const SALT = parsInt(process.env.SALT);
        const newPassword =  bcrypt.hash(SALT, password);

        const newAdmin = new userModelr({
            mail,
            password: newPassword
        });

        await newAdmin.save();
        authToken(res, newAdmin._id)

    } catch (err) {
        res.status(401).json({message: 'Error creating user, duplicate email'})
    }
})


//get data from db


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
            res.redirect('/home')
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error});
    }
});

//Edit Data
app.get("/edit/:id", async(req,res)=>{
    if(req.isAuthenticated()){
    const id = req.params.id
    try{
        const data = await schema.find({_id: id})
        res.render('edit', {Data: data})
    }
    catch(err){
        console.log({message: err})
    }
} else{
    res.redirect('/')
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

        res.redirect('/home')
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
});


//API
app.get("/api/alldata", async (req, res) => {
    try {
        const data = await schema.find({})
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error})
    }
});
app.get("/api/sales", async (req, res)=>{
    try{
        const data = await schema.find({tag: "sale"});
        //console.log(data)
     
        return res.status(200).json(data)
    } catch (err){
        console.log("Error occured", err)
        res.status(500).send({message: "An error occurred while processing your request."})
    }
});

app.get("/api/lease", async (req, res)=>{
    try{
        const data = await schema.find({tag: "lease"});
        //console.log(data)
        return res.status(200).json(data)
    } catch (err){
        console.log("Error occured", err)
        res.status(500).send({message: "An error occurred while processing your request."})
    }
});

app.get("/api/rent", async (req, res)=>{
    try{
        const data = await schema.find({tag: "rent"});
        //console.log(data)
        return res.status(200).json(data)
    } catch (err){
        console.log("Error occured", err)
        res.status(500).send({message: "An error occurred while processing your request."})
    }
});


//connect to db
app.listen(port, ()=>{
    console.log(`App listening on port ${port}`)
})
