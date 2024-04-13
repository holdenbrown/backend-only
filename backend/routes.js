const express = require('express');
const router = express.Router();
const User = require('./User');
const mongoose = require('mongoose');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('User already exists');
    }
    user = new User({ username, password });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send('Server error');
    console.error(error);
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username }).populate('plants');
    if (!user) {
      return res.status(400).send('Invalid Credentials');
    }
    // Compare the provided password with the stored password (stored in plain text)
    if (user.password !== password) {
      return res.status(400).send('Invalid Credentials');
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send('Server error');
    console.error(error);
  }
});

// create a plant for a user
router.post('/user/:userId/plant', async (req, res) => {
  const { userId } = req.params;
  const { name, species, image, moisture, nitrogen, phosphorus, potassium, temperature } = req.body;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Add new plant with all attributes
      user.plants.push({
        name,
        species,
        image: image || '../assets/spider-plant.png',
        moisture,
        nitrogen,
        phosphorus,
        potassium,
        temperature
      });

      await user.save();
      res.status(201).json({
        message: 'Plant added successfully',
        plant: user.plants[user.plants.length - 1]
      });
  } catch (error) {
      console.error('Error adding plant to user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT endpoint to update a plant for a user based on plant name
router.put('/user/:userId/plant', async (req, res) => {
    const { userId } = req.params;
    const { name, newName, newSpecies, newImage, newMoisture, newNitrogen, newPhosphorus, newPotassium, newTemperature } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the plant by name
        const plant = user.plants.find(p => p.name === name);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        // Update plant details
        plant.name = newName || plant.name;
        plant.species = newSpecies || plant.species;
        plant.image = newImage || plant.image;
        plant.moisture = newMoisture || plant.moisture;
        plant.nitrogen = newNitrogen || plant.nitrogen;
        plant.phosphorus = newPhosphorus || plant.phosphorus;
        plant.potassium = newPotassium || plant.potassium;
        plant.temperature = newTemperature || plant.temperature;

        await user.save();
        res.status(200).json({ message: 'Plant updated successfully', plant });
    } catch (error) {
        console.error('Error updating plant:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Fetch all users with their plants populated
router.get('/users', async (req, res) => {
  try {
    const usersWithPlants = await User.find().populate('plants');
    res.json(usersWithPlants);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
});

// Fetch a user with their plants populated
router.get('/:userId', async (req, res) => {
  try {
    const userWithPlants = await User.findById(req.params.userId).populate('plants');
    if (!userWithPlants) {
      return res.status(404).send('User not found');
    }
    res.json(userWithPlants);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server Error');
  }
});




// DELETE a user by ID http://localhost:3000/user/66158829292ad7c66325c8b7
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user exists, delete it
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});


module.exports = router;
