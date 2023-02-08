const mongoose = require('mongoose');
const {isEmail}=require('validator');
const bcrypt= require('bcrypt')

const userSchema= new mongoose.Schema({
email:{
    type:String,
    required:[true,'Please enter an email'],
    unique:true,
    lowercase:true,
    validate:[isEmail,'Please enter a valid email']
},
username:{
    type:String,
    required:[true,'Please enter a username'],
    unique:true,
},
name:{
    type:String,
    required:[true,'Please enter a name'],
},
password:{
    type:String,
    required:[true,'Please enter a password'],
    minlength:[6,'Minimum password length is 6 characters']
},
})
//fires a function before save to database
userSchema.pre("save", async function (next) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(this.password, salt);
      this.password = passwordHash;
      next();
    } catch (error) {
      next(error);
    }
  });
  //static method for login
  userSchema.statics.login=async function(email,password){
    const user = await this.findOne({email});
    if(user){
      const auth=await bcrypt.compare(password,user.password);
      if (auth){
        return user;
      }
      throw Error('incorrect password')
    }
    throw Error('incorrect email')
  }

const User=mongoose.model('user',userSchema);

module.exports=User;