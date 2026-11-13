import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    const token =
      req.headers.token ||
      (authorization?.startsWith('Bearer ')
        ? authorization.slice(7).trim()
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login first to place order!',
      });
    }

    const tokenDecode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: user ID is missing.',
      });
    }

    // Ensure req.body exists before assigning userId.
    req.body = req.body || {};

    req.body.userId = tokenDecode.id;

    return next();
  } catch (error) {
    console.error('Authentication error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

export default authUser;