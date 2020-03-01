var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Post = require("../models/post")

router.get("/", function(req, res){
    Post.find({},function(err,allpost){
        if (err){
            console.log(err);
        } else {
            res.render("posts/index", {posts: allpost});
        }
    });
    // res.render("posts/index")
});

// ===========
// Auth Routes
// ===========

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        } else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Daily Post, " + user.username);
                res.redirect("/index");
            });
        }
    });
});

// show log in form
router.get("/login", function(req, res){
    res.render("login");
});

// handleing login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login"
    }),function(req, res){
});

// log out
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/");
});

module.exports = router;