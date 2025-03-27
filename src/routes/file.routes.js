const { Router } = require("express");
const fileController = require("../controllers/file.controller.js");
const { authenticate } = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/upload.js");
const fileRouter = Router();

fileRouter.post("/upload", authenticate, upload.single("pdfFile"),fileController.uploadFile);

fileRouter.get("/received", authenticate, fileController.getReceivedFiles);

fileRouter.post("/sign/:id", authenticate, fileController.signFile);
fileRouter.post("/verify/:id", authenticate, fileController.verifyFile);

module.exports = fileRouter;
