import express from 'express';
const router = express.Router();
import {
    UsersRegister,
    UserLogin,
    verifyEmailController,
    forgotPasswordController,
    resetPasswordController,
    getUserController,
    updateUserController,
    Logout,
    googleLoginController,
    checkEmailController,
    checkUsernameController,
    deleteUserController
} from '../controller/user.controller.js';
import validateToken from '../middlewares/AuthMiddleware.js';

router.post('/', UsersRegister);
router.post('/login', UserLogin);   
router.post('/verify-email', verifyEmailController);
router.post('/forgot-password', forgotPasswordController);   
router.post('/reset-password',resetPasswordController);
router.post('/oauth/google', googleLoginController);
router.get('/',validateToken,getUserController);
router.put('/update',validateToken, updateUserController);//ok
router.delete('/logout',validateToken, Logout);  //ok
router.get('/checkEmail',checkEmailController);
router.get('/checkUsername',checkUsernameController);
router.delete('/delete',validateToken,deleteUserController);
export default router;