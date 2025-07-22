from PyQt5.QtWidgets import QApplication, QMainWindow, QDesktopWidget

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Curve Guard")

        screen = QDesktopWidget().screenGeometry()
        screen_width = screen.width()
        screen_height = screen.height()

        # Calculate window size (80% of width & 70% of height)
        window_width = int(screen_width * 0.8)
        window_height = int(screen_height * 0.7)

        # Calculate position to center window
        pos_x = (screen_width - window_width) // 2
        pos_y = (screen_height - window_height) // 2

        # Set geometry: x, y, width, height
        self.setGeometry(pos_x, pos_y, window_width, window_height)

