# CurveGuard

**Posture-aware wellness tool powered by AI**  
**CurveGuard** is a real-time posture monitoring desktop app that uses computer vision to promote healthy spinal habits. It leverages [MediaPipe](https://mediapipe.dev/) for body landmark detection and provides an intuitive PyQt5 interface to alert users of poor posture while using their computer.

By encouraging upright sitting posture, CurveGuard aims to prevent long-term spinal issues such as **scoliosis**, **lordosis**, and **kyphosis**.

---

## Features

- 🔍 **Non-invasive posture tracking** (no wearables or sensors needed)
- 📐 Real-time feedback on head tilt, shoulder slope, and back alignment
- ⏱️ Adjustable posture check frequency
- 🪟 Lightweight PyQt5 GUI for status and settings
- 💾 Modular and extensible codebase for future features like stats/history tracking

---

## Tech Stack

| Component        | Technology                  |
|------------------|------------------------------|
| **Pose Detection** | [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose.html) |
| **Computer Vision** | [OpenCV](https://opencv.org/) |
| **GUI Framework**   | [PyQt5](https://riverbankcomputing.com/software/pyqt/) |
| **Programming Language** | Python 3.8+ |
| **Data Processing** | NumPy |
| **Threading** | Python’s `threading` module |
| **Design (Optional)** | Qt Stylesheets (`.qss`) |

---

## Installation

### Requirements

- Python 3.8+
- PyQt5
- OpenCV
- MediaPipe
- Numpy

Install dependencies:

```bash
pip install -r requirements.txt
```

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this software for personal or commercial purposes, provided that you include the original copyright and license.

See the [LICENSE](LICENSE) file for full license text.
