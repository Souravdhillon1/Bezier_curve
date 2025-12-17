// canvas basic setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();


// simple 2D vector helper
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  mul(val) {
    return new Vec2(this.x * val, this.y * val);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const l = this.length() || 1;
    return new Vec2(this.x / l, this.y / l);
  }
}


// fixed endpoints
const P0 = new Vec2(100, canvas.height / 2);
const P3 = new Vec2(canvas.width - 100, canvas.height / 2);

// middle control points (these move)
const P1 = {
  pos: new Vec2(canvas.width * 0.3, canvas.height * 0.3),
  vel: new Vec2(0, 0),
  target: new Vec2(canvas.width * 0.3, canvas.height * 0.3)
};

const P2 = {
  pos: new Vec2(canvas.width * 0.7, canvas.height * 0.7),
  vel: new Vec2(0, 0),
  target: new Vec2(canvas.width * 0.7, canvas.height * 0.7)
};


// spring parameters
const K = 0.02;
const DAMPING = 0.85;

// basic spring + damping update
function updateSpring(p) {
  const diff = p.pos.sub(p.target);
  const force = diff.mul(-K);

  p.vel = p.vel.add(force);
  p.vel = p.vel.mul(DAMPING);
  p.pos = p.pos.add(p.vel);
}


// cubic bezier equation
function bezierPoint(t) {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;

  return P0.mul(uu * u)
    .add(P1.pos.mul(3 * uu * t))
    .add(P2.pos.mul(3 * u * tt))
    .add(P3.mul(tt * t));
}


// derivative (tangent)
function bezierTangent(t) {
  const u = 1 - t;

  return P1.pos.sub(P0).mul(3 * u * u)
    .add(P2.pos.sub(P1.pos).mul(6 * u * t))
    .add(P3.sub(P2.pos).mul(3 * t * t));
}


// mouse controls the rope
window.addEventListener("mousemove", (e) => {
  P1.target = new Vec2(e.clientX, e.clientY);
  P2.target = new Vec2(
    canvas.width - e.clientX,
    canvas.height - e.clientY
  );
});


// draw a small circle for control points
function drawPoint(p, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
  ctx.fill();
}


// main draw
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // curve
  ctx.strokeStyle = "#00ffaa";
  ctx.lineWidth = 3;
  ctx.beginPath();

  for (let t = 0; t <= 1; t += 0.01) {
    const p = bezierPoint(t);
    if (t === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // tangents
  ctx.strokeStyle = "#faf6f7";
  ctx.lineWidth = 1;

  for (let t = 0; t <= 1; t += 0.1) {
    const p = bezierPoint(t);
    const tan = bezierTangent(t).normalize().mul(160);

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + tan.x, p.y + tan.y);
    ctx.stroke();
  }

  // control points
  drawPoint(P0, "#ffffff");
  drawPoint(P3, "#ffffff");
  drawPoint(P1.pos, "#ffaa00");
  drawPoint(P2.pos, "#ffaa00");
}


// animation loop
function loop() {
  updateSpring(P1);
  updateSpring(P2);

  render();
  requestAnimationFrame(loop);
}

loop();
