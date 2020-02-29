var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

router.get("/index/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {post: foundPost});
        }
    });
});

router.post("/index/:id/comments", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err){
            req.flsah("error", "Comment not Found")
            console.log(err);
            res.redirect("/index");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundPost.comments.push(comment);
                    foundPost.save();
                    req.flash("success", "Successfully add a comment!");
                    res.redirect("/index/"+foundPost._id);
                }
            });
        }
    });
});

router.get("/index/:id/comments/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res){
    // var post_id = req.params.id;
    Post.findById(req.params.id, function(err, foundPost){
        if (err || !foundPost) {
            req.flash("error", "Post NOT found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment){
                req.flash("error", "comment NOT FOUND!");
                res.redirect("back");
            } else {
                res.render("comments/edit", {post_id:req.params.id, comment:foundComment});
            }
        });
    });
});

router.put("/index/:id/comments/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/index/" + req.params.id);
        }
    });
});

router.delete("/index/:id/comments/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            console.log(err);
            res.redirect("/index/"+req.params.id);
        } else {
            req.flash("success", "You Successfully DELETE the comment!");
            res.redirect("/index/"+req.params.id);
        }
    });
});

module.exports = router;