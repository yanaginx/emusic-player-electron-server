const wifi = require("node-wifi");

wifi.init({
  iface: null, // network interface, choose a random wifi interface if set to null
});

wifi.disconnect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Disconnected");
  }
});
