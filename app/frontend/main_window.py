from PyQt5.QtWidgets import QApplication, QMainWindow, QDesktopWidget, QLabel
from PyQt5.QtGui import QPixmap, QImage

class MainWindow(QMainWindow):
    def __init__(self, analyzer):
        # Window Set Up
        super().__init__()
        self.setWindowTitle("Curve Guard")
       
        self.analyzer=analyzer
        self.analyzer.frame_ready.connect(self.update_image)


        screen = QDesktopWidget().screenGeometry()
        screen_width = screen.width()
        screen_height = screen.height()

        # Calculate window size (80% of width & 70% of height)
        window_width = int(screen_width * 0.8)
        window_height = int(screen_height * 0.7)

        # Calculate position to center window
        pos_x = (screen_width - window_width) // 2
        pos_y = (screen_height - window_height) // 2
        self.setGeometry(pos_x, pos_y, window_width, window_height)

        self.initUI()

    def initUI(self):
        self.video_label=QLabel(self)
        self.video_label.setGeometry(0,0,100,100)
        self.video_label.setScaledContents(True)
        

    def update_image(self, cv_img):
        #Receive the numpy OpenCV image, convert and show.
        h, w, ch = cv_img.shape
        bytes_per_line = ch * w
        camera_image = QImage(cv_img.data, w, h, bytes_per_line, QImage.Format_RGB888)
        self.video_label.setPixmap(QPixmap.fromImage(camera_image))

    def closeEvent(self, event):
        self.analyzer.stop()
        event.accept()
