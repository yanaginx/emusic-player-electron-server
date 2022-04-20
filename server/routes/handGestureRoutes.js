const express = require("express");
const router = express.Router();
const {
  enableHandGesture,
  disableHandGesture,
} = require("../controllers/handGestureController");

router.get("/enable", enableHandGesture);
router.get("/disable", disableHandGesture);

module.exports = router;
