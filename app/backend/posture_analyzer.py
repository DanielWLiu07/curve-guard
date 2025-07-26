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
        isTrue, self.img=self.cap.read()
        self.eye_level=self.img.shape[1]
        print(type(self.eye_level))
        while self.is_running:
            isTrue, self.img=self.cap.read()
            if isTrue:
                processed_img=self.detector.draw_pose(self.img, True)


                if self.toggle_height_line:
                    cv.line(processed_img, (0, int(self.eye_level)), (9999, int(self.eye_level)), (255, 0, 0), 2)
            
                if test:
                    cv.imshow("Processed Image", processed_img) 
                    if cv.waitKey(1) & 0xFF==ord('q'):
                        break
        
            self.frame_ready.emit(processed_img)


    def stop(self):
        self.is_running=False
    
    def calibrate_height_line(self):
        lmList=self.detector.find_cords(self.img)
        self.eye_level = (lmList[2][2] + lmList[5][2]) / 2

    def toggle_height_line(self):
        if self.show_height_line:
            self.show_height_line = False
        else:
            self.show_height_line = True


if __name__ == "__main__":
    analyzer=PostureAnalyzer()
    analyzer.run(True)

