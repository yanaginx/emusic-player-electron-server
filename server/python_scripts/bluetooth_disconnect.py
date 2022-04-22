import sys
import pexpect
import json


def disconnect_device(mac_address):
    child = pexpect.spawn("bluetoothctl")
    child.expect("bluetooth")
    child.sendline("disconnect " + mac_address)
    child.expect("successful")
    child.close()
    message = {
        "status": "succesful",
        "message": "Disconnect successfully!"
    }
    print(json.dumps(message))


if __name__ == "__main__":
    try:
        disconnect_device(sys.argv[1])
    except pexpect.ExceptionPexpect:
        message = {
            "status": "failed",
            "message": "Timeout exceeded!"
        }
        print(json.dumps(message))
