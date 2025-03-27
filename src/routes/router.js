const { Router } = require("express");
const userRoutes = require("./user.routes.js");
const fileRoutes = require("./file.routes.js");
const router = Router();

router.use("/users", userRoutes);
router.use("/files", fileRoutes);

module.exports = router;
