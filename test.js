const Bluetooth = require("../").Bluetooth;
const bluetoothDevices = [];

process.stdin.setEncoding("utf8");
process.stdin.on("readable", () => {
  const input = process.stdin.read();
  if (input === "\u0003") {
    process.exit();
  }

  const index = parseInt(input);
  if (index && index <= bluetoothDevices.length) {
    process.stdin.setRawMode(false);
    const device = bluetoothDevices[index - 1];
    device.select();
  }
});

const deviceFound = (bluetoothDevice, selectFn) => {
  const discovered = bluetoothDevices.some((device) => {
    return device.id === bluetoothDevice.id;
  });
  if (discovered) return;

  if (bluetoothDevices.length === 0) {
    process.stdin.setRawMode(true);
    console.log("select a device:");
  }

  bluetoothDevices.push({ id: bluetoothDevice.id, select: selectFn });

  console.log(`${bluetoothDevices.length}: ${bluetoothDevice.name}`);
  if (bluetoothDevice._serviceUUIDs.length) {
    console.log(`\tAdvertising: ${bluetoothDevice._serviceUUIDs}`);
  }
};

const enumerateGatt = async (server) => {
  const services = await server.getPrimaryServices();
  const sPromises = services.map(async (service) => {
    const characteristics = await service.getCharacteristics();
    const cPromises = characteristics.map(async (characteristic) => {
      let descriptors = await characteristic.getDescriptors();
      descriptors = descriptors.map(
        (descriptor) => `\t\t└descriptor: ${descriptor.uuid}`
      );
      descriptors.unshift(`\t└characteristic: ${characteristic.uuid}`);
      return descriptors.join("\n");
    });

    const descriptors = await Promise.all(cPromises);
    descriptors.unshift(`service: ${service.uuid}`);
    return descriptors.join("\n");
  });

  const result = await Promise.all(sPromises);
  console.log(result.join("\n"));
};

const bluetooth = new Bluetooth({ deviceFound });
console.log("scanning...");

(async () => {
  try {
    const device = await bluetooth.requestDevice({
      acceptAllDevices: true,
    });
    console.log("connecting...");

    const server = await device.gatt.connect();
    console.log("connected");

    await enumerateGatt(server);
    await server.disconnect();

    console.log("\ndisconnected");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
})();
