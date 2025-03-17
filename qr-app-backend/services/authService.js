const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const User = require('../models/User');
const Child = require('../models/Child');
const { JWT_SECRET } = require('../config/constants');

const registerChild = async (name, parent_mail, username, parent_contact, password) => {
  // Check if the uname already exists
  const existingUser = await User.findByUsername(username);
  const existingChild = await Child.findByUsername(username);

  if (existingUser || existingChild) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Inserting:', [name, parent_mail, username, parent_contact, password, null]);
  const child = await Child.create(name, parent_mail, username, parent_contact, hashedPassword, null);
  
  return { ...child };
};

const loginUser = async (username, password, deviceToken) => {
  // Check the user table first
  const user = await User.findByUsername(username);
  let role = 'parent';

  if (!user) {
    // If not found in the user table, check the child_info table
    const child = await Child.findByUsername(username);
    if (!child) {
      throw new Error('Invalid username or password');
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, child.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    role = 'parent'; // Child is treated as a parent

    // Update the parent's device token in the database
    await db.query('UPDATE child_info SET parent_device_token = ? WHERE username = ?', [deviceToken, username]);
  } else {
    // Compare the password for admin/caretaker
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }
    role = user.role; // admin or caretaker
  }

  // Generate a JWT token
  const token = jwt.sign({ username, role }, JWT_SECRET, { expiresIn: '1h' });

  return { role, token };
};

module.exports = { registerChild, loginUser };