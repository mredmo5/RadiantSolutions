var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");



router.get("/", function(req, res){
    res.render("landing");
});






//auth routes

// router.get("/register", function(req, res){
//     res.render("register");
// });

//sign up logic
// router.post("/register", function(req, res){
    
// var newUser = new User({username: req.body.username});
// User.register(newUser, req.body.password, function(err, user){
//     if(err){
//         req.flash("error", err.message);
//         res.render("register");
//     }
//     passport.authenticate("local")(req, res, function(){
//         req.flash("success", "Welcome to Radiant Auto " + user.username);
//         res.redirect("/vehicles");
//     })
// })

// });



//show login form
router.get("/login", function(req, res){
    res.render("login");
});


//log in logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/vehicles",
        failureRedirect: "/login"
    }), function(req, res){
    res.send("login")
});

router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged you out")
    res.redirect("/vehicles");
});

//show login form
router.get("/about", function(req, res){
    res.render("about");
});



module.exports = router;