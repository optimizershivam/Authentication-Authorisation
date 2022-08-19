
const express = require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const {connection} = require("./config")
const UserModel = require("./models/User.model")

const authentication = require("./middlewares/authentication")
const authorisation = require("./middlewares/authorisation")

const productController = require("./controller/product.controller")
const passport = require("./google-oauth")


require('dotenv').config()

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.send('<a href="https://github.com/login/oauth/authorize?client_id=68b4be9de68c08ce3f5d">Login via Github</a>')
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session:false }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
    return res.send("hey")
  });


app.post("/signup", async(req, res) => {
    let {email, password, age} = req.body;
    // password = password + "abc123xyz"
    

    await bcrypt.hash(password, 8, function(err, hash) {
        if(err){
            return res.send("Sign up failed, please try again later")
        }
        const user = new UserModel({email, password:hash, age})
        user.save()
        return res.send("Sign up successfull")
    });
    
})


app.post("/login", async(req, res) => {
    let {email, password} = req.body;
    
    const user = await UserModel.findOne({email}) 
    if(!user){
        return res.send("invalid credentials")
    }
    const hashed_password = user.password

    await bcrypt.compare(password, hashed_password, function(err, result) {
        if(err){
            return res.send("Please try again later")
        }

        if(result==true){
            const token = jwt.sign({ email: user.email, age:user.age, _id : user._id }, process.env.jwt_secret_key);
            return res.send({message : "Login successfull", token : token})
        }
        else{
            return res.send("Invalid credentials")
        }
    }); 
   
})

app.get("/profile/:id", authentication, async (req, res) => {
    const id = req.params.id
    try{
        const user = await UserModel.find({_id : id})
        return res.send(user)
    }
    catch{
        return res.send("not found")
    }
})



app.get("/homepage", (req, res) => {
    res.send("homepage")
})

app.use("/products", productController)

app.listen(8080, async () => {
    try{
        await connection
        console.log("connected to db")
    }
    catch(err){
        console.log(err)
    }
    console.log("Listening on port 8000")
})




//Client - 68b4be9de68c08ce3f5d


