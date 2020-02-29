var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var middleware = require("../middleware/index.js");

router.get("/index", function(req, res){
    // Get all posts from DB
    Post.find({},function(err,allpost){
        if (err){
            console.log(err);
        } else {
            res.render("posts/index", {posts: allpost});
        }
    });
});

router.get("/index/new", middleware.isLoggedIn, function(req,res){
    res.render("posts/new");
});

router.post("/index", middleware.isLoggedIn, function(req, res){
    // get data from form and add to posts array
    var name = req.body.name;
    var url = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // console.log(req.user);
    Post.create({
        name: name,
        image: url,
        author: author,
        description: description
    },function(err, newcreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/index");
        }
    });
});

router.get("/index/:id", function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if (err || !foundPost){
            req.flash("error", "Post NOT FOUND");
            res.redirect("back");
        } else {
            res.render("posts/show", {post: foundPost});
        }
    });
});

// EDIT POST
router.get("/index/:id/edit", middleware.checkPostOwnerShip, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        res.render("posts/edit", {post: foundPost});
    });
});

// UPDATE POST
router.put("/index/:id", middleware.checkPostOwnerShip, function(req, res){
    // find and update the correct campground
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if (err) {
            res.redirect("/index");
        } else {
            res.redirect("/index/" + req.params.id);
        }
    });
});

// DELETE POST
router.delete("/index/:id", middleware.checkPostOwnerShip, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/index");
        } else {
            res.redirect("/index");
        }
    });
});

module.exports = router;