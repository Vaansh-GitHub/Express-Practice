/* Mongosh Commands ~

show dbs
use <db_name>
show collections
db.<collection-name>.find()
db.<collection-name>.insert()

for connecting MongoDb with your nodejs application run "mongosh" in cmd to extablish connection in the background
then Type "npm i mongoose" which is a module for connecting mongoDb to nodejs

How Mongoose Works ~

We first Make A Schema (Schema defines the structure of the document which is to be stored like 
    {
        "id": 1001,
        "first_name": "Dev",
        "last_name": "J",
        "email": "example@gmail.com",
        "gender": "male",
        "job_title": "Software Dev"
    } here id , first_name etc define the structure)
Using Schema we create a Model
Using Model we do CRUD Operations 

schema is the blueprint(or structure) of collection->it is like class in oop
but model provide methords to actually intract with database->it it like object in oop as the instance of schema

*/


const express = require("express")
const users = require("./MOCK_DATA.json")
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const app = express();

//Connection
mongoose.connect("mongodb://127.0.0.1:27017/express-server-example").then(() => console.log("MongoDB Connected")).catch((err) => console.log('Mongo Erro', err));

//Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
}, { timestamps: true }//This will automatically add createdAt and updatedAt fields to the schema
)

//Creating Model
const User = mongoose.model('user', userSchema); // explicitly naming the collection


//Middleware - Plugin
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log('Hello from middleware1');// Middle ware can Execute any code
    fs.appendFile("./logs.txt", `\nNew Request at Time ${Date.now()} with IP ${req.ip} and Method ${req.method} at path ${req.url}`, (err, data) => {
        req.myName = "dev"//middle ware can Make Changes to the request and the response objects and it would also be available in the next functions 
        next();// Call the next middleware in the stack
    })
})

app.use((req, res, next) => {
    console.log('Hello from middleware2 to ' + req.myName);
    //return res.end("Hey") //End the request-response cycle
    next();
})

//Routes
app.get("/users", async (req, res) => {
    const allDbUsers = await User.find({})
    const html = `
    <ul>
    
    ${ allDbUsers.map((item) => {
        return `<li>${item.firstName} - ${item.email}</li>`
    }).join("")}    
    </ul > `
    return res.send(html);
})

app.route("/api/users")
    .get(async (req, res) => {
        res.setHeader("X-myName","Dev J")//Setting Custom Headers always add X-<Custom Header Name> its a good practice
        console.log(req.headers);//Get Headers Sent by Req
        const allDbUsers = await User.find({})
        return res.json(allDbUsers);
    })
    .post(async (req, res) => {
            //Create New User
            const body = req.body;//Whatever data frontend send its in this body 
            if(
                !body ||
                !body.first_name||
                !body.email ||
                !body.gender||
                !body.job_title
            ){
                res.status(400)
                return res.json({msg:"All fields are Required ...(Last Name is Optional)"})
            }
            
            const result = await User.create({
                firstName:body.first_name,
                lastName:body.last_name,
                email:body.email,
                gender:body.gender,
                jobTitle:body.job_title
            })
            console.log('result',result);
            
            return res.status(201).json({msg:"success"});
    })

app.route("/api/users/:id")
    .get(async (req, res) => {
        const user= await User.findById(req.params.id);
        return res.json(user);
    })
    .patch(async (req, res) => {
        //Edit User
        //await User.findByIdAndUpdate(...)
        return res.json({ status: "pending" })
    })
    .delete(async (req, res) => {
        //Delete User
        //await User.findByIdAndDelete(...)
        return res.json({ status: "pending" })
    })


app.listen(8000, () => { console.log('Server Started as http://localhost:8000'); })