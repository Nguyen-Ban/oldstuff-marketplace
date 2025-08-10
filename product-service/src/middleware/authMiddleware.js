const axios = require('axios');

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.error('[AUTH ERROR] No Authorization header provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  console.log('[AUTH] Authorization header received:', token);

  try {
    // Nếu user-service yêu cầu Bearer <token>, giữ nguyên
    // Nếu chỉ cần token, thì tách ra như sau:
    // const token = authHeader.split(' ')[1];

    const response = await axios.get(
      `${process.env.USER_SERVICE_URL || 'http://localhost:3001'}/verify-seller`,
      {
        headers: { Authorization: token }
      }
    );

    console.log('[AUTH] User verification response:', response.data);

    req.user = response.data.user; // Lưu thông tin user vào req
    next();
  } catch (error) {
    console.error('[AUTH ERROR] Failed to verify token');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(401).json({
      message: 'Unauthorized',
      details: error.response?.data || error.message
    });
  }
};
