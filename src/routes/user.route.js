import express from 'express';
import {verifyJWT} from '../middleware/auth.middleware.js'
const router = express.Router();
import {
    register,
    loginUser,
    logoutUser,
} from '../controllers/user.controller.js'

router.route('/register')
.post(register);

router.route('/login')
.post(loginUser);

router.route('/logout')
.get(verifyJWT,logoutUser);

export default router;