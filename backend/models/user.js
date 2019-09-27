const mongoose = require("mongoose");

const uniquevalid=require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
email : { type:String , required:true, unique:true },
password:{type:String, required:true}
});
userSchema.plugin(uniquevalid);
module.exports = mongoose.model("user",userSchema);
