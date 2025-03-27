const { Router } = require("express");
const userController = require("../controllers/user.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const userRouter = Router();

userRouter.get("/all", authenticate, userController.getAllUsers);

userRouter.post("/login", userController.loginUser);
userRouter.post("/register", userController.registerUser);


module.exports = userRouter;
