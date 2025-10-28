/*
   Middleware functions that have accesss to the request object (req),
   the response object (res), and the next middleware function in the 
   application’s request-response cycle.  The next middleware function is commonly denoted by a variable named next.

   Uses of a Middlware-
   -> Execute any code
   -> Make Changes to the request and the response objects 
   -> End the request-response cycle
   -> Call the next middleware in the stack

*/

const express = require("express")
const users = require("./MOCK_DATA.json")
const fs = require("fs")
const app = express();


app.use(express.urlencoded({ extended: false }))

app.use((req,res,next)=>{
    console.log('Hello from middleware1');// Middle ware can Execute any code
    fs.appendFile("./logs.txt",`\nNew Request at Time ${Date.now()} with IP ${req.ip} and Method ${req.method} at path ${req.url}`,(err,data)=>{
        req.myName="dev"//middle ware can Make Changes to the request and the response objects and it would also be available in the next functions 
        next();// Call the next middleware in the stack
    }) 
})

app.use((req,res,next)=>{
    console.log('Hello from middleware2 to '+req.myName);
    //return res.end("Hey") //End the request-response cycle
    next();
})
//Routes
app.get("/users", (req, res) => {
    const html = `
    <ul>
         ${users.map((item) => {
        return `<li>${item.first_name}</li>`
    }).join("")}    
    </ul>`
    return res.send(html);
})

app.route("/api/users")
    .get((req, res) => {
        res.setHeader("X-myName","Dev J")//Setting Custom Headers always add X-<Custom Header Name> its a good practice
        console.log(req.headers);//Get Headers Sent by Req
        return res.json(users);
    })
    .post((req, res) => {
        //Create New User
        const body = req.body;//Whatever data frontend send its in this body 
        users.push({ id: users.length + 1, ...body })
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            return res.json({ status: "success", id: users.length })
        })
    })

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((item) => { return item.id === id });
        return res.json(user);
    })
    .patch((req, res) => {
        //Edit User
        return res.json({ status: "pending" })
    })
    .delete((req, res) => {
        //Delete User
        return res.json({ status: "pending" })
    })


app.listen(8000, () => { console.log('Server Started as http://localhost:8000'); })