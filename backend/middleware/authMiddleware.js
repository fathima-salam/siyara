import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

function getJwtSecret() {
    const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    if (typeof secret !== 'string' || secret.length === 0) {
        throw new Error('JWT_SECRET must be a non-empty string');
    }
    return secret;
}

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, getJwtSecret());
            req.user = await User.findById(decoded.id).select('-password');
            if (req.user?.isBlocked) {
              res.status(403);
              throw new Error('Account is blocked. Contact support.');
            }
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin };
