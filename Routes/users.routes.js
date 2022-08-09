const express = require('express');
const userRouter = express.Router();
const userController = require('./../Controllers/users.controllers');
const checkAuth = require('../Middleware/auth.middleware');
/**routes added  */

userRouter.post('/signup',(req,res) => userController.userRegister(req,res));
userRouter.post('/login',(req,res) => userController.userLogin(req,res));

module.exports = userRouter;

