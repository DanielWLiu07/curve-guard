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
                
