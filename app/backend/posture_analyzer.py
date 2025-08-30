import cv2 as cv
from PyQt5.QtCore import QObject, pyqtSignal
from app.backend.pose_detector import PoseDetector

class PostureAnalyzer(QObject):

    frame_ready = pyqtSignal(object)

    def __init__(self):
        super().__init__()
        self.cap=cv.VideoCapture(0)
        self.detector = PoseDetector()
        self.height_line_visibility = True
        self.shoulder_visibility = True
        self.head_visibility = True
        self.landmark_visiblity = True

        self.head_time_leniency = 3
        self.shoulder_time_leniency = 3
        self.head_height_leniency = 3

    def run(self, test=False):
        self.is_running=True
        isTrue, self.img=self.cap.read()
        self.eye_level=self.img.shape[1]

        while self.is_running:
            isTrue, self.img=self.cap.read()
            if isTrue:
                processed_img = self.detector.draw_pose(self.img.copy(), self.landmark_visiblity)
                self.lmList=self.detector.find_cords(self.img)

                if self.height_line_visibility:
                    cv.line(processed_img, (0, int(self.eye_level)), (9999, int(self.eye_level)), (255, 0, 0), 2)

                if self.shoulder_visibility:
                    left_shoulder = (self.lmList[11][1], self.lmList[11][2])
                    right_shoulder = (self.lmList[12][1], self.lmList[12][2])
                    
                    cv.circle(processed_img, left_shoulder, 30, (255, 0, 0), 3)
                    cv.circle(processed_img, right_shoulder, 30, (255, 0, 0), 3)
                    cv.line(processed_img, left_shoulder, right_shoulder, (255, 0, 0), 2)

                    y1 = self.lmList[11][2]
                    y2 = self.lmList[12][2]
                    vertical_dist = abs(y1 - y2)
                    text = f"Vertical Dist: {vertical_dist}px"

                    x_pos = (self.lmList[11][1] + self.lmList[12][1]) // 2
                    y_pos = min(y1, y2) - 20
                    cv.putText(processed_img, text, (x_pos, y_pos), cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                if self.head_visibility:
                    left_eye = (self.lmList[2][1], self.lmList[2][2])
                    right_eye = (self.lmList[5][1], self.lmList[5][2])

                    cv.circle(processed_img, left_eye, 30, (255, 0, 0), 3)
                    cv.circle(processed_img, right_eye, 30, (255, 0, 0), 3)
                    cv.line(processed_img, left_eye, right_eye, (255, 0, 0), 2)

                    y1 = self.lmList[2][2]
                    y2 = self.lmList[5][2]
                    vertical_dist = abs(y1 - y2)
                    text = f"Vertical Dist: {vertical_dist}px"

                    x_pos = (self.lmList[2][1] + self.lmList[5][1]) // 2
                    y_pos = min(y1, y2) - 20
                    cv.putText(processed_img, text, (x_pos, y_pos), cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                # eye level detecion
                self.check_eye_level()

                self.check_shoulders()

                self.check_head_tilt()
                
                if test:
                    cv.imshow("Processed Image", processed_img) 
                    if cv.waitKey(1) & 0xFF==ord('q'):
                        break
        
            self.frame_ready.emit(processed_img)

    def check_eye_level(self):
        pass

    def check_head_tilt(self):
        pass

    def check_shoulders(self):
        pass

    def stop(self):
        self.is_running=False
    
    def calibrate_height_line(self):
        self.eye_level = (self.lmList[2][2] + self.lmList[5][2]) / 2

    def toggle_shoulder_visibility(self, checked):
        self.shoulder_visibility = checked

    def toggle_head_visibility(self, checked):
        self.head_visibility = checked

    def update_head_height_leniency(self, height):
        self.head_height_leniency = height

    def update_head_time_leniency(self, time):
        self.head_time_leniency = time

    def update_shoulder_time_leniency(self, time):
        self.shoulder_time_leniency = time
        
    def toggle_height_line(self, checked):
        self.height_line_visibility = checked

    def toggle_landmarks_visibility (self, checked):
        self.landmark_visiblity = checked



if __name__ == "__main__":
    analyzer=PostureAnalyzer()
    analyzer.run(True)

