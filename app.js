var express = require("express"),
    app = express(),
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

var PORT = process.env.PORT || 3000;
var url = process.env.DATABASEURL || "mongodb://localhost/Daily_post";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function(){
    console.log("Connected to ", url);
}).catch(function(err) {
    console.log(err);
})
seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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

app.listen(PORT, function(){
    console.log("The Daily Post Server Has Started at ", PORT);
});