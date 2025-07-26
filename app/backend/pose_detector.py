import cv2 as cv
import mediapipe as mp
import time
import math

class PoseDetector:
    def __init__(self, staticMode=False, modelComplexity=1, smooth=True, detectCon=0.5, trackCon=0.5):
        """
        Initializes the pose detector with configurable parameters.

        Parameters:
        - staticMode: bool — for static images (vs video)
        - modelComplexity: int — 0 (lite), 1 (full), 2 (heavy)
        - smooth: bool — whether to smooth landmarks across frames
        - detectCon: float — minimum detection confidence
        - trackCon: float — minimum tracking confidence
        """

        self.staticMode = staticMode
        self.modelComplexity = modelComplexity
        self.smooth = smooth
        self.detectCon = detectCon
        self.trackCon = trackCon

        self.utilDraw = mp.solutions.drawing_utils
        self.poseSolution = mp.solutions.pose

        self.pose = self.poseSolution.Pose(
            static_image_mode=self.staticMode,
            model_complexity=self.modelComplexity,
            smooth_landmarks=self.smooth,
            enable_segmentation=False,
            min_detection_confidence=self.detectCon,
            min_tracking_confidence=self.trackCon
        )


    def draw_pose(self, img, draw):
        # Returns Image after drawing landmark locations and connections.
        RGBImg=cv.cvtColor(img, cv.COLOR_BGR2RGB)
        self.results=self.pose.process(RGBImg)
        
        if self.results.pose_landmarks:
            if draw:
                self.utilDraw.draw_landmarks(RGBImg, self.results.pose_landmarks, self.poseSolution.POSE_CONNECTIONS)

        return RGBImg
    
    def find_cords(self, img):
        self.lmList=[]
        if self.results.pose_landmarks:
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                h, w= img.shape
                cx, cy = int(lm.x*w),int(lm.y*h)
                self.lmList.append([id, cx, cy])

        return self.lmList

    def find_angle(self, img, p1, p2, p3):
        x1, y1= self.lmList[p1][1:]
        x2, y2= self.lmList[p2][1:]
        x3, y3= self.lmList[p3][1:]

        angle=math.degrees(math.atan2(y3-y2, x3-x2)-math.atan2(y1-y2, x1-x2))

        if angle<0:
            angle+=360

        return angle
        
                
