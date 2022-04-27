const express = require("express");
const router = express.Router();
const { search, download } = require("../controllers/onlineController");

router.get("/search", search);
// router.get("/can_download/:id", canDownload);
router.get("/download/:id", download);

module.exports = router;
