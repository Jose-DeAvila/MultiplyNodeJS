const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String, 
  },
  email: {
    type: String, 
    unique: true, 
    index: true, 
    dropDups: true,
  },
  password: {
    type: String, 
  },
  peopleLoans: {
    type: [mongoose.Schema.Types.ObjectId], 
    default: [] 
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
