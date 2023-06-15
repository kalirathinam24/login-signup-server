const express = require("express");
const bodyparser = require("body-parser");
const  mongoose = require("mongoose");
const cors = require("cors");
const userController = require("./controller/user")


const app = express();
const port= 5000;
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());


const DB = "mongodb://127.0.0.1:27017/testdb";

mongoose.connect(DB,{ 
    useNewUrlParser:true,useUnifiedTopology:true

},).then(()=>console.log("Successfully connected"))
.catch((err)=>{console.log(err)});


app.post('/signup', userController.signup);
app.post('/signin', userController.signin);
app.post('/send-otp', userController.sendotp);
app.post('/submit-otp', userController.submitotp);




app.listen(port,()=>{
    console.log(`server started at port no: ${port}`);
})