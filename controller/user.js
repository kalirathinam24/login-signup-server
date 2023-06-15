const UserModel = require('../models/user')
const nodemailer = require('nodemailer')

module.exports.signup = (req,res) => {
    console.log(req.body)

    const newUser = new UserModel({
         email: req.body.email, 
         password: req.body.password
        });

   newUser.save().then(()=>{
    res.send({code:200 , message:"Signup success"})
   }).catch((err)=>{
      res.send({code:500, message:"signup err"})
   })

}

module.exports.signin = (req,res) => {
   console.log(req.body.email)

   //email and password match

   UserModel.findOne({email: req.body.email})
   .then(result=>{
      console.log(result, "1")

      //password match 
      if (result.password !== req.body.password) {
         res.send({ code:404, message:"password wrong"})
      } else{
         res.send({
            email: result.email,
            code:200,
            message:"user found",
            token:"kkk" 
         })
     
      }
   })
   .catch( err=>{
      res.send({code:500, message:"user not found"})
})

}

module.exports.sendotp = async (req, res) => {
   console.log(req.body)
   const _otp = Math.floor(100000 + Math.random() * 900000)
   console.log(_otp)
   let user = await UserModel.findOne({ email: req.body.email })
  
   // send to user mail
   if (!user) {
       res.send({ code: 500, message: 'user not found' })
   }

   let testAccount = await nodemailer.createTestAccount()

   let transporter = nodemailer.createTransport({
       host: "smtp.ethereal.email",
       port: 587,
       secure: false,
       auth: {
           user: testAccount.user,
           pass: testAccount.pass
       }
   })



   let info = await transporter.sendMail({
       from: 'kalirathinam24@gmail.com',
       to: req.body.email, 
       subject: "OTP",
       text: String(_otp),
       html: `<html>
           < body >
           Hello and welcome
       </ >
      </html > `,
   })

   if (info.messageId) {

       console.log(info, 18)
       UserModel.updateOne({ email: req.body.email }, { otp: _otp })
           .then(result => {
               res.send({ code: 200, message: 'otp send' })
           })
           .catch(err => {
               res.send({ code: 500, message: 'Server err' })

           })

   } else {
       res.send({ code: 500, message: 'Server err' })
   }
}

    

module.exports.submitotp = (req,res) => {
   console.log('req.body')

UserModel.findOne({otp : req.body.otp}).then(result=>{

      
      UserModel.updateOne({email: result.email},{password : req.body.password})
      .then(result=>{
         //password updated
         res.send({code:200, message:'password updated'})
      }).catch(err=>{
         res.send({code:500, message:"server err"})
      })

      
   
     
   }).catch(err=>{
      res.send({code:500, message:"otp is wrong"})
   })

     


}