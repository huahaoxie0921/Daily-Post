var express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Post = require("./models/post"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var postRoutes = require("./routes/posts"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/Daily_post");
mongoose.connect("mongodb+srv://frank:mongodb@daily-post-lqanc.mongodb.net/test?retryWrites=true&w=majority")
seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.listen(port, function(){
    console.log("The Daily Post Server Has Started!!!");
});

//Passport Configuration
app.use(require("express-session")({
    secret: "frank xie",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(postRoutes);
app.use(indexRoutes);
app.use(commentRoutes);