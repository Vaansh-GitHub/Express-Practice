//Building a REST API
/*
   GET /users - HTML Document Render
   GET /api/users - List all the users this is for making the server hybrid i.e. also available for mobile devices
   GET /api/users/1 - Get the user with id 1
   GET /api/users/2 - Get the user with id 2

   POST /api/users - create new user

   PATCH /users/1 - Edit the user with ID 1

   DELETE /users/1 - Delete the user with ID 1

   To make fake data use this website https://www.mockaroo.com/

*/
const express = require("express")
const users = require("./MOCK_DATA.json")
const fs = require("fs")
const app = express();


app.use(express.urlencoded({ extended: false }))
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