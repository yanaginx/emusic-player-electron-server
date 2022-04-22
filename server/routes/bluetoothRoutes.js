const express = require("express");
const router = express.Router();
const {
  testArgv,
  scanDevices,
  connectDevice,
  disconnectDevice,
} = require("../controllers/bluetoothController");

router.get("/", scanDevices);
router.post("/connect", connectDevice);
router.post("/disconnect", disconnectDevice);

module.exports = router;
