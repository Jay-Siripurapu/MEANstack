const express = require('express');
const bodyParser = require('body-parser');
const path=require("path");
const postroutes=require('./routes/posts');
const userroutes=require("./routes/user");
const mongoose = require("mongoose");
const app=express();
mongoose.connect("mongodb+srv://jayath:Sissy2304@mean-nwnsm.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true})
.then(() => {
  console.log("connected");
})
.catch(()=> {
  console.log("connection failed");
});
// usenewurlparser is for handeling the proxys password mistakes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/jay",postroutes);
app.use("/api/user",userroutes);

module.exports = app;
