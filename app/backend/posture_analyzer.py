import cv2 as cv
from app.backend.pose_detector import poseDetector
class PostureAnalyzer:
    def __init__(self):
        self.cap=cv.VideoCapture(0)
        self.detector=poseDetector()

    def run(self, test=False):
        self.isRunning=True
        while self.isRunning:
            isTrue, img=self.cap.read()
            if isTrue:
                processedImg=self.detector.drawPose(img, True)


                if test:
                    cv.imshow("Processed Image", processedImg) 
                    if cv.waitKey(1) & 0xFF==ord('q'):
                        break

    def stop(self):
        self.isRunning=False
    



if __name__ == "__main__":
    analyzer=PostureAnalyzer()
    analyzer.run(True)

