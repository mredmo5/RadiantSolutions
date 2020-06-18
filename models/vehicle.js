var mongoose = require("mongoose");

var vehicleSchema = new mongoose.Schema({
    year: String,
    make: String,
    model: String,
    image: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
    description: String,
    price: String,
    sellprice: String,
    vin: String,
    miles: String,
    color: String,
    engine: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});

module.exports = mongoose.model("Vehicle", vehicleSchema);