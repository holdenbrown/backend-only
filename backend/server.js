const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes'); 
require('dotenv').config();


const app = express();

app.use(bodyParser.json());
app.use('/user', authRoutes);

const mongoURI = process.env.MONGO_URI;;

mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB Connected');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1); // Exit the application if MongoDB connection fails
});
