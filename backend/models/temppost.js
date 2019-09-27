const express=require("express");
const Post = require("../models/post");
const multer= require("multer");
const checkAuth = require("../middleware/check-auth");
const router=express.Router();
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post("",checkAuth,multer({ storage: storage }).single("image"),( req, res, next) =>{
  const url = req.protocol+"://"+req.get("host");
  const post= new Post({

    title :req.body.title,
    content :req.body.content,
    imagePath: url+"/images/"+req.file.filename,
    creator:req.userdata.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message:("post added sucessfully"),
      post :{
        // insted of commented lines for coping all the peoperties we can do
        ...createdPost,
        id:createdPost._id,
        // title:createdPost.title,
        // content:createdPost.content,
        // imagePath:createdPost.imagePath
      }
    });
  })
  .catch(error=>{
     res.status(500).json({
       message:"creating user failed"
     });
  });

  });
  router.put("/:id",checkAuth,multer({ storage: storage }).single("image"),(req,res,next) =>{
    let imagePath=req.body.imagePath;
    if(req.file)
    {
      const url = req.protocol+"://"+req.get("host");
      imagePath=url+"/images/"+req.file.filename
    }
    const post = new Post({
      _id :req.body.id,
      title:req.body.title,
      content:req.body.content,
      imagePath: imagePath,
      creator:req.userdata.userId
    });
    console.log(post);
    Post.updateOne({ _id:req.params.id,creator:req.userdata.userId },post).then(result =>{
      if(result.nModified>0)
      {
        res.status(200).json({ message: "update sucessfull"});
      }else{
        res.status(401).json({ message: "not authorized"});
      }

    }).catch(error=>{
        res.status(500).json({
          message:"coudnt update post"
        });
    });
  });
  router.get("",( req, res, next) =>{
    const pageSize= +req.query.pagesize;
    const curpage= +req.query.page;
    const postQuery=Post.find();
    let fetchedposts;
    if(pageSize && curpage)
    {
      postQuery.skip(pageSize*(curpage-1)).limit(pageSize);
    }
    postQuery.then(documents => {
      fetchedposts=documents;
      return Post.countDocuments();
    }).then(count =>{
      res.status(200).json({
        message :"posts fetched sucessfully",
        posts   :fetchedposts,
        maxposts:count
      });
    });

  });
  router.get("/:id",(req,res,next)=>{

    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    }).catch(error=>{
      res.status(500).json({
        message:"coudnt update post"
      });
  });
  });

  router.delete("/:id",checkAuth,( req, res, next) =>{
     Post.deleteOne({ _id: req.params.id,creator:req.userdata.userId }).then(
       result=>{
        if(result.n>0)
        {
          res.status(200).json({ message: "post deleted" });
        }else{
          res.status(401).json({ message: "not authorized"});
        }

       }).catch(error=>{
        res.status(500).json({
          message:"coudnt update post"
        });
    });
  });
module.exports = router;
