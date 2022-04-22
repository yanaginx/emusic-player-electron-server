const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");

// @desc    Scanning usb devices and fetch files
// @route   GET /api/scan
// @access  Public (for now, will be private later)
const scanDirAndCopy = asyncHandler(async (req, res) => {
  let output;
  const ferOutput = spawn("python", ["./server/python_scripts/scan_usb.py"]);
  ferOutput.stderr.on("data", (data) => {
    console.log(data.toString());
  });
  ferOutput.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  ferOutput.on("close", (code) => {
    if (code === 0) {
      res.status(200).json({
        message: "Successfully copied file!",
      });
    } else {
      res.status(400).json({
        code: code,
        message: "Somethings went wrong!",
      });
    }
  });
});

module.exports = { scanDirAndCopy };
