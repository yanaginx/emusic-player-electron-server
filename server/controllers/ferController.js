const asyncHandler = require("express-async-handler");
const { PythonShell } = require("python-shell");

// @desc    Get emotion from camera
// @route   GET /api/fer
// @access  Public (for now, will be private later)
const getEmotion = asyncHandler(async (req, res) => {
  let pyshell = new PythonShell("./server/python_scripts/fer.py", {
    mode: "json",
  });

  pyshell.on("stderr", function (stderr) {
    console.log("🚀 ~ file: ferController.js ~ line 49 ~ stderr", stderr);
  });

  pyshell.on("message", function (message) {
    return res.status(200).json(message);
  });
});

module.exports = { getEmotion };
