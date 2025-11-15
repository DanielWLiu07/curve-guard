import sys
import os
import threading
from PyQt5.QtWidgets import QApplication

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.frontend.main_window import MainWindow
from app.backend.posture_analyzer import PostureAnalyzer


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(ROOT_DIR, relative_path)


def main():
    analyzer = PostureAnalyzer()
    analyze_thread = threading.Thread(target=analyzer.run)
    analyze_thread.start()

    app = QApplication(sys.argv)
    style_path = resource_path("app/frontend/style.qss")
    with open(style_path) as f:
        app.setStyleSheet(f.read())
    window = MainWindow(analyzer)
    window.show()

    exit_code = app.exec_()
    analyze_thread.join()
    sys.exit(exit_code)


if __name__ == "__main__":
    main()



