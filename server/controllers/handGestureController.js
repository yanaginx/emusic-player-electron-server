const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");
let handGesture = null;

// @desc    Enable hand gesture mode
// @route   GET /api/hand_gesture/enable
// @access  Public
const enableHandGesture = asyncHandler(async (req, res) => {
  handGesture = spawn("python", ["./server/python_scripts/hand_gesture.py"]);
  handGesture.on("spawn", () => {
    console.log("Hand Gesture Mode Enabled");
    res.status(200).json({ message: "Hand gesture open successfully" });
  });
  handGesture.on("error", (err) => {
    res.status(500).json({
      message: err,
    });
  });
});

// @desc    Disable hand gesture mode
// @route   GET /api/hand_gesture/disable
// @access  Public
const disableHandGesture = asyncHandler(async (req, res) => {
  if (handGesture) {
    handGesture.kill();
    handGesture.on("close", (code, signal) => {
      if (signal === "SIGTERM") {
        console.log("Hand Gesture Mode Disabled");
        res.status(200).json({ message: "Hand gesture closed successfully" });
      } else {
        res.status(400).json({
          code: code,
          message: "Somethings went wrong!",
        });
      }
    });
  }
});

module.exports = { enableHandGesture, disableHandGesture };
