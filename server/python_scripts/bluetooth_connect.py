import sys
import pexpect
import json


def connect_device(mac_address):
    child = pexpect.spawn("bluetoothctl")
    child.expect("bluetooth")
    child.sendline("connect " + mac_address)
    child.expect("successful")
    child.close()
    message = {
        "status": "succesful",
        "message": "Connect successfully!"
    }
    print(json.dumps(message))


if __name__ == "__main__":
    try:
        connect_device(sys.argv[1])
    except pexpect.ExceptionPexpect:
        message = {
            "status": "failed",
            "message": "Timeout exceeded!"
        }
        print(json.dumps(message))
