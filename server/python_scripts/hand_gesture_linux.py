import cv2
import numpy as np
import time
import pyautogui
import alsaaudio

import HandTrackingModule as htm

cap = cv2.VideoCapture(0)

pTime = 0
cTime = 0

detector = htm.handDetector(detectionCon=0.7, maxHands=1)

# north west corner of the screen: x=288, y=172
# (play/pause): x=625, y=725
# (next track): x=570, y=725
# (previous track): x=675, y=725
# (end of volume bar): x=1295, y=725
# (begin of volume bar): x=1225, y=725
# TODO: Correct this values if there is any mistake
xPlay = 625 - 288
xNext = 570 - 288
xPrev = 675 - 288
xBegin = 1295 - 288
xEnd = 1225 - 288
yPlay = yNext = yPrev = yEnd = yBegin = 725 - 172
# x for linux = windows_x - 288
# y for linux = windows_y - 172

# Uncomment if u want to set the default system volume
# Range -65 (0%) to 0 (100%)

m = alsaaudio.Mixer()

# Hand range
minHandRange = 50
maxHandRange = 150

# Volume variable set up
vol = 0
volBar = 400
volPercent = 100
cntFingerDownFrame = 0
cntPausePlayModeFrame = 0
cntPrevTrackFrame = 0
cntNextTrackFrame = 0


def isSetVolume(fingers: list, hand_label: str) -> bool:
    if hand_label is None or hand_label == 'Left':
        return False

    if (
            not fingers[2]
            and not fingers[3]
            and not fingers[4]
    ):
        return True
    else:
        return False


def isPausePlayMode(fingers: list, hand_label: str) -> bool:
    if hand_label is None or hand_label == 'Left':
        return False

    if all(fingers):
        return True
    else:
        return False


def isPreviousTrack(fingers: list, hand_label: str) -> bool:
    if hand_label is None or hand_label == 'Right':
        return False

    if (
            (not fingers[1]
             and not fingers[2]
             and not fingers[3]
             and not fingers[4])
            and (fingers[0]
                 or not fingers[0])
    ):
        return True
    else:
        return False


def isNextTrack(fingers: list, hand_label: str) -> bool:
    if hand_label is None or hand_label == 'Right':
        return False

    if (
            (fingers[1]
             and fingers[2]
             and fingers[3]
             and fingers[4])
            and (fingers[0]
                 or not fingers[0])
    ):
        return True
    else:
        return False


hand_label_dict = {
    None: None,
    'Left': 'Right',
    'Right': 'Left'
}
while True:
    _, img = cap.read()

    img, hand_label = detector.findHands(img)
    hand_label = hand_label_dict[hand_label]

    lmList, bbox = detector.findPosition(img, draw=True)

    if len(lmList) != 0:

        # STEP 1: Filter based on size
        area = (bbox[2] * bbox[3]) // 100

        if 150 < area < 1000:

            # STEP 2: Find distance between index and thumb
            length, img, lineInfo = detector.findDistance(4, 8, img)

            # STEP 3: Convert volume
            # Volume Range -65 - 0
            volBar = np.interp(
                length, [minHandRange, maxHandRange], [400, 150])
            volPercent = np.interp(
                length, [minHandRange, maxHandRange], [0, 100])

            # STEP 4: Reduce resolution
            smoothness = 5
            volPercent = smoothness * round(volPercent / smoothness)

            # STEP 5: Check finger up
            fingers = detector.fingersUp()
            print(fingers)

            # STEP 5.1: If pinky down then set the volume
            if isSetVolume(fingers, hand_label):
                cntFingerDownFrame += 1
                if cntFingerDownFrame >= 20:
                    # m.setvolume(volPercent)
                    distance = volPercent / 100 * (xEnd - xBegin)
                    pyautogui.click(x=xEnd - distance, y=yBegin)
                    # cv2.circle(img, lineInfo[2], 10, (0, 255, 0), cv2.FILLED)
                    cntFingerDownFrame = 0
            else:
                cntFingerDownFrame = 0

            if isPausePlayMode(fingers, hand_label):
                cntPausePlayModeFrame += 1
                if cntPausePlayModeFrame >= 50:
                    # pyautogui.press('playpause')
                    pyautogui.click(xPlay, yPlay)
                    cntPausePlayModeFrame = 0
            else:
                cntPausePlayModeFrame = 0

            if isPreviousTrack(fingers, hand_label):
                cntPrevTrackFrame += 1
                if cntPrevTrackFrame >= 50:
                    # pyautogui.press('prevtrack')
                    pyautogui.click(xPrev, yPrev)
                    cntPrevTrackFrame = 0
            else:
                cntPrevTrackFrame = 0

            if isNextTrack(fingers, hand_label):
                cntNextTrackFrame += 1
                if cntNextTrackFrame >= 50:
                    # pyautogui.press('nexttrack')
                    pyautogui.click(xNext, yNext)
                    cntNextTrackFrame = 0
            else:
                cntNextTrackFrame = 0

    # # Drawing
    # cv2.rectangle(img, (50, 150), (85, 400), (255, 0, 0), 3)
    # cv2.rectangle(img, (50, int(volBar)), (85, 400), (255, 0, 0), cv2.FILLED)
    # cv2.putText(img, f'{int(volPercent)} %', (48, 438), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 3)
    #
    # cVol = int(m.getvolume()[0])
    # cv2.putText(img, 'VolSet: ' + str(int(cVol)), (300, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
    #
    # # Frame rate
    # cTime = time.time()
    # fps = 1 / (cTime - pTime)
    # pTime = cTime
    #
    # cv2.putText(img, 'FPS: ' + str(int(fps)), (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
    #
    # cv2.imshow('image', img)

    # if cv2.waitKey(1) & 0xFF == ord('q'):
    #     break
