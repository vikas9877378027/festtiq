import express from 'express'
import { register,login,isAuth,logout,getAllUsers,updateProfile,getFavorites,addFavorite,removeFavorite,toggleFavorite,oauthLogin } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import { authSeller } from '../middlewares/authSeller.js';
import { uploadAvatar } from '../middlewares/uploadImage.js';
const userRouter =express.Router();


userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.post('/oauth-login',oauthLogin) // OAuth login (Google, Facebook, Apple)
userRouter.get('/is-auth',authUser,isAuth)
userRouter.get('/logout',authUser,logout)
userRouter.get('/list',authSeller,getAllUsers) // Admin only
userRouter.put('/update-profile',authUser,uploadAvatar,updateProfile) // Update profile

// Favorites routes
userRouter.get('/favorites',authUser,getFavorites) // Get all favorites
userRouter.post('/favorites/add',authUser,addFavorite) // Add to favorites
userRouter.post('/favorites/remove',authUser,removeFavorite) // Remove from favorites
userRouter.post('/favorites/toggle',authUser,toggleFavorite) // Toggle favorite

export default userRouter;
