import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
      const token = req.headers.token ||
        (req.headers.authorization?.startsWith('Bearer ')
          ? req.headers.authorization.slice(7).trim()
          : null);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. Please log in again.',
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const expectedToken = `${process.env.ADMIN_EMAIL}${process.env.ADMIN_PASSWORD}`;

      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || decodedToken !== expectedToken) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required.',
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired admin token.',
      });
    }
};

export default adminAuth;
