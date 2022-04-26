import sys
import pexpect
import json


def get_paired_devices():
    child = pexpect.spawn("bluetoothctl")
    child.expect("bluetooth")
    child.sendline("paired-devices")
    child.expect("Device")
    devices = child.readline().decode('utf-8').split(' ')
    child.close()
    res = {'mac': devices[1], 'device_name': devices[2]}
    print(json.dumps(res))


if __name__ == "__main__":
    try:
        get_paired_devices()
    except pexpect.ExceptionPexpect:
        message = {
            "status": "failed",
            "message": "Timeout exceeded!"
        }
        print(json.dumps(message))
