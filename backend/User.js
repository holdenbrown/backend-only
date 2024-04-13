const mongoose = require('mongoose');
const { Schema } = mongoose;


const PlantSchema = new Schema({
  name: { type: String, required: false },
  species: { type: String, required: false },
  image: { type: String, default: '../assets/spider-plant.png' },
  moisture: { type: Number, required: false },
  nitrogen: { type: Number, required: false },
  phosphorus: { type: Number, required: false },
  potassium: { type: Number, required: false },
  temperature: { type: Number, required: false }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  plants: [PlantSchema]
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
