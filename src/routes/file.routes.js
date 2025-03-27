const { Router } = require("express");
const fileController = require("../controllers/file.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const multer = require("multer");
const fileRouter = Router();

const upload = multer({ dest: "uploads/" });

fileRouter.post("/upload", authenticate, upload.single("file"),fileController.uploadFile);
fileRouter.get("/received", authenticate, fileController.getReceivedFiles);
fileRouter.post("/sign", authenticate, fileController.signFile);
fileRouter.post("/verify", authenticate, fileController.verifyFile);

module.exports = fileRouter;
