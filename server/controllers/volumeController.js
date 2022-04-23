const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");
const loudness = require("loudness");

// @desc    Get system volume
// @route   GET /api/volume/
// @access  Public
const getVolume = asyncHandler(async (req, res) => {
  try {
    const vol = await loudness.getVolume();
    res.status(200).json({
      volume: vol,
    });
  } catch (err) {
    res.status(400).json({
      message: "Somethings went wrong!",
    });
  }
});

// @desc    Set system volume
// @route   POST /api/volume/
// @access  Public
const setVolume = asyncHandler(async (req, res) => {
  try {
    const { volume } = req.body;
    await loudness.setVolume(volume);
    res.status(200).json({
      volume: volume,
    });
  } catch (err) {
    res.status(400).json({
      message: "Somethings went wrong!",
    });
  }
});

module.exports = { getVolume, setVolume };
