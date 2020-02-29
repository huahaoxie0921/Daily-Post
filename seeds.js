var mongoose = require("mongoose");
var Post = require("./models/post");
var Comment = require("./models/comment");

function seedDB(){
    // Remove all posts.
    Post.deleteMany({}, function(err){
        if (err){
            console.log(err);
        } else {
            // console.log("posts removed!!!");
            // Add a few campgrounds
            // data.forEach(function(seed){
            //     Post.create(seed, function(err, post){
            //         if (err){
            //             console.log(err);
            //         } else {
            //             console.log("add a post");
            //             // create a comment
            //             Comment.create({
            //                 text: " This place is great, but I wish there was Internet.",
            //                 author: "Homer"
            //             }, function(err, comment){
            //                 post.comments.push(comment);
            //                 post.save();
            //                 console.log("add a comment!");
            //             });
            //         }
            //     });
            // });
        }
    });
};

module.exports = seedDB;