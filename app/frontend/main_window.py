from PyQt5.QtWidgets import QApplication, QMainWindow, QDesktopWidget, QLabel, QVBoxLayout, QHBoxLayout, QWidget
from PyQt5.QtGui import QPixmap, QImage
import cv2 as cv

class MainWindow(QMainWindow):
    def __init__(self, analyzer):
        # Window Set Up
        super().__init__()
        self.setWindowTitle("Curve Guard")
       
        
        self.analyzer=analyzer
        self.analyzer.frame_ready.connect(self.update_image)

        # Calculate window size (80% of width & 70% of height)
        screen = QDesktopWidget().screenGeometry()
        screen_width = screen.width()
        screen_height = screen.height()
        window_width = int(screen_width * 0.8)
        window_height = int(screen_height * 0.7)

        # Calculate position to center window
        pos_x = (screen_width - window_width) // 2
        pos_y = (screen_height - window_height) // 2
        self.setGeometry(pos_x, pos_y, window_width, window_height)

        self.initUI()

    def initUI(self):
        # Set up central widget
        central_widget=QWidget()
        self.setCentralWidget(central_widget)
        
        #Processed Video feed
        self.video_label=QLabel(self)
        self.video_label.setScaledContents(True)


        # Top bar
        self.top_bar_widget = QWidget()
        self.top_bar_widget.setFixedHeight(50)
        self.top_bar = QHBoxLayout()
        self.top_bar_widget.setLayout(self.top_bar)

        # Side bar
        self.sidebar = QWidget()
        self.sidebar_layout = QVBoxLayout()
        self.sidebar.setLayout(self.sidebar_layout)


        self.body_layout = QHBoxLayout()
        self.body_layout.addWidget(self.video_label, 3)
        self.body_layout.addWidget(self.sidebar, 1)


        self.main_layout = QVBoxLayout()
        self.main_layout.addWidget(self.top_bar_widget)
        self.main_layout.addLayout(self.body_layout)
        
        central_widget.setLayout(self.main_layout)
        
        
        

    def update_image(self, cv_img):
        # Get target size from QLabel
        target_width = self.video_label.width()
        target_height = self.video_label.height()

        # Resize + Center Crop
        img = self.center_crop_resize(cv_img, target_width, target_height)

        # Convert to QImage and display
        h, w, ch = img.shape
        bytes_per_line = ch * w
        camera_image = QImage(img.tobytes(), w, h, bytes_per_line, QImage.Format_RGB888)
        self.video_label.setPixmap(QPixmap.fromImage(camera_image))

    def center_crop_resize(self, frame, target_width, target_height):
        h, w, _ = frame.shape

        # Scale so the image covers the whole label area
        scale = max(target_width / w, target_height / h)
        new_w, new_h = int(w * scale), int(h * scale)
        resized = cv.resize(frame, (new_w, new_h), interpolation=cv.INTER_AREA)

        # Center crop
        x_start = (new_w - target_width) // 2
        y_start = (new_h - target_height) // 2
        cropped = resized[y_start:y_start + target_height, x_start:x_start + target_width]

        return cropped
        

    def closeEvent(self, event):
        self.analyzer.stop()
        event.accept()
