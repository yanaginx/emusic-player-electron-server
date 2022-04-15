const wifi = require("node-wifi");
const asyncHandler = require("express-async-handler");

wifi.init({
  iface: null, // network interface, choose a random wifi interface if set to null
});

// @desc    Scan all wifi connections
// @route   GET /api/wifi/
// @access  Public
const scanNetworks = asyncHandler(async (req, res) => {
  wifi.scan((error, networks) => {
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json(networks);
    }
  });
});

// @desc    Connect to a wifi network
// @route   POST /api/wifi/connect
// @access  Public
const connectToNetwork = asyncHandler(async (req, res) => {
  const { ssid, password } = req.body;
  // console.log("🚀 ~ file: wifiController.js ~ line 64 ~ ssid", ssid);
  // console.log("🚀 ~ file: wifiController.js ~ line 64 ~ password", password);

  wifi.connect({ ssid, password }, () => {
    wifi.getCurrentConnections((error, currentConnections) => {
      if (error) {
        res.status(400).json({
          message: error,
        });
        // res.status(400);
        // throw new Error("Something went wrong");
      } else {
        if (currentConnections.length > 0) {
          res.status(200).json(currentConnections);
        } else {
          res.status(400).json({
            message: "Failed to connect, please try again",
          });
          // res.status(400);
          // throw new Error(error);
        }
      }
    });
  });
});

// @desc    Disconnect from a wifi network
// @route   GET /api/wifi/disconnect
// @access  Public
const disconnectFromNetwork = asyncHandler(async (req, res) => {
  wifi.disconnect((error) => {
    if (error) {
      // res.status(400);
      // throw new Error(error);
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json("Disconnected");
    }
  });
});

module.exports = { scanNetworks, connectToNetwork, disconnectFromNetwork };
