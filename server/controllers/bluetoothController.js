const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");

// @desc    Test argv
// @route   POST /api/bluetooth/test
// @access  Public
const testArgv = asyncHandler(async (req, res) => {
  const { mac } = req.body;
  let output;
  const bluetoothOutput = spawn("python3", [
    "./server/python_scripts/test_argv.py",
    mac,
  ]);
  bluetoothOutput.stderr.on("data", (data) => {
    console.log(data.toString());
  });
  bluetoothOutput.stdout.on("data", (data) => {
    output = JSON.parse(data);
  });
  bluetoothOutput.on("close", (code) => {
    if (code === 0) {
      res.status(200).json(output);
    } else {
      res.status(400).json({
        message: "Somethings went wrong!",
      });
    }
  });
});

// @desc    Scan bluetooth devices
// @route   GET /api/bluetooth
// @access  Public
const scanDevices = asyncHandler(async (req, res) => {
  let output;
  const bluetoothOutput = spawn("python3", [
    "./server/python_scripts/bluetooth_scan.py",
  ]);
  bluetoothOutput.stderr.on("data", (data) => {
    console.log(data.toString());
  });
  bluetoothOutput.stdout.on("data", (data) => {
    output = JSON.parse(data);
  });
  bluetoothOutput.on("close", (code) => {
    if (code === 0) {
      res.status(200).json(output);
    } else {
      res.status(400).json({
        message: "Somethings went wrong!",
      });
    }
  });
});

// @desc    Connect bluetooth devices
// @route   POST /api/bluetooth/connect
// @access  Public
const connectDevice = asyncHandler(async (req, res) => {
  let output;
  const { mac } = req.body;
  const bluetoothOutput = spawn("python3", [
    "./server/python_scripts/bluetooth_connect.py",
    mac,
  ]);
  bluetoothOutput.stderr.on("data", (data) => {
    console.log(data.toString());
  });
  bluetoothOutput.stdout.on("data", (data) => {
    output = JSON.parse(data);
  });
  bluetoothOutput.on("close", (code) => {
    if (code === 0) {
      if (output.status === "successful") {
        res.status(200).json(output);
      } else {
        res.status(400).json(output);
      }
    } else {
      res.status(400).json({
        message: "Somethings went wrong!",
      });
    }
  });
});

// @desc    Disconnect bluetooth devices
// @route   POST /api/bluetooth/disconnect
// @access  Public
const disconnectDevice = asyncHandler(async (req, res) => {
  let output;
  const { mac } = req.body;
  const bluetoothOutput = spawn("python3", [
    "./server/python_scripts/bluetooth_disconnect.py",
    mac,
  ]);
  bluetoothOutput.stderr.on("data", (data) => {
    console.log(data.toString());
  });
  bluetoothOutput.stdout.on("data", (data) => {
    output = JSON.parse(data);
  });
  bluetoothOutput.on("close", (code) => {
    if (code === 0) {
      if (output.status === "successful") {
        res.status(200).json(output);
      } else {
        res.status(400).json(output);
      }
    } else {
      res.status(400).json({
        message: "Somethings went wrong!",
      });
    }
  });
});

module.exports = { testArgv, scanDevices, connectDevice, disconnectDevice };
