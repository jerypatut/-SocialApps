import jwt from 'jsonwebtoken';

const validateToken = (_err, req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token required. User not logged in!' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!decoded || !decoded.username || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
};

export default validateToken;
