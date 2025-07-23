import sys
import threading
from PyQt5.QtWidgets import QApplication, QMainWindow, QDesktopWidget
from PyQt5.QtCore import QTimer
from app.frontend.main_window import MainWindow
from app.backend.posture_analyzer import PostureAnalyzer

def main():
    # Initilizes and runs Posture Analyzer
    analyzer = PostureAnalyzer()
    analyze_thread=threading.Thread(target=analyzer.run)
    analyze_thread.start()

    # Initializes and runs main window
    app=QApplication(sys.argv)
    window=MainWindow(analyzer)
    window.show()

    # When app closes, wait for the analyzer thread to end
    exit_code = app.exec_()
    analyze_thread.join()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()  