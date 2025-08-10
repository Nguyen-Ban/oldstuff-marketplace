const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token received:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    console.log('Decoded token:', decoded);
    req.user = await User.findByPk(decoded.id);
    console.log('Decoded user payload:', req.user);
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
