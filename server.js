//exporting all required library by creating constant variables

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

//connecting to the database "registration" created in postgresql
//knex is used to create a link b/w the webpage to the database for transformation of info

const db = knex({
    client:'pg',
    connection:{
        host: '127.0.0.1',
        user: 'postgres',
        password: 'root',
        database: 'registration'
    }})

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

//to set internal linking of login ,registration ,home page 

app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
})

//creating post method to invoke the registration details of users 

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

//creating a post method to get login credentials and check with the data stored in datatbase

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect'); //to create a pop up when user's data not found in database
        }
    })
})

app.listen(3000, (req, res) => {
    console.log('listening on port 3000......')
})


//install all prequesites using the command below 
//npm install
// run your server using the command   npm start 