const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE5LCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4NzQ4MTIsImV4cCI6MTczNDg3ODQxMn0.ReJirubP-0Bb-7TI0QM5LfUjg6hpAPEuaFUcVlKdGmc';
const decoded = jwt.decode(token);
console.log('Розшифрований токен:', decoded);
