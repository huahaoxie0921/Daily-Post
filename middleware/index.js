var Post = require("../models/post");
var Comment = require("../models/comment");

// All the middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next()
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}

middlewareObj.checkPostOwnerShip = function(req, res, next){
    if (req.isAuthenticated()) {
        Post.findById(req.params.id, function(err, foundPost){
            if (err || !foundPost) {
                req.flash("error", "Post not found!");
                res.redirect("/index");
            } else {
                if (foundPost.author.id.equals(req.user._id)){ // author.id and user._id are different type
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnerShip = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment) {
                req.flash("error","comment NOT found!");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flahs("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;