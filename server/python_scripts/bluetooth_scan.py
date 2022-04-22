import bluetooth
import pexpect
import json

tscan = 10


def bluetooth_scan():
    child = pexpect.spawn('bluetoothctl')
    child.sendline('scan on')
    return bluetooth.discover_devices(duration=tscan, lookup_names=True)


def print_scanned_devices():
    devices = bluetooth_scan()
    lst_devices = []
    for device in devices:
        lst_devices.append({
            "mac": device[0],
            "device_name": device[1]
        })
    print(json.dumps(lst_devices))


if __name__ == "__main__":
    print_scanned_devices()
