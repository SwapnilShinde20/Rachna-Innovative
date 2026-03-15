console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
const fs = require('fs');
console.log('Models dir exists:', fs.existsSync('./models'));
console.log('User.js exists:', fs.existsSync('./models/User.js'));

try {
  console.log('Requiring Mongoose...');
  const mongoose = require('mongoose');
  console.log('Mongoose version:', mongoose.version);
} catch (e) {
  console.error('Failed to load mongoose:', e.message);
}

try {
  console.log('Requiring ./models/User...');
  const User = require('./models/User');
  console.log('User loaded:', User.modelName);
} catch (e) {
  console.error('Failed to load User:', e);
}
