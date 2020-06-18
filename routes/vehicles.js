var express = require("express");
var router = express.Router();
var Vehicle = require("../models/vehicle");
var middleware = require("../middleware");
var Busboy = require("busboy");
var expressfileupload = require("express-fileupload");

//file upload

//multer
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

//cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'radiantauto', 
  api_key: '413357176465871', 
  api_secret: 'AU64sk0nNowGnnKFqXHXX_nq_w4'
});


router.get("/", function(req, res){
    Vehicle.find({}, function(err, allVehicles){
        if(err) {
            console.log(err);
        } else {
            res.render("vehicles/index" , {vehicles:allVehicles, currentUser: req.user})
        }
    });

});


router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.vehicle.image = result.secure_url;
        // add author to campground
        req.body.vehicle.author = {
          id: req.user._id,
          username: req.user.username
        }
        Vehicle.create(req.body.vehicle, function(err, vehicle) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/vehicles/' + vehicle.id);
        });
      });

    });




router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("vehicles/new");
});

//SHOW
router.get("/:id", function(req, res){
    Vehicle.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            console.log(err);
        } else {
            res.render("vehicles/show", {vehicle: foundcamp});
        }
    });

    
});

//Edit Campr
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
    Vehicle.findById(req.params.id, function(err, foundcamp){
        if(err){
            res.redirect("/vehicles");
        } else {
            res.render("vehicles/edit", {vehicle: foundcamp})
        }
    });

});

//Update camp
router.put("/:id", middleware.isLoggedIn, function(req, res){
    //fin and update the correct camp
    Vehicle.findByIdAndUpdate(req.params.id, req.body.Vehicle, function(err, updatecamp){
        if(err){
            res.redirect("/vehicles");
        } else {
            res.redirect("/vehicles/" + req.params.id);
        }
    });
    //redirect
})

//Destroy
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Vehicle.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/vehicles");
        } else {
            res.redirect("/vehicles")
        }
    });
});




module.exports = router;