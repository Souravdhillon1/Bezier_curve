# Bézier Rope Simulation

🎥 **Working Demo Video:**  
https://drive.google.com/file/d/1hMBetWH65r_A7hOfhaxiwnXtQ1kv7DGD/view?usp=drivesdk

---

This is a small interactive project that simulates a rope using a cubic Bézier curve.  
The curve reacts smoothly to mouse movement using a simple spring and damping model.

The goal of this project is to understand Bézier math, basic physics, and real-time
rendering using plain HTML Canvas and JavaScript.

---

## Features

- Cubic Bézier curve drawn manually
- Fixed endpoints with dynamic middle control points
- Spring-damping physics for smooth motion
- Tangent vectors visualized along the curve
- Real-time interaction (~60 FPS)
- No external libraries or frameworks

---

## Bézier Math

The rope is represented using a cubic Bézier curve with four control points:

B(t) = (1 − t)³P0  
     + 3(1 − t)²tP1  
     + 3(1 − t)t²P2  
     + t³P3

---

## Tangents

Tangents are computed using the analytical derivative of the Bézier curve:

B′(t) = 3(1 − t)²(P1 − P0)  
      + 6(1 − t)t(P2 − P1)  
      + 3t²(P3 − P2)

The tangent vectors are normalized and scaled only for visualization.

---

## Physics Model

The middle control points follow a spring-damping system:

force = −k × (position − target)  
velocity = (velocity + force) × damping  
position = position + velocity

This creates a rope-like motion instead of instant snapping.

---

## Controls

- Move the mouse to influence the rope
- The curve responds smoothly with inertia

---

## Project Structure

bezier-rope/  
├── index.html  
├── script.js  
└── README.md  

---

## How to Run

**Option 1:**
- Open `index.html` directly in a browser

**Option 2 (recommended):**
- Open the folder in VS Code
- Use the Live Server extension
- Right-click `index.html` → Open with Live Server

---

## Notes

- All math and physics are implemented manually
- No animation or physics libraries are used
- Canvas is used directly for rendering

---

## License

Free to use for learning and experimentation.
