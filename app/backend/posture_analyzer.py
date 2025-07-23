import cv2 as cv
from PyQt5.QtCore import QObject, pyqtSignal
from app.backend.pose_detector import PoseDetector
class PostureAnalyzer(QObject):
    frame_ready = pyqtSignal(object)
    def __init__(self):
        super().__init__()
        self.cap=cv.VideoCapture(0)
        self.detector=PoseDetector()

    def run(self, test=False):
        self.is_running=True
        while self.is_running:
            isTrue, img=self.cap.read()
            if isTrue:
                processed_img=self.detector.draw_pose(img, True)


                if test:
                    cv.imshow("Processed Image", processed_img) 
                    if cv.waitKey(1) & 0xFF==ord('q'):
                        break
        
            self.frame_ready.emit(processed_img)


    def stop(self):
        self.is_running=False
    



if __name__ == "__main__":
    analyzer=PostureAnalyzer()
    analyzer.run(True)

