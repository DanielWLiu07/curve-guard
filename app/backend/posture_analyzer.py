import cv2 as cv
import time
import threading
import simpleaudio as sa
import os
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

        self.eye_height_leniency = 50
        self.eye_time_leniency = 3
        self.head_time_leniency = 3
        self.shoulder_uneveness_leniency = 3
        self.shoulder_time_leniency = 3
        self.head_height_leniency = 3

        self.eye_above_start = None
        self.eye_above_triggered = False
        self.shoulder_uneven_start = None
        self.shoulder_uneven_triggered = False
        self.head_uneven_start = None
        self.head_uneven_triggered = False

        APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        SOUND_DIR = os.path.join(APP_DIR, "assets", "error.wav")
        self.error_wave = sa.WaveObject.from_wave_file(SOUND_DIR)
        self.error_play_obj = None

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

                if self.shoulder_visibility and len(self.lmList) > 12:

                    left_shoulder = self.lmList[11]
                    right_shoulder = self.lmList[12]
                    
                    cv.circle(processed_img, left_shoulder[1:], 30, (255, 0, 0), 3)
                    cv.circle(processed_img, right_shoulder[1:], 30, (255, 0, 0), 3)
                    cv.line(processed_img, left_shoulder[1:], right_shoulder[1:], (255, 0, 0), 2)

                    vertical_dist = abs(left_shoulder[2] - right_shoulder[2])
                    text = f"Vertical Dist: {vertical_dist}px"

                    x_pos = (self.lmList[11][1] + self.lmList[12][1]) // 2
                    y_pos = min(left_shoulder[2], right_shoulder[2]) - 20
                    cv.putText(processed_img, text, (x_pos, y_pos), cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                if self.head_visibility and len(self.lmList)>5:
                    left_eye = self.lmList[2]
                    right_eye = self.lmList[5]

                    cv.circle(processed_img, left_eye[1:], 30, (255, 0, 0), 3)
                    cv.circle(processed_img, right_eye[1:], 30, (255, 0, 0), 3)
                    cv.line(processed_img, left_eye[1:], right_eye[1:], (255, 0, 0), 2)

                    vertical_dist = abs(left_shoulder[2] - right_shoulder[2])
                    text = f"Vertical Dist: {vertical_dist}px"

                    x_pos = (self.lmList[2][1] + self.lmList[5][1]) // 2
                    y_pos = min(left_eye[2], right_eye[2]) - 20
                    cv.putText(processed_img, text, (x_pos, y_pos), cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
               
                self.check_eye_level()
                self.check_shoulders()
                self.check_head_tilt()
                
                
                if test:
                    cv.imshow("Processed Image", processed_img) 
                    if cv.waitKey(1) & 0xFF==ord('q'):
                        break
        
            self.frame_ready.emit(processed_img)

    def check_eye_level(self):
        left_eye_y = self.lmList[2][2]
        right_eye_y = self.lmList[5][2]
        avg_eye_y = (left_eye_y + right_eye_y) / 2

        if avg_eye_y < (self.eye_level - self.eye_height_leniency):
            print("error")
            if self.eye_above_start is None:
                self.eye_above_start = time.time()
            else:
                elapsed = time.time() - self.eye_above_start
                if elapsed >= self.eye_time_leniency and not self.eye_above_triggered:
                    self.eye_above_triggered = True
        else:
            self.eye_above_start = None
            self.eye_above_triggered = False

    def check_head_tilt(self):
        left_eye = self.lmList[2]
        right_eye = self.lmList[5]

        vertical_dist = abs(right_eye[2] - left_eye[2])

        if vertical_dist > self.head_height_leniency:
            if self.head_uneven_start is None:
                self.head_uneven_start = time.time()
            else:
                time_elapsed = time.time() - self.head_uneven_start

                if time_elapsed >= self.shoulder_time_leniency and not self.head_uneven_triggered:
                    self.head_uneven_triggered = True
        else:
            self.head_uneven_start = None
            self.head_uneven_triggered = False


    def check_shoulders(self):
        if len(self.lmList) > 11 and self.lmList[11] is not None:
            left_shoulder = self.lmList[11]
            self.last_left_shoulder = left_shoulder
        else:
            left_shoulder = getattr(self, 'last_left_shoulder', None)

        if len(self.lmList) > 12 and self.lmList[12] is not None:
            right_shoulder = self.lmList[12]
            self.last_right_shoulder = right_shoulder
        else:
            right_shoulder = getattr(self, 'last_right_shoulder', None)

        if left_shoulder is None or right_shoulder is None:
            return

        left_y = left_shoulder[1]  
        right_y = right_shoulder[1]
        diff = abs(left_y - right_y)

        if diff > self.shoulder_leniency:
            if self.shoulder_uneven_start is None:
                self.shoulder_uneven_start = time.time()
            else:
                elapsed = time.time() - self.shoulder_uneven_start
                if elapsed >= self.shoulder_time_leniency and not self.shoulder_uneven_triggered:
                    self.shoulder_uneven_triggered = True
        else:
            self.shoulder_uneven_start = None
            self.shoulder_uneven_triggered = False

    def start_error_sound(self):
        if self.error_play_obj is None or not self.error_play_obj.is_playing():
            self.error_play_obj = self.error_wave.play()

    def stop_error_sound(self):
        if self.error_play_obj is not None and self.error_play_obj.is_playing():
            self.error_play_obj.stop()

    def stop(self):
        self.is_running=False
    
    def calibrate_height_line(self):
        self.eye_level = (self.lmList[2][2] + self.lmList[5][2]) / 2

    def update_eye_height_leniency(self, leniency):
        self.eye_height_leniency = leniency
    
    def update_eye_time_leniency(self, time):
        self.eye_time_leniency = time

    def toggle_shoulder_visibility(self, checked):
        self.shoulder_visibility = checked

    def update_shoulder_uneveness_leniency(self, leniency):
        self.shoulder_uneveness_leniency = leniency
    
    def update_shoulder_time_leniency(self, time):
        self.shoulder_time_leniency = time

    def toggle_head_visibility(self, checked):
        self.head_visibility = checked

    def update_head_uneveness_leniency(self, leniency):
        self.head_height_leniency = leniency

    def update_head_time_leniency(self, time):
        self.head_time_leniency = time
        
    def toggle_height_line(self, checked):
        self.height_line_visibility = checked

    def toggle_landmarks_visibility (self, checked):
        self.landmark_visiblity = checked



if __name__ == "__main__":
    analyzer=PostureAnalyzer()
    analyzer.run(True)

