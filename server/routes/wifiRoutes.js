const express = require("express");
const router = express.Router();
const {
  scanNetworks,
  connectToNetwork,
  disconnectFromNetwork,
} = require("../controllers/wifiController");

router.get("/", scanNetworks);
router.post("/connect", connectToNetwork);
router.get("/disconnect", disconnectFromNetwork);

module.exports = router;
