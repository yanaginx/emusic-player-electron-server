const express = require("express");
const router = express.Router();
const {
  getPairedDevice,
  scanDevices,
  connectDevice,
  disconnectDevice,
} = require("../controllers/bluetoothController");

router.get("/", scanDevices);
router.get("/paired", getPairedDevice);
router.post("/connect", connectDevice);
router.post("/disconnect", disconnectDevice);

module.exports = router;
