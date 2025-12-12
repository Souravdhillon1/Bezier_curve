import React, { useRef, useEffect, useState } from "react";

export default function BezierRope() {
  const canvasRef = useRef(null);

  // Control points
  const [points, setPoints] = useState([
    { x: 100, y: 200 }, // P0 - fixed
    { x: 250, y: 100, vx: 0, vy: 0, targetX: 250, targetY: 100 }, // P1 - dynamic
    { x: 400, y: 100, vx: 0, vy: 0, targetX: 400, targetY: 100 }, // P2 - dynamic
    { x: 550, y: 200 } // P3 - fixed
  ]);

  const [draggingIndex, setDraggingIndex] = useState(null);

  // Physics constants
  const k = 0.1;       // spring constant
  const damping = 0.8; // damping factor

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function updatePhysics() {
      const newPoints = [...points];

      // Only P1 and P2 move with spring-damping
      [1, 2].forEach((i) => {
        const p = newPoints[i];
        // acceleration
        const ax = -k * (p.x - p.targetX);
        const ay = -k * (p.y - p.targetY);

        // update velocity
        p.vx = (p.vx + ax) * damping;
        p.vy = (p.vy + ay) * damping;

        // update position
        p.x += p.vx;
        p.y += p.vy;
      });

      setPoints(newPoints);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cubic Bézier
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#8B4513";
      ctx.beginPath();

      for (let t = 0; t <= 1; t += 0.01) {
        const x =
          Math.pow(1 - t, 3) * points[0].x +
          3 * Math.pow(1 - t, 2) * t * points[1].x +
          3 * (1 - t) * Math.pow(t, 2) * points[2].x +
          Math.pow(t, 3) * points[3].x;

        const y =
          Math.pow(1 - t, 3) * points[0].y +
          3 * Math.pow(1 - t, 2) * t * points[1].y +
          3 * (1 - t) * Math.pow(t, 2) * points[2].y +
          Math.pow(t, 3) * points[3].y;

        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        // Draw tangent
        if (t % 0.1 < 0.01) {
          const dx =
            3 * Math.pow(1 - t, 2) * (points[1].x - points[0].x) +
            6 * (1 - t) * t * (points[2].x - points[1].x) +
            3 * t * t * (points[3].x - points[2].x);

          const dy =
            3 * Math.pow(1 - t, 2) * (points[1].y - points[0].y) +
            6 * (1 - t) * t * (points[2].y - points[1].y) +
            3 * t * t * (points[3].y - points[2].y);

          const len = 20;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + dx * len, y + dy * len);
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      ctx.stroke();

      // Draw control points
      points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 || i === 3 ? "#888" : "#fff";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
      });
    }

    function animate() {
      updatePhysics();
      draw();
      requestAnimationFrame(animate);
    }

    animate();
  }, [points]);

  // Mouse interaction
  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    points.forEach((p, i) => {
      if (i === 0 || i === 3) return; // fixed points
      if (Math.hypot(mx - p.x, my - p.y) < 15) {
        setDraggingIndex(i);
      }
    });
  }

  function handleMouseMove(e) {
    if (draggingIndex === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const newPoints = [...points];
    newPoints[draggingIndex].targetX = mx;
    newPoints[draggingIndex].targetY = my;

    setPoints(newPoints);
  }

  function handleMouseUp() {
    setDraggingIndex(null);
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-[700px] h-[400px] bg-white shadow-xl rounded-xl p-4">
        <h1 className="text-xl font-bold mb-3 text-center">
          Cubic Bézier Rope with Physics
        </h1>
        <canvas
          ref={canvasRef}
          className="w-full h-full border rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
}
