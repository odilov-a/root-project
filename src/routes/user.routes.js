const { Router } = require("express");
const userController = require("../controllers/user.controller.js");
const userRouter = Router();

userRouter.post("/login", userController.loginUser);
userRouter.post("/register", userController.registerUser);

module.exports = userRouter;
