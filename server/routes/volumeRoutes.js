const express = require("express");
const router = express.Router();
const { getVolume, setVolume } = require("../controllers/volumeController");

router.get("/", getVolume);
router.post("/", setVolume);

module.exports = router;
