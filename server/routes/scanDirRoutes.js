const express = require("express");
const router = express.Router();
const { scanDirAndCopy } = require("../controllers/scanDirController");

router.get("/", scanDirAndCopy);

module.exports = router;
