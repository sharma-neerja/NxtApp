const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ownerSchema = new Schema({
    email: {
        type: String,
        require: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    }    
  });
  
const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;



