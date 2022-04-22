import os
import sys


def find_usb_path():
    if(sys.platform == 'darwin'):
        'pass'
    elif(sys.platform == 'win32'):
        'this is window'
        def locate_usb():
            import win32file
            drive_list = []
            drivebits = win32file.GetLogicalDrives()
            for d in range(1, 26):
                mask = 1 << d
                if drivebits & mask:
                    # here if the drive is at least there
                    drname = '%c:\\' % chr(ord('A')+d)
                    t = win32file.GetDriveType(drname)
                    if t == win32file.DRIVE_REMOVABLE:
                        drive_list.append(drname)
            return drive_list
        origin = locate_usb()
        removable_drives = []
        for i in origin:
            removable_drives.append(i.split('\\')[0])

        return removable_drives
    else:
        import os
        from glob import glob
        from subprocess import check_output, CalledProcessError

        def get_usb_devices():
            sdb_devices = map(os.path.realpath, glob('/sys/block/sd*'))
            usb_devices = (dev for dev in sdb_devices
                           if 'usb' in dev.split('/')[5])
            return dict((os.path.basename(dev), dev) for dev in usb_devices)

        def get_mount_points(devices=None):
            devices = devices or get_usb_devices()  # if devices are None: get_usb_devices
            output = check_output(['mount']).splitlines()
            def is_usb(path): return any(dev in path for dev in devices)
            output = [line.decode('utf-8') for line in output]
            usb_info = (line for line in output if is_usb(line.split()[0]))
            return [(info.split()[0], info.split()[2]) for info in usb_info]
        result = [i[1] for i in get_mount_points()]

        return result


def detect_music_file(path):
    music_file = []
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(('.ogg', '.mp3', '.wav', '.flac')):
                # print(file)
                music_file.append(os.path.join(root, file))
    return music_file


def copy_file(src, dst):
    import shutil
    shutil.copy(src, dst)


def copy_music_from_A_to_B(src, dst):
    music_file = detect_music_file(src)
    for i in music_file:
        copy_file(i, dst)


def auto_detect_music_in_usb():
    usb_path = find_usb_path()
    app_folder_path = ''
    if (sys.platform == 'win32'):
        app_folder_path = os.path.join("D:/", "Music")
    elif (sys.platform == 'linux'):
        app_folder_path = '/home/music'
    for i in usb_path:
        copy_music_from_A_to_B(i, app_folder_path)


if __name__ == "__main__":
    print("Start")
    auto_detect_music_in_usb()
    print("End")
