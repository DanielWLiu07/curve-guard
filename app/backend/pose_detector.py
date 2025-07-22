import cv2 as cv
import mediapipe as mp
import time
import math

class poseDetector():
    def __init__(self, staticMode=False, upperBody=False, smooth=True, detectCon=0.5, trackCon=0.5):
        # Initializes the pose detector with configurable parameters.
        self.staticMode = staticMode
        self.upperBody =upperBody
        self.smooth = smooth
        self.detectCon = detectCon
        self.trackCon = trackCon
        self.utilDraw = mp.solutions.drawing_utils
        self.poseSolution = mp.solutions.pose
        self.pose=self.poseSolution.Pose(self.staticmode, self.upperBody, self.smooth, self.detectCon, self.trackCon)

    def drawPose(self, img, draw):
        RGBImg=cv.cvtColor(img, cv.COLOR_BGR2RGB)
        self.results=self.pose.process(RGBImg)

        if self.results.pose_landmarks:
            if draw:
                self.utilDraw.draw_landmarks(img, self.results.pose_landmarks, self.poseSolution.POSE_CONNECTIONS)
                
